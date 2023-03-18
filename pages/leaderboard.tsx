import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GiPodium } from "react-icons/gi";
import prisma from "../components/Client";
import Footer from "../components/Footer";
import Header from "../components/Header";

type student = {
    id: string,
    name: string,
    sirname: string,
    dateOfBirth: string,
    visuals: number,
    gender: number,
    _count: {
        course_participation: number
    }
}

type course = {
    id: string,
    title: string,
    year: number,
    subject: string,
    quantityValue: number,
    created: string,
    _count: {
        course_participation: number
    }
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
    date: string,
}

type props = {
    students: student[],
    courses: course[],
    answers: answer[],
    annotations: annotation[],
    sessions: session[],
}

const Leaderboard: NextPage<props> = ({students, sessions, answers, annotations, courses}) => {

    // students with their ratings
    const [studentData, setStudentData] = useState<{rating: number, student: student}[]>([])

    const calculateStudentData = () => {
        const studentsWithRatings: {student: student, rating: number}[] = []

        // calculate the rating of every student

        students.map(student => {

            let rating = 0
            const answersOfStudent = answers.filter(answer => answer.studentId == student.id)
            
            let averageAnswerQuality = 0
            if(answersOfStudent.length > 0) {
                averageAnswerQuality = answersOfStudent.reduce((totalQuality, nextAnswer) => totalQuality + nextAnswer.quality, 0) / answersOfStudent.length
            }

            /*
            // More efficient solution, but rating differs from the one on the student page
            const annotationsOfStudent = annotations.filter(annotation => annotation.studentId == student.id)
            answersOfStudent.map(answer => {
                const session = sessions.find(session => session.id = answer.sessionId)
                if(session == undefined) return

                const course = courses.find(course => course.id == session.courseId)
                if(course == undefined) return

                const quantityValue = course.quantityValue / 100
                const qualityValue = 1 - quantityValue

                rating += Math.ceil(2 * quantityValue)
                rating += Math.ceil(averageAnswerQuality / answersOfStudent.length * qualityValue)
            })

            annotationsOfStudent.map(annotation => {
                annotation.type == 0 ? rating++ : rating--
            })
            */
            
            // VERY inefficient, need better solution
            sessions.map(session => {
                const course = courses.find(course => course.id == session.courseId)
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
            

            studentsWithRatings.push({
                rating: rating,
                student: student
            })
        })

        // sort by rating
        studentsWithRatings.sort((a,b) => b.rating - a.rating)

        setStudentData([...studentsWithRatings])
    }

    useEffect(() => {
        calculateStudentData()
    }, [])

    const leaderboardColors = [
        "text-amber-400",
        "text-slate-400",
        "text-amber-700"
    ]

    return (
        <div className="min-h-screen flex flex-col justify-between space-y-10">
            <Header />

            <main className="flex flex-col items-center justify-center">
                <div className="max-w-lg md:max-w-2xl lg:max-w-4xl w-full flex flex-col items-center justify-center">
                    <div className="w-full text-4xl text-blue-400 border-b border-zinc-500 px-4 text-center md:text-left md:mx-4 py-2 flex flex-col items-left justify-center">

                        <div className="flex flex-row items-center justify-start space-x-3">
                            <h1>All-Time Leaderboard</h1>
                        </div>

                    </div>
                </div>

                <div className="max-w-2xl w-full flex flex-col items-center justify-center space-y-10 mt-10">
                    <div className="flex flex-col items-center justify-center w-full space-y-2">
                        {
                            studentData.map((object, index) => {

                                return (
                                    <Link href={`/student/${object.student.id}`} key={object.student.id} className="flex flex-row space-x-4 justify-between items-center w-full bg-white text-stone-800 text-lg border border-zinc-500 p-2 rounded-sm hover:bg-slate-50" >
                                                
                                        <div className="w-full flex flex-row items-center justify-between space-x-2">
                                            <p className={`font-semibold ${index <= 2 ? leaderboardColors[index] : "text-stone-800"}`}>{index+1}.</p>
                                            <p className="w-full">{object.student.sirname}, {object.student.name}</p>
                                            <div className="flex flex-row space-x-1 items-center justify-center w-20">
                                                <GiPodium className="w-5 h-5"/>
                                                <p className="text-right">{object.rating}</p>
                                            </div>
                                        </div>
                                        
                                    </Link>
                                )
                            })
                        }
                    </div>

                    {studentData.length == 0 && (
                        <p>Hier ist noch nichts los...</p>
                    )}
                </div>

            </main>

            <Footer />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {

    const students = await prisma.student.findMany()

    const sessions = await prisma.session.findMany()

    const answers = await prisma.answer.findMany()
    
    const annotations = await prisma.annotation.findMany()

    const courses = await prisma.course.findMany()

    return {
        props: {students, sessions, answers, annotations, courses}
    }
}

export default Leaderboard