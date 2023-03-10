import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { AiOutlineClockCircle } from "react-icons/ai";
import prisma from "../../../components/Client";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";

type session = {
    id: string,
    topic: string,
    description: string,
    duration: number,
    date: string,
}

type course = {
    id: string,
    title: string
}

type props = {
    sessions: session[],
    course: course
}

const Sessions: NextPage<props> = ({sessions, course}) => {

    return (
        <div className="min-h-screen flex flex-col justify-between space-y-10">
            <Header />

            <main className="flex flex-col items-center justify-center">
                <div className="max-w-lg md:max-w-2xl lg:max-w-4xl w-full flex flex-col items-center justify-center">
                    <div className="w-full text-4xl text-blue-400 border-b border-zinc-500 px-4 text-center md:text-left md:mx-4 py-2 flex flex-col items-left justify-center">

                        <div className="flex flex-row items-center justify-start space-x-3">
                            <h1>Alle Sessions in {course.title}</h1>
                        </div>

                    </div>
                </div>

                <div className="max-w-2xl w-full flex flex-col items-center justify-center space-y-2 mt-10">
                    {
                        sessions.map(session => {

                            const createdDate = new Date(parseInt(session.date))

                            return (
                                <Link href={`/session/${session.id}`} className="flex flex-row justify-between items-center w-full bg-white text-stone-800 text-lg border border-zinc-500 p-2 cursor-pointer rounded-sm hover:bg-slate-50">
                                    <div className="w-80 flex flex-row items-center justify-between">
                                        <p className="w-full">{session.topic}</p>
                                    </div>

                                    {session.duration == 0 && (
                                        <p className="py-1 px-2 text-green-500 border border-green-500 rounded-full text-lg font-semibold">
                                            Session im Gange
                                        </p>
                                    )}

                                    {session.duration > 0 && (<div className="flex flex-row items-center justify-end space-x-1">
                                        <AiOutlineClockCircle />
                                        <div className="flex flex-row items-left justify-center">
                                            <p className="ml-1">{createdDate.getDate() < 10 ? "0" : ""}{createdDate.getDate()}.</p>
                                            <p>{createdDate.getMonth() + 1 < 10 ? "0" : ""}{createdDate.getMonth() + 1}.</p>
                                            <p>{createdDate.getFullYear()}</p>
                                            <p>, {session.duration} {session.duration > 1 ? "Minuten" : "Minute"}</p>
                                        </div>
                                    </div>)}
                                </Link>
                            )
                        })
                    }
                </div>

            </main>

            <Footer />
        </div>
    )

}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const courseId = context.query.id?.toString()

    const course = await prisma.course.findFirst({
        where: {
            id: courseId
        }
    })

    const sessions = await prisma.session.findMany({
        where: {
            course: {
                id: courseId
            }
        }
    })

    return {
        props: {course, sessions}
    }
}

export default Sessions