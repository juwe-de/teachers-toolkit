import { GetServerSideProps, NextPage } from "next"

import Footer from "../../../components/Footer"
import Header from "../../../components/Header"

import prisma from "../../../components/Client"
import { MdOutlineClass, MdSubject, MdEdit, MdCancel, MdSettingsRemote } from "react-icons/md"
import { AiOutlineClockCircle } from "react-icons/ai"
import { useEffect, useState } from "react"
import { BsGenderMale, BsGenderFemale, BsFilterSquare } from "react-icons/bs"
import { useRouter } from "next/router"
import Link from "next/link"
import { GiPodium, GiSwitzerland } from "react-icons/gi"

type course = {
    id: string,
    title: string,
    subject: string,
    year: number,
    created: string,
    quantityValue: number,
}

type student = {
    id: string,
    name: string,
    sirname: string,
    dateOfBirth: string,
    gender: number,
    visuals: number,
}

type answer = {
    studentId: string
    quality: number
}

type annotation = {
    studentId: string
    type: number
}

type grouping = {
    id: string,
    title: string,
    created: string,
}

type seatingplan = {
    id: string,
    title: string,
    created: string,
}

type session = {
    id: string,
    topic: string,
    date: string,
    duration: number
}

type props = {
    course: course,
    students: student[]
    answers: answer[]
    annotations: annotation[]
    groupings: grouping[]
    seatingplans: seatingplan[],
    sessions: session[]
}

const Course: NextPage<props> = ({course, students, groupings, seatingplans, sessions}) => {

    const created = new Date(parseInt(course.created))

    const [filterMenuOpen, setFilterMenuOpen] = useState<boolean>(false)
    const [filterMenuValue, setFilterMenuValue] = useState<number>(1)
    const SORT_BY_NAME = 1
    const SORT_BY_RATING = 2

    const [studentData, setStudentData] = useState<{student: student, rating: number}[]>([])
    const [courseRating, setCourseRating] = useState<number>(0)

    const router = useRouter()

    useEffect(() => {

        // calculate student ratings
        const calculateStudentRatings = async () => {
            const stduentsWithRatings: {student: student, rating: number}[] = []

            for(let student of students) {
                const ratingResponse = await fetch(`/api/student/${student.id}/rating`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        courseId: course.id
                    })
                })
    
                const ratingData = await ratingResponse.json()
    
                const rating = ratingData.rating

                stduentsWithRatings.push({student: student, rating: rating})
            }

            if(filterMenuValue == SORT_BY_NAME) {
                stduentsWithRatings.sort((a,b) => a.student.sirname.localeCompare(b.student.sirname))
            } else if(filterMenuValue == SORT_BY_RATING) {
                stduentsWithRatings.sort((a,b) => b.rating - a.rating)
            }

            setStudentData([...stduentsWithRatings])
            
        }

        calculateStudentRatings()

    }, [filterMenuValue])

    useEffect(() => {

        const calculateCourseRating = async () => {
            const ratingResponse = await fetch(`/api/course/${course.id}/rating`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const ratingData = await ratingResponse.json()

            setCourseRating(ratingData.rating)
        }

        calculateCourseRating()

    })

    const createSession = () => {
        if(seatingplans.length == 0) {
            alert("Bitte erstelle zuerst einen Sitzplan")
            return 
        }

        router.push(`/course/${course.id}/create/session`)
    }

    const deleteCourse = async () => {
        if(!confirm("Möchtest du den Kurs wirklich löschen? ALLES, was mit diesem Kurs in Verbindung steht, wird gelöscht. DIES KANN NICHT RÜCKGÄNGIG GEMACHT WERDEN!")) return

        await fetch(`/api/course/${course.id}/delete`)

        router.push("/")
    }

    return (
        <div className="min-h-screen flex flex-col justify-between space-y-10">
            <Header />

            <main className="flex flex-col items-center justify-center">
                <div className="max-w-lg md:max-w-2xl lg:max-w-4xl w-full flex flex-col items-center justify-center">
                    <div className="w-full text-4xl text-blue-400 border-b border-zinc-500 px-4 text-center md:text-left md:mx-4 py-2 flex flex-col items-left justify-center">

                        <div className="flex flex-row items-center justify-start space-x-3">
                            <h1>{course.title}</h1>
                            <button onClick={() => router.push(`/course/${course.id}/edit`)} className="w-8 h-8 bg-white border border-zinc-500 rounded-md flex items-center justify-center cursor-pointer"><MdEdit className="h-6 w-6 text-stone-800" /></button>
                        </div>

                        <div className="flex flex-row items-center justify-start text-stone-800 text-sm space-x-2">
                            <div className="flex flex-row items-center justify-center space-x-1 text-lg"><MdSubject className="w-5 h-5 mr-1" /> {course.subject}</div>
                            <div className="flex flex-row items-center justify-center space-x-1 text-lg"><MdOutlineClass className="w-5 h-5 mr-1" /> Jahrgang {course.year}</div>
                            <div className="flex flex-row items-center justify-center space-x-1 text-lg">
                                <AiOutlineClockCircle className="w-5 h-5" />
                                <div className="flex flex-row items-left justify-center text-lg">
                                    Erstellt am 
                                    <p className="ml-1">{created.getDate() < 10 ? "0" : ""}{created.getDate()}.</p>
                                    <p>{created.getMonth() + 1 < 10 ? "0" : ""}{created.getMonth() + 1}.</p>
                                    <p>{created.getFullYear()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full max-w-2xl flex flex-col items-center justify-center mt-10 space-y-10 px-4">

                        <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full border border-green-500 text-green-500 bg-white">
                            <p className="text-xs">Kurs-Rating</p>
                            <p className="font-semibold">{courseRating}</p>
                        </div>

                        <div className="w-full bg-white flex flex-col items-center justify-center border border-zinc-500 rounded-md !mt-10 p-3 relative">

                            <div className="w-full flex flex-col items-center justify-center space-y-2 border-b border-zinc-500 pb-1 mx-4 text-stone-800">
                                <h1 className="text-center text-2xl font-md">Schüler in diesem Kurs</h1>

                                <button onClick={() => setFilterMenuOpen(!filterMenuOpen)} className="flex flex-row items-center justify-center space-x-1 cursor-pointer">
                                    <BsFilterSquare />
                                    <p>Filter</p>
                                </button>

                                <div className={`w-full flex flex-row items-center justify-between space-x-2 !mb-2 transition-all duration-300 ${filterMenuOpen ? "" : "opacity-0 -translate-y-10 absolute"}`}>
                                    <button onClick={() => setFilterMenuValue(0)} className={`w-full border border-zinc-500 rounded-3xl ${filterMenuValue == 0 ? "bg-blue-500 text-slate-50 border-slate-50" : "hover:bg-slate-50"}`}>Nicht geordnet</button>
                                    <button onClick={() => setFilterMenuValue(1)} className={`w-full border border-zinc-500 rounded-3xl ${filterMenuValue == 1 ? "bg-blue-500 text-slate-50 border-slate-50" : "hover:bg-slate-50"}`}>Nach Name</button>
                                    <button onClick={() => setFilterMenuValue(2)} className={`w-full border border-zinc-500 rounded-3xl ${filterMenuValue == 2 ? "bg-blue-500 text-slate-50 border-slate-50" : "hover:bg-slate-50"}`}>Nach Rating</button>
                                </div>
                            </div>
                            
                            <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5">
                                {/* List all of the students */}
                                {
                                    students.length == 0 ? (<p>In diesem Kurs sind keine Schüler...</p>) : studentData.map(object => {
                                        return(
                                            <Link href={`/student/${object.student.id}`} key={object.student.id} className="flex flex-row justify-between items-center w-full text-stone-800 text-lg border-b border-zinc-500 border-dashed last:border-0 py-2 cursor-pointer hover:bg-slate-50" >
                                                
                                                <div className="w-80 flex flex-row items-center justify-between">
                                                    <p className="w-full">{object.student.sirname}, {object.student.name}</p>
                                                    {object.student.gender == 0 ? (<BsGenderMale />) : (<BsGenderFemale />)}
                                                </div>
                                                <div className="flex flex-row space-x-1 items-center justify-center w-20">
                                                    <GiPodium className="w-5 h-5"/>
                                                    <p className="text-right">{object.rating}</p>
                                                </div>
                                                
                                            </Link>
                                        )
                                    })
                                }
                            </div>

                            

                        </div>

                        <div className="w-full bg-white flex flex-col items-center justify-center border border-zinc-500 rounded-md !mt-20 p-3 relative">

                            <div className="w-full flex flex-col items-center justify-center space-y-2 border-b border-zinc-500 pb-1 mx-4 text-stone-800">
                                <h1 className="text-center text-2xl font-md">Gruppeneinteilungen</h1>
                            </div>

                            <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5">
                                {/* List all of the groupings */}
                                {
                                    groupings.map(object => {

                                        const createdTimeStamp = parseInt(object.created)
                                        const createdDate = new Date(createdTimeStamp)
                                        
                                        return (
                                            <Link href={`/grouping/${object.id}`} className="flex flex-row justify-between items-center w-full text-stone-800 text-lg border-b border-zinc-500 border-dashed last:border-0 py-2 cursor-pointer hover:bg-slate-50">
                                                <div className="w-80 flex flex-row items-center justify-between">
                                                    <p className="w-full">{object.title}</p>
                                                </div>
                                                <div className="flex flex-row items-center justify-end space-x-2">
                                                    <AiOutlineClockCircle />
                                                    <div className="flex flex-row items-left justify-center">
                                                        <p className="ml-1">{createdDate.getDate() < 10 ? "0" : ""}{createdDate.getDate()}.</p>
                                                        <p>{createdDate.getMonth() + 1 < 10 ? "0" : ""}{createdDate.getMonth() + 1}.</p>
                                                        <p>{createdDate.getFullYear()}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })
                                }
                                {groupings.length == 0 && (<p>In diesem Kurs wurden noch keine Gruppeneinteilungen erstellt...</p>)}
                                <Link href={`/course/${course.id}/create/grouping`} className={`w-full bg-slate-50 text-center text-lg border border-zinc-500 rounded-sm`}>+</Link>
                            </div>
                        </div>

                        <div className="w-full bg-white flex flex-col items-center justify-center border border-zinc-500 rounded-md !mt-20 p-3 relative">

                            <div className="w-full flex flex-col items-center justify-center space-y-2 border-b border-zinc-500 pb-1 mx-4 text-stone-800">
                                <h1 className="text-center text-2xl font-md">Sitzpläne</h1>
                            </div>

                            <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5">
                                {/* List all of the seatingplans */}
                                {
                                    seatingplans.map(object => {

                                        const createdTimeStamp = parseInt(object.created)
                                        const createdDate = new Date(createdTimeStamp)
                                        
                                        return (
                                            <Link href={`/seatingplan/${object.id}`} className="flex flex-row justify-between items-center w-full text-stone-800 text-lg border-b border-zinc-500 border-dashed last:border-0 py-2 cursor-pointer hover:bg-slate-50">
                                                <div className="w-80 flex flex-row items-center justify-between">
                                                    <p className="w-full">{object.title}</p>
                                                </div>
                                                <div className="flex flex-row items-center justify-end space-x-2">
                                                    <AiOutlineClockCircle />
                                                    <div className="flex flex-row items-left justify-center">
                                                        <p className="ml-1">{createdDate.getDate() < 10 ? "0" : ""}{createdDate.getDate()}.</p>
                                                        <p>{createdDate.getMonth() + 1 < 10 ? "0" : ""}{createdDate.getMonth() + 1}.</p>
                                                        <p>{createdDate.getFullYear()}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    })
                                }
                                {seatingplans.length == 0 && (<p>In diesem Kurs wurden noch keine Sitzpläne erstellt...</p>)}
                                <Link href={`/course/${course.id}/create/seatingplan`} className={`w-full bg-slate-50 text-center text-lg border border-zinc-500 rounded-sm`}>+</Link>
                            </div>
                        </div>

                        <div className="w-full bg-white flex flex-col items-center justify-center border border-zinc-500 rounded-md !mt-20 p-3 relative">

                            <div className="w-full flex flex-col items-center justify-center space-y-2 border-b border-zinc-500 pb-1 mx-4 text-stone-800">
                                <h1 className="text-center text-2xl font-md">Kürzliche Sessions</h1>
                                <Link href={`/course/${router.query.id}/sessions`} className="text-blue-500 underline">Alle anzeigen</Link>
                            </div>

                            <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5">
                                {/* List of 5 recent sessions */}
                                {
                                    sessions.map(object => {

                                        const createdTimeStamp = parseInt(object.date)
                                        const createdDate = new Date(createdTimeStamp)

                                        // only show sessions that happened within the pase week
                                        if(new Date().getTime() - createdDate.getTime() > 7 * 24 * 60 * 60 * 1000) return (<></>)
                                        
                                        return (
                                            <Link href={`/session/${object.id}`} className="flex flex-row justify-between items-center w-full text-stone-800 text-lg border-b border-zinc-500 border-dashed last:border-0 py-2 cursor-pointer hover:bg-slate-50">
                                                <div className="w-80 flex flex-row items-center justify-between">
                                                    <p className="w-full">{object.topic == "" ? "Laufende Session" : object.topic}</p>
                                                </div>

                                                {object.duration == 0 && (
                                                    <p className="py-1 px-2 text-green-500 border border-green-500 rounded-full text-lg font-semibold">
                                                        Session im Gange
                                                    </p>
                                                )}

                                                {object.duration > 0 && (<div className="flex flex-row items-center justify-end space-x-1">
                                                    <AiOutlineClockCircle />
                                                    <div className="flex flex-row items-left justify-center">
                                                        <p className="ml-1">{createdDate.getDate() < 10 ? "0" : ""}{createdDate.getDate()}.</p>
                                                        <p>{createdDate.getMonth() + 1 < 10 ? "0" : ""}{createdDate.getMonth() + 1}.</p>
                                                        <p>{createdDate.getFullYear()}</p>
                                                        <p>, {object.duration} {object.duration > 1 ? "Minuten" : "Minute"}</p>
                                                    </div>
                                                </div>)}
                                            </Link>
                                        )
                                    })
                                }
                                {sessions.length == 0 && (<p>In diesem Kurs wurden kürzlich keine Sessions gehalten...</p>)}
                                {
                                    sessions.filter(session => session.duration == 0).length == 0 && (
                                        <button onClick={() => createSession()} className={`w-full bg-slate-50 text-center text-lg border border-zinc-500 rounded-sm`}>+</button>
                                    )
                                }
                            </div>
                        </div>

                    </div>
                </div>

                <button onClick={() => deleteCourse()} className="bg-red-500 text-slate-50 text-xl text-center p-2 rounded-md flex flex-row items-center justify-center font-semibold space-x-3 mt-10"><MdCancel className="h-6 w-6 mr-3" /> Löschen</button>
            </main>

            <Footer />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context.params?.id

    const course = await prisma.course.findFirst({
        where: {
            id: id?.toString()
        }
    })

    const students = await prisma.student.findMany({
        where: {
            course_participation: {
                some: {
                    course: {
                        id: id?.toString()
                    }
                }
            }
        }
    })

    const groupings = await prisma.grouping.findMany({
        where: {
            course: {
                id: id?.toString()
            }
        }
    })

    const seatingplans = await prisma.seatingplan.findMany({
        where: {
            course: {
                id: id?.toString()
            }
        }
    })

    const sessions = await prisma.session.findMany({
        where: {
            course: {
                id: id?.toString()
            }
        }
    })

    sessions.sort((a, b) => new Date(parseInt(b.date)).getTime() - new Date(parseInt(a.date)).getTime())

    return {
        props: {course, students, groupings, seatingplans, sessions}
    }
}

export default Course