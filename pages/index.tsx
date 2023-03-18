import { GetServerSideProps, NextPage } from "next"
import Link from "next/link"
import { useState, useEffect } from "react"
import { BsFillPersonFill, BsFilterSquare } from "react-icons/bs"
import { GiPodium } from "react-icons/gi"
import { MdOutlineClass } from "react-icons/md"
import BirthdayWidget from "../components/BirthdayWidget"
import prisma from "../components/Client"
import DeprecatedWidget from "../components/DeprecatedWidget"
import Footer from "../components/Footer"
import Header from "../components/Header"
import InactiveWidget from "../components/InactiveWidget"
import NoCourseWidget from "../components/NoCourseWidget"


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

type course_participation = {
    studentId: string,
    courseId: string,
}

type props = {
    students: student[],
    courses: course[],
    answers: answer[],
    annotations: annotation[],
    sessions: session[],
    course_participations: course_participation[]
}

const Home: NextPage<props> = ({students, courses, answers, annotations, sessions, course_participations}) => {

    // courses with their ratings
    const [courseData, setCourseData] = useState<{rating: number, course: course}[]>([])
    // students with their ratings
    const [studentData, setStudentData] = useState<{rating: number, student: student}[]>([])

    // filter menu for course listing
    const [filterMenuOpen, setFilterMenuOpen] = useState<boolean>(false)
    const [filterMenuValue, setFilterMenuValue] = useState<number>(3)

    const leaderboardColors = [
        "text-amber-400",
        "text-slate-400",
        "text-amber-700"
    ]

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

    const calculateCourseData = () => {

        const coursesWithRatings: {course: course, rating: number}[] = []
        
        // calculate every cousres rating and the number of students in each course

        courses.map(course => {

            // get all the answers and annotations in the course
            const answersInCourse = answers.filter(answer => {
                const session = sessions.find(session => session.id == answer.sessionId)
                if(session == undefined) return
                return session.courseId == course.id
            })
            const annotationsInCourse = annotations.filter(annotation => {
                const session = sessions.find(session => session.id == annotation.sessionId)
                if(session == undefined) return
                return session.courseId == course.id
            })

            // how important is quantity and quality?
            const quantityValue = course.quantityValue / 100
            const qualityValue = 1 - quantityValue

            let averageAnswerQuality = 0
            if(answersInCourse.length > 0) {
                averageAnswerQuality = answersInCourse.reduce((totalQuality, nextAnswer) => totalQuality + nextAnswer.quality, 0) / answers.length
            }

            // calculate partial rating
            let rating = 0
            if(answersInCourse.length > 0) {
                rating = Math.ceil(averageAnswerQuality * qualityValue + answers.length * 2 * quantityValue)
            }

            // finish calculating rating 
            annotationsInCourse.map(annotation => annotation.type == 0 ? rating++ : rating--)
            

            coursesWithRatings.push({
                course: course,
                rating: rating,
            })
            
        })

        // sort courses according to filter selection
        if(filterMenuValue == 1) {
            // sort by rating
            coursesWithRatings.sort((a,b) => b.rating - a.rating)
        } else if(filterMenuValue == 2) {
            // sort by student count
            coursesWithRatings.sort((a,b) => b.course._count.course_participation - a.course._count.course_participation)
        }
        else if(filterMenuValue == 3) {
            // sort by year
            coursesWithRatings.sort((a,b) => b.course.year - a.course.year)
        }

        setCourseData([...coursesWithRatings])

    }

    useEffect(() => {
        calculateStudentData()
    }, [])

    useEffect(() => {
        calculateCourseData()
    }, [filterMenuValue])

    return (
        <div className="min-h-screen flex flex-col justify-between items-center">
            <Header />

            <main className="flex flex-col items-center justify-center py-2 w-full max-w-7xl">

                <div className="flex flex-col w-full lg:flex-row items-center lg:items-start justify-start lg:space-x-10 !px-5 xl:px-0">

                    {/* LEADERBOARD */}
                    <div className="w-full max-w-lg bg-white flex flex-col items-center justify-center border border-zinc-500 rounded-md !mt-10 p-3 relative">

                        <div className="w-full flex flex-col items-center justify-center space-y-2 border-b border-zinc-500 pb-1 mx-4 text-stone-800">
                            <h1 className="text-center text-2xl font-md">All-Time Bestenliste</h1>
                            <Link href="/leaderboard" className="text-blue-500 underline">Alle anzeigen</Link>
                        </div>

                        <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5">
                            {studentData.map((object, index) => {
                                if(index >= 10) return
                                return (
                                    <Link href={`/student/${object.student.id}`} key={object.student.id} className="flex flex-row justify-between items-center w-full text-stone-800 text-lg border-b border-zinc-500 border-dashed last:border-0 py-2 cursor-pointer hover:bg-slate-50" >
                                                
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
                            })}
                        </div>

                    </div>

                    <div className="flex flex-col w-full items-center justify-center lg:items-start">

                        {/* COURSE LISTING */}
                        <div className="w-full max-w-xl lg:max-w-4xl bg-white flex flex-col items-center justify-center border border-zinc-500 rounded-md !mt-10 p-3 relative ">

                            <div className="w-full flex flex-col items-center justify-center space-y-2 border-b border-zinc-500 pb-1 mx-4 text-stone-800">
                                <h1 className="text-center text-2xl font-md">Meine Kurse</h1>

                                <button onClick={() => setFilterMenuOpen(!filterMenuOpen)} className="flex flex-row items-center justify-center space-x-1 cursor-pointer">
                                    <BsFilterSquare />
                                    <p>Filter</p>
                                </button>

                                <div className={`w-full flex flex-row items-center justify-between space-x-2 !mb-2 transition-all duration-300 ${filterMenuOpen ? "" : "opacity-0 -translate-y-10 absolute"}`}>
                                    <button onClick={() => setFilterMenuValue(1)} className={`w-full border border-zinc-500 rounded-3xl ${filterMenuValue == 1 ? "bg-blue-500 text-slate-50 border-slate-50" : "hover:bg-slate-50"}`}>Nach Rating</button>
                                    <button onClick={() => setFilterMenuValue(2)} className={`w-full border border-zinc-500 rounded-3xl ${filterMenuValue == 2 ? "bg-blue-500 text-slate-50 border-slate-50" : "hover:bg-slate-50"}`}>Nach Anzahl der Schüler</button>
                                    <button onClick={() => setFilterMenuValue(3)} className={`w-full border border-zinc-500 rounded-3xl ${filterMenuValue == 3 ? "bg-blue-500 text-slate-50 border-slate-50" : "hover:bg-slate-50"}`}>Nach Klassenstufe</button>
                                </div>
                            </div>

                            <div className=" max-h-56 h-full w-full overflow-scroll no-scrollbar">
                                <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5">
                                    {courseData.map((object, index) => {
                                        return (
                                            <Link href={`/course/${object.course.id}`} key={object.course.id} className="flex flex-row justify-between items-center w-full text-stone-800 text-lg border-b border-zinc-500 border-dashed last:border-0 py-2 cursor-pointer hover:bg-slate-50" >
                                                        
                                                <div className="w-full flex flex-row items-center justify-between space-x-2">
                                                    <p className="w-full">{object.course.title}</p>
                                                    <div className="flex flex-row space-x-1 items-center justify-center w-20">
                                                        <GiPodium className="w-5 h-5"/>
                                                        <p className="text-right">{object.rating}</p>
                                                    </div>
                                                    <div className="flex flex-row space-x-1 items-center justify-center w-20">
                                                        <BsFillPersonFill className="w-5 h-5"/>
                                                        <p className="text-right">{object.course._count.course_participation}</p>
                                                    </div>
                                                    <div className="flex flex-row space-x-1 items-center justify-center w-20">
                                                        <MdOutlineClass className="w-5 h-5"/>
                                                        <p className="text-right">{object.course.year}</p>
                                                    </div>
                                                </div>
                                                
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex flex-col xl:flex-row items-center xl:items-start justify-center">

                            {/* BIRTHDAY WIDGET */}
                            <BirthdayWidget students={students} />

                            {/* NO COURSE WIDGET */}
                            <NoCourseWidget students={students} />

                        </div>

                        <div className="w-full flex flex-col xl:flex-row items-center xl:items-start justify-center">

                            {/* INACTIVE WIDGET */}
                            <InactiveWidget courses={courses} sessions={sessions} />

                            {/* DEPRECATED WIDGET */}
                            <DeprecatedWidget courses={courses} />

                        </div>

                    </div>

                </div>

            </main>

            <Footer />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {

    const students = await prisma.student.findMany({
        include: {
            _count: {
                select: {
                    course_participation: true
                }
            }
        }
    })

    const courses = await prisma.course.findMany({
        include: {
            _count: {
                select: {
                    course_participation: true
                }
            }
        }
    })

    const sessions = await prisma.session.findMany()

    const answers = await prisma.answer.findMany()

    const annotations = await prisma.annotation.findMany()

    const course_participations = await prisma.course_Participation.findMany()

    return {
        props: {students, courses, sessions, answers, annotations, course_participations}
    }
}

export default Home