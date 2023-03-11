import { GetServerSideProps, NextPage } from "next"
import Footer from "../../../components/Footer"
import Header from "../../../components/Header"
import prisma from "../../../components/Client"
import Link from "next/link"
import { AiOutlineClockCircle } from "react-icons/ai"

type student = {
    id: string,
    name: string
}

type annotation = {
    id: string,
    description: string,
    sessionId: string,
}

type session = {
    id: string,
    date: string,
}

type props = {
    student: student,
    negativeAnnotations: annotation[],
    allSessions: session[]
}

const Negatives: NextPage<props> = ({student, negativeAnnotations, allSessions}) => {


    return (
        <div className="min-h-screen flex flex-col justify-between space-y-10">
            <Header />

            <main className="flex flex-col items-center justify-center">
                <div className="max-w-lg md:max-w-2xl lg:max-w-4xl w-full flex flex-col items-center justify-center">
                    <div className="w-full text-4xl text-blue-400 border-b border-zinc-500 px-4 text-center md:text-left md:mx-4 py-2 flex flex-col items-left justify-center">

                        <div className="flex flex-row items-center justify-start space-x-3">
                            <h1>Negative Anmerkungen zu {student.name}</h1>
                        </div>

                    </div>
                </div>

                <div className="max-w-2xl w-full flex flex-col items-center justify-center space-y-2 mt-10">
                    {
                        negativeAnnotations.map(annotation => {

                            const session = allSessions.find(session => session.id == annotation.sessionId)
                            if(session == undefined) return
                            const createdDate = new Date(parseInt(session.date))

                            return (
                                <div className="flex flex-row space-x-4 justify-between items-center w-full bg-white text-stone-800 text-lg border border-zinc-500 p-2 rounded-sm hover:bg-slate-50">
                                    <div className="w-full flex flex-row items-center justify-between">
                                        <p className="w-full">{annotation.description == "" ? "Keine Beschreibung" : annotation.description}</p>
                                    </div>

                                    <div className="flex flex-row items-center justify-end space-x-1">
                                        <AiOutlineClockCircle />
                                        <div className="flex flex-row items-left justify-center">
                                            <p className="ml-1">{createdDate.getDate() < 10 ? "0" : ""}{createdDate.getDate()}.</p>
                                            <p>{createdDate.getMonth() + 1 < 10 ? "0" : ""}{createdDate.getMonth() + 1}.</p>
                                            <p>{createdDate.getFullYear()}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }

                    {negativeAnnotations.length == 0 && (
                        <p>{student.name} hat keine negativen Anmerkungen erhalten.</p>
                    )}
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

    const negativeAnnotations = await prisma.annotation.findMany({
        where: {
            student: {
                id: studentId
            },
            type: 1
        }
    })

    const allSessions = await prisma.session.findMany()

    return {
        props: {student, negativeAnnotations, allSessions}
    }
}

export default Negatives