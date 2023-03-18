import { GetServerSideProps, NextPage } from "next";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import prisma from "../../../components/Client";
import Seat from "../../../components/session/Seat";
import { useEffect, useState } from "react";
import AnnotationModal from "../../../components/session/AnnotationModal";
import AnswerModal from "../../../components/session/AnswerModal";
import SingletonRouter, { Router, useRouter } from "next/router";
import EndSessionModal from "../../../components/session/EndSessionModal";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdCancel, MdOutlineClass, MdSubject } from "react-icons/md";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { BsGenderFemale, BsGenderMale, BsFillHandThumbsUpFill, BsFillHandThumbsDownFill } from "react-icons/bs";
import { HiHandRaised } from "react-icons/hi2"

type session = {
    id: string,
    description: string,
    topic: string,
    duration: number,
    date: string,
}

type student = {
    id: string,
    name: string,
    sirname: string,
    dateOfBirth: string,
    gender: number,
    visuals: number
}

type seat = {
    student: student,
    index: number,
}

type course = {
    id: string,
    quantityValue: number
}

type answer = {
    id: string,
    quality: number,
    studentId: string,
}

type annotation = {
    id: string,
    type: number,
    description: string,
    studentId: string,
}

type props = {
    session: session,
    seats: seat[],
    course: course,
    students: student[],
    answers: answer[],
    annotations: annotation[]
}

const Session: NextPage<props> = ({session, seats, course, students, answers, annotations}) => {

    // list of students with ratings, sorted by ratings
    // only relevant for completed sessions
    const [studentData, setStudentData] = useState<{student: student, rating: number}[]>([])

    const [showAnnotationModal, setShowAnnotationModal] = useState<boolean>(false)
    const [showAnswerModal, setShowAnswerModal] = useState<boolean>(false)
    const [showEndSessionModal, setShowEndSessionModal] = useState<boolean>(false)
    const [annotationType, setAnnotationType] = useState<number>(0)
    const [modalStudentId, setModalStudentId] = useState<string>("")

    const router = useRouter()

    const date = new Date(parseInt(session.date))

    const leaderboardColors = [
        "text-amber-400",
        "text-slate-400",
        "text-amber-700"
    ]

    const calculateStudentRatings = () => {
        const studentsWithRatings: {student: student, rating: number}[] = []

        // how important is quantity and quality?
        const quantityValue = course.quantityValue / 100
        const qualityValue = 1 - quantityValue

        students.map(student => {
            // get answers and annotations of the student
            const answersOfStudent = answers.filter((answer) => answer.studentId == student.id)
            const annotationsOfStudent = annotations.filter((annotation) => annotation.studentId == student.id)

            // calculate avg answer quality
            let averageAnswerQuality = 0
            if(answersOfStudent.length > 0) {
                averageAnswerQuality = answersOfStudent.reduce((totalQuality, nextAnswer) => totalQuality + nextAnswer.quality, 0) / answersOfStudent.length
            }

            // calculate partial rating
            let rating = Math.ceil(averageAnswerQuality * qualityValue + answersOfStudent.length * 2 * quantityValue)

            // finish calculating rating 
            annotationsOfStudent.map(annotation => annotation.type == 0 ? rating++ : rating--)

            studentsWithRatings.push({student: student, rating: rating})
        })

    
        // sort by rating
        studentsWithRatings.sort((a,b) => b.rating - a.rating)

        setStudentData([...studentsWithRatings])
    }

    useEffect(() => {
        calculateStudentRatings()
    }, [])

    const openAnnotationModal = (studentId: string, type: number) => {
        setModalStudentId(studentId)
        setAnnotationType(type)
        setShowAnnotationModal(true)
    }

    const openAnswerModal = (studentId: string) => {
        setModalStudentId(studentId)
        setShowAnswerModal(true)
    }

    // saving answers and annotations directly to the database is benefitial as you get live updates when you visit the course or landing page
    // during the session

    const saveAnnotation = async (description: string, type: number) => {
        await fetch(`/api/session/${router.query.id}/add/annotation`, {
            body: JSON.stringify({
                studentId: modalStudentId,
                type: type,
                description: description
            }),
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })

        setShowAnnotationModal(false)
    }

    const saveAnswer = async (quality: number) => {
        await fetch(`/api/session/${router.query.id}/add/answer`, {
            body: JSON.stringify({
                studentId: modalStudentId,
                quality: quality
            }),
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })

        setShowAnswerModal(false)
    }

    const endSession = async (topic: string, description: string) => {
        await fetch(`/api/session/${router.query.id}/end`, {
            body: JSON.stringify({
                topic: topic,
                description: description
            }),
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })

        router.reload()
    }

    const deleteSession = async () => {
        if(!confirm("Willst du wirklich die Session löschen? Alle Ratings werden auf den Stand von vor der Session zurückgesetzt. Dies kann nicht rückgängig gemacht werden")) return

        await fetch(`/api/session/${router.query.id}/delete`)

        router.push(`/course/${course.id}`)
    }

    // shown when the session has ended (sesion summary)
    const completeSession = (
        <div className="min-h-screen flex flex-col justify-between space-y-10">
            <Header />

            <main className="flex-col items-center justify-center flex w-full">

                <div className="max-w-lg md:max-w-2xl lg:max-w-4xl w-full flex flex-col items-center justify-center">
                    <div className="w-full text-4xl text-blue-400 border-b border-zinc-500 px-4 text-center md:text-left md:mx-4 py-2 flex flex-col items-left justify-center">

                        <div className="flex flex-row items-center justify-start space-x-3">
                            <h1>{session.topic}</h1>
                        </div>

                        <div className="flex flex-row items-center justify-start text-stone-800 text-sm space-x-2">
                            <div className="flex flex-row items-center justify-center space-x-1">
                                <BsFillCalendarDateFill className="w-4 h-4" />
                                <div className="flex flex-row items-left justify-center">
                                    Gehalten am 
                                    <p className="ml-1">{date.getDate() < 10 ? "0" : ""}{date.getDate()}.</p>
                                    <p>{date.getMonth() + 1 < 10 ? "0" : ""}{date.getMonth() + 1}.</p>
                                    <p>{date.getFullYear()}</p>
                                </div>
                            </div>
                            <div className="flex flex-row items-center justify-center space-x-2">
                                <AiOutlineClockCircle className="w-4 h-4" />
                                {session.duration} Minuten
                            </div>
                        </div>
                    </div>

                    {session.description != "" && (<p className="mt-5 text-lg max-w-2xl px-2 text-center">
                        {session.description}
                    </p>)}

                    <p className="text-2xl font-semibold mt-10">Insgesamt</p>

                    <div className="flex flex-row items-center justify-center space-x-4 mt-2">
                        <div className="flex flex-row items-center justify-center space-x-2">
                            <BsFillHandThumbsUpFill className="text-yellow-400 h-6 w-6" />
                            <p className="text-xl font-semibold">{annotations.filter(annotation => annotation.type == 0).length}</p>
                        </div>
                        <div className="flex flex-row items-center justify-center space-x-2">
                            <BsFillHandThumbsDownFill className="text-yellow-400 h-6 w-6" />
                            <p className="text-xl font-semibold">{annotations.filter(annotation => annotation.type == 1).length}</p>
                        </div>
                        <div className="flex flex-row items-center justify-center space-x-2">
                            <HiHandRaised className="text-yellow-400 h-6 w-6" />
                            <p className="text-xl font-semibold">{answers.length}</p>
                        </div>
                    </div>

                    <div className="w-full max-w-2xl bg-white flex flex-col items-center justify-center border border-zinc-500 rounded-md !mt-10 p-3 relative">

                        <div className="w-full flex flex-col items-center justify-center space-y-2 border-b border-zinc-500 pb-1 mx-4 text-stone-800">
                            <h1 className="text-center text-2xl font-md">Leaderboard</h1>
                        </div>
                        
                        <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5">
                            {/* List all of the students */}
                            {
                                studentData.map((object, index) => {
                                    const rating = object.rating
                                    const student = object.student
                                    return(
                                        <div key={student.id} className="flex flex-row justify-between items-center w-full text-stone-800 text-lg border-b border-zinc-500 border-dashed last:border-0 py-2 cursor-pointer hover:bg-slate-50 space-x-2">
                                            <p className={`${index <= 2 ? leaderboardColors[index] : "text-stone-800"} ${index <= 2 ? "font-semibold" : ""}`}>
                                                {index + 1}.
                                            </p>
                                            <div className="w-80 flex flex-row items-center justify-between">
                                                <p className="w-full">{student.sirname}, {student.name}</p>
                                            </div>
                                            <p>
                                                {rating}
                                            </p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                <div className="w-full flex items-center justify-center mt-3">
                    <button onClick={() => deleteSession()} className="bg-red-500 text-slate-50 text-xl text-center p-2 rounded-md flex flex-row items-center justify-center font-semibold space-x-3"><MdCancel className="h-6 w-6 mr-3" /> Löschen</button>
                </div>

            </main>

            <Footer />
        </div>
    )

    // shown when the session is still in progress (seatingplan ui)
    const incompleteSession = (
        <div className="min-h-screen flex flex-col justify-between space-y-10">
            <Header />

            <main className="flex-col items-center justify-center flex w-full">

                {/* seatingplan */}
                <div className="w-full flex items-center seatingplan-scrollable overflow-x-scroll">
                    <div className="w-[1800px] h-[695px] bg-white rounded-md flex flex-row justify-between p-3 space-x-2 !mt-10">

                        <div className="flex flex-col items-center justify-between space-y-10">
                            <div className="w-[500px] h-[400px] top-0 grid grid-cols-2 grid-rows-3 gap-1">
                                {
                                    // This is very ugly, but necessary to keep the functionality of placing students with visual impairments on 
                                    // proper seats simple (place them by index)
                                    seats.slice(0, 2).map(seat => {
                                        return (
                                            <Seat 
                                                seat={seat} 
                                                width={250}
                                                height={150}
                                                toggleAnnotationModal={(studentId: string, type: number) => openAnnotationModal(studentId, type)}
                                                toggleAnswerModal={(studentId: string) => openAnswerModal(studentId)}
                                            />
                                        )
                                    })
                                }
                                {
                                    seats.slice(6, 8).map(seat => {
                                        return (
                                            <Seat 
                                                seat={seat} 
                                                width={250}
                                                height={150}
                                                toggleAnnotationModal={(studentId: string, type: number) => openAnnotationModal(studentId, type)}
                                                toggleAnswerModal={(studentId: string) => openAnswerModal(studentId)} 
                                            />
                                        )
                                    })
                                }
                                {
                                    seats.slice(12, 14).map(seat => {
                                        return (
                                            <Seat 
                                                seat={seat} 
                                                width={250}
                                                height={150}
                                                toggleAnnotationModal={(studentId: string, type: number) => openAnnotationModal(studentId, type)}
                                                toggleAnswerModal={(studentId: string) => openAnswerModal(studentId)} 
                                            />
                                        )
                                    })
                                }
                            </div>
                            <div className="bg-white w-[150px] h-[75px] border border-zinc-500 flex flex-col items-center justify-center text-xs p-1">
                                <p className="text-lg font-semibold">Sniper</p>
                            </div>
                        </div>

                        <div className="w-[1200px] grid grid-cols-4 grid-rows-5 gap-1">
                            {
                                // This is very ugly, but necessary to keep the functionality of placing students with visual impairments on 
                                // proper seats simple (place them by index)
                                seats.slice(2, 6).map(seat => {
                                    return (
                                        <Seat 
                                            seat={seat} 
                                            width={250}
                                            height={150}
                                            toggleAnnotationModal={(studentId: string, type: number) => openAnnotationModal(studentId, type)}
                                            toggleAnswerModal={(studentId: string) => openAnswerModal(studentId)}
                                        />
                                    )
                                })
                            }
                            {
                                seats.slice(8, 12).map(seat => {
                                    return (
                                        <Seat 
                                            seat={seat} 
                                            width={250}
                                            height={150} 
                                            toggleAnnotationModal={(studentId: string, type: number) => openAnnotationModal(studentId, type)}
                                            toggleAnswerModal={(studentId: string) => openAnswerModal(studentId)}
                                        />
                                    )
                                })
                            }
                            {
                                seats.slice(14).map(seat => {
                                    return (
                                        <Seat 
                                            seat={seat} 
                                            width={250}
                                            height={150} 
                                            toggleAnnotationModal={(studentId: string, type: number) => openAnnotationModal(studentId, type)}
                                            toggleAnswerModal={(studentId: string) => openAnswerModal(studentId)}
                                        />
                                    )
                                })
                            }
                        </div>

                    </div>

                    
                </div>

                <button onClick={() => setShowEndSessionModal(true)} className="rounded-md bg-blue-400 text-slate-50 text-2xl font-semibold p-2 mt-10">
                    Session beenden
                </button>

                {/* Popup menu for creating annotations */}
                <AnnotationModal 
                    show={showAnnotationModal}
                    save={(description: string, type: number) => saveAnnotation(description, type)}
                    close={() => setShowAnnotationModal(false)}
                    type={annotationType}
                />

                {/* Popup menu for creating answers */}
                <AnswerModal 
                    show={showAnswerModal}
                    save={(quality: number) => saveAnswer(quality)}
                    close={() => setShowAnswerModal(false)}
                />

                <EndSessionModal
                    show={showEndSessionModal}
                    save={(topic: string, description: string) => endSession(topic, description)}
                    close={() => setShowEndSessionModal(false)}
                />
            </main>

            <Footer />
        </div>
    )

    return session.duration > 0 ? completeSession : incompleteSession
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const sessionId = context.query.id?.toString()
    const seatingplanId = context.query.seatingplanId?.toString()

    const session = await prisma.session.findFirst({
        where: {
            id: sessionId
        }
    })

    const seatsInDatabase = await prisma.seat.findMany({
        where: {
            seatingplan: {
                id: seatingplanId,
            }
        }
    })

    let seats: seat[] = []

    for(let i = 0; i < 26; i++) {
        let seat: any = seatsInDatabase.find(seat => seat.index == i)
        if(seat == undefined) {
            seat = {
                index: i,
                student: {
                    id: "",
                    name: "",
                    sirname: "",
                    dateOfBirth: "",
                    gender: -1,
                    visuals: -1
                }
            }
        } else {
            seat = {
                index: i,
                student: await prisma.student.findFirst({
                    where: {
                        id: seat.studentId?.toString()
                    }
                })
            }
        }
        seats.push(seat)
    }

    // ----------------------------- Stuff relevant for completed sessions -----------------------

    const course = await prisma.course.findFirst({
        where: {
            id: session?.courseId.toString()
        }
    })

    const students = await prisma.student.findMany({
        where: {
            course_participation: {
                some: {
                    course: {
                        id: session?.courseId.toString()
                    }
                }
            }
        }
    })

    const answers = await prisma.answer.findMany({
        where: {
            session: {
                id: sessionId
            }
        }
    })

    const annotations = await prisma.annotation.findMany({
        where: {
            session: {
                id: sessionId
            }
        }
    })

    

    return {
        props: {session, seats, course, students, answers, annotations}
    }
} 

export default Session