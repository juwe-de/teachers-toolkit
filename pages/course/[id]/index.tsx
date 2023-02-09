import { GetServerSideProps, NextPage } from "next"

import Footer from "../../../components/Footer"
import Header from "../../../components/Header"

import prisma from "../../../components/Client"
import { MdOutlineClass, MdSubject } from "react-icons/md"
import { AiOutlineClockCircle } from "react-icons/ai"
import StudentItem from "../../../components/StudentItem"
import ExistingStudentItem from "../../../components/ExistingStudentItem"

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

type props = {
    course: course,
    students: student[]
}

const Course: NextPage<props> = ({course, students}) => {

    const created = new Date(parseInt(course.created))

    return (
        <div className="min-h-screen flex flex-col justify-between space-y-10">
            <Header />

            <main className="flex flex-col items-center justify-center">
                <div className="max-w-lg md:max-w-2xl lg:max-w-4xl w-full flex flex-col items-center justify-center">
                    <div className="w-full text-4xl text-blue-400 border-b border-zinc-500 px-4 text-center md:text-left md:mx-4 py-2 flex flex-col items-left justify-center">
                        <h1>{course.title}</h1>
                        <div className="flex flex-row items-center justify-start text-stone-800 text-sm space-x-2">
                            <div className="flex flex-row items-center justify-center space-x-1"><MdSubject className="w-4 h-4" /> {course.subject}</div>
                            <div className="flex flex-row items-center justify-center space-x-1"><MdOutlineClass className="w-4 h-4" /> Jahrgang {course.year}</div>
                            <div className="flex flex-row items-center justify-center space-x-1">
                                <AiOutlineClockCircle className="w-4 h-4" />
                                <div className="flex flex-row items-left justify-center">
                                    Erstellt am 
                                    <p className="ml-1">{created.getDate() < 10 ? "0" : ""}{created.getDate()}.</p>
                                    <p>{created.getMonth() + 1 < 10 ? "0" : ""}{created.getMonth() + 1}.</p>
                                    <p>{created.getFullYear()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full max-w-2xl flex flex-col items-center justify-center mt-10 space-y-10 px-4">
                        <div className="w-full bg-white flex flex-col items-center justify-center border border-zinc-500 rounded-md !mt-10 p-3">
                            <h1 className="w-full text-center mx-4 text-2xl text-stone-800 border-b border-zinc-500 pb-1 font-md">Schüler in diesem Kurs</h1>
                            
                            <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5">
                                {/* List all of the students */}
                                {students.map((student) => {
                                    return (
                                        <ExistingStudentItem deleteStudent={() => {}} information={student} />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
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

    return {
        props: {course, students}
    }
}

export default Course