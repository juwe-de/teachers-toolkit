import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { MdCancel, MdEdit } from "react-icons/md";
import prisma from "../../../components/Client";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import { BsFillHandThumbsDownFill, BsFillHandThumbsUpFill, BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { FaBirthdayCake } from "react-icons/fa"
import { AiOutlineEyeInvisible } from "react-icons/ai"
import { HiHandRaised } from "react-icons/hi2";
import Link from "next/link";

type student = {
    id: string,
    name: string,
    sirname: string,
    dateOfBirth: string,
    visuals: number,
    gender: number
}

type course = {
    id: string,
    title: string,
    year: number,
    subject: string,
    quantityValue: number
}

type answer = {
    id: string,
    quality: number,
    sessionId: string,
    studentId: string,
}

type annotation = {
    id: string,
    type: number,
    description: string,
    sessionId: string,
    studentId: string,
}

type session = {
    id: string,
    courseId: string,
}

type props = {
    student: student,
    courses: course[],
    answers: answer[],
    annotations: annotation[],
    sessions: session[],
    allCourses: course[]
}

const Student: NextPage<props> = ({student, courses, answers, annotations, sessions, allCourses}) => {

    const router = useRouter()

    const dateOfBirth = new Date(parseInt(student.dateOfBirth))

    const sights = [
        "Keine Sichtprobleme",
        "Kurzsichtig",
        "Weitsichtig",
    ]

    const calculateRating = () => {

        let rating = 0

        let averageAnswerQuality = 0
        if(answers.length > 0) {
            averageAnswerQuality = answers.reduce((totalQuality, nextAnswer) => totalQuality + nextAnswer.quality, 0) / answers.length
        }

        sessions.map(session => {
            const course = allCourses.find(course => course.id == session.courseId)
            const answersInSession = answers.filter(answer => answer.sessionId == session.id && answer.studentId == student.id)
            const annotationsInSession = annotations.filter(annotation => annotation.sessionId == session.id && annotation.studentId == student.id)

            if(course == undefined) return

            // how important is quantity and quality?
            const quantityValue = course.quantityValue / 100
            const qualityValue = 1 - quantityValue

            // calculate partial rating
            if(answersInSession.length > 0) {
                rating += Math.ceil(averageAnswerQuality * qualityValue + answersInSession.length * 2 * quantityValue)
            }

            // finish calculating rating 
            annotationsInSession.map(annotation => annotation.type == 0 ? rating++ : rating--)
        })

        return rating

    }
    
    const deleteStudent = async () => {

        if(!confirm("Willst du diesen Schüler wirklich löschen? Er/Sie wird aus allen Kursen, Sitzplänen, Gruppeneinteilungen und Sessions entfernt. DIES KANN NICHT RÜCKGÄNGIG GEMACHT WERDEN")) return

        await fetch(`/api/student/${student.id}/delete`)

        router.push("/")

    }

    return (
        <div className="min-h-screen flex flex-col justify-between space-y-10">
            <Header />

            <main className="flex-col items-center justify-center flex w-full">

                <div className="max-w-lg md:max-w-2xl lg:max-w-4xl w-full flex flex-col items-center justify-center">
                    <div className="w-full text-4xl text-blue-400 border-b border-zinc-500 px-4 text-center md:text-left md:mx-4 py-2 flex flex-col items-left justify-center">

                        <div className="flex flex-row items-center justify-start space-x-3">
                            <h1>{student.sirname}, {student.name}</h1>
                            <button onClick={() => router.push(`/student/${student.id}/edit`)} className="w-8 h-8 bg-white border border-zinc-500 rounded-md flex items-center justify-center cursor-pointer"><MdEdit className="h-6 w-6 text-stone-800" /></button>
                        </div>

                        <div className="flex flex-row items-center justify-start text-stone-800 text-sm space-x-5">
                            <div className="flex flex-row items-center justify-center space-x-1">{student.gender == 0 ? (<BsGenderMale className="w-5 h-5" />) : (<BsGenderFemale className="w-5 h-5" />)}</div>
                            <div className="flex flex-row items-center justify-center space-x-1">
                                <FaBirthdayCake className="w-5 h-5" />
                                <div className="flex flex-row items-left justify-center text-lg">
                                    <p className="ml-1">{dateOfBirth.getDate() < 10 ? "0" : ""}{dateOfBirth.getDate()}.</p>
                                    <p>{dateOfBirth.getMonth() + 1 < 10 ? "0" : ""}{dateOfBirth.getMonth() + 1}.</p>
                                    <p>{dateOfBirth.getFullYear()}</p>
                                </div>
                            </div>
                            <div className="flex flex-row items-center justify-center space-x-1">
                                <AiOutlineEyeInvisible className="w-5 h-5" />
                                <p className="text-lg">{sights[student.visuals]}</p>
                            </div>
                        </div>

                    </div>

                    <div className="w-full max-w-2xl flex flex-col items-center justify-center mt-10 space-y-10 px-4">
                        <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full border border-green-500 text-green-500 bg-white">
                            <p className="text-xs">Rating</p>
                            <p className="font-semibold">{calculateRating()}</p>
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-center space-x-4 mt-2">
                        <div className="flex flex-row items-center justify-center space-x-2">
                            <BsFillHandThumbsUpFill className="text-yellow-400 h-6 w-6" />
                            <Link href={`/student/${student.id}/positives`} className="text-xl font-semibold text-blue-600 underline cursor-pointer">{annotations.filter(annotation => annotation.type == 0).length}</Link>
                        </div>
                        <div className="flex flex-row items-center justify-center space-x-2">
                            <BsFillHandThumbsDownFill className="text-yellow-400 h-6 w-6" />
                            <Link href={`/student/${student.id}/negatives`} className="text-xl font-semibold text-blue-600 underline cursor-pointer">{annotations.filter(annotation => annotation.type == 1).length}</Link>
                        </div>
                        <div className="flex flex-row items-center justify-center space-x-2">
                            <HiHandRaised className="text-yellow-400 h-6 w-6" />
                            <Link href={`/student/${student.id}/answers`} className="text-xl font-semibold text-blue-600 underline cursor-pointer">{answers.length}</Link>
                        </div>
                    </div>

                    <div className="w-full max-w-2xl bg-white flex flex-col items-center justify-center border border-zinc-500 rounded-md !mt-10 p-3 relative">

                        <div className="w-full flex flex-col items-center justify-center space-y-2 border-b border-zinc-500 pb-1 mx-4 text-stone-800">
                            <h1 className="text-center text-2xl font-md">Kurse von {student.name}</h1>
                        </div>
                        
                        <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5">
                            {/* List all of the courses */}
                            {
                                courses.length == 0 ? (<p>Dieser Schüler ist in keinem Kurs...</p>) : courses.map(course => {
                                    return(
                                        <Link href={`/course/${course.id}`} key={course.id} className="flex flex-row justify-between items-center w-full text-stone-800 text-lg border-b border-zinc-500 border-dashed last:border-0 py-2 cursor-pointer hover:bg-slate-50" >
                                            
                                            <div className="w-full flex flex-row items-center justify-between">
                                                <p className="w-full font-semibold">{course.title}</p>
                                                <p className="w-52">{course.subject}, Jahrgang {course.year}</p>
                                            </div>
                                            
                                        </Link>
                                    )
                                })
                            }
                        </div>

                    </div>

                </div>

                <div className="w-full flex items-center justify-center mt-3">
                    <button onClick={() => deleteStudent()} className="bg-red-500 text-slate-50 text-xl text-center p-2 rounded-md flex flex-row items-center justify-center font-semibold space-x-3"><MdCancel className="h-6 w-6 mr-3" /> Löschen</button>
                </div>
            
            </main>

            <Footer />

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const studentId = context.query.id?.toString()

    const student = await prisma.student.findFirst({
        where: {
            id: studentId
        }
    })

    // courses where student is member
    const courses = await prisma.course.findMany({
        where: {
            course_participation: {
                some: {
                    student: {
                        id: studentId
                    }
                }
            }
        }
    })

    const allCourses = await prisma.course.findMany()

    const answers = await prisma.answer.findMany({
        where: {
            student: {
                id: studentId
            }
        }
    })

    const annotations = await prisma.annotation.findMany({
        where: {
            student: {
                id: studentId
            }
        }
    })

    const sessions = await prisma.session.findMany({
        where: {
            course: {
                course_participation : {
                    some: {
                        student: {
                            id: studentId
                        }
                    }
                }
            }
        }
    })

    return {
        props: {student, courses, answers, annotations, sessions, allCourses}
    }
}

export default Student