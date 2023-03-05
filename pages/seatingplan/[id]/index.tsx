import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react"
import { useRouter } from "next/router";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import prisma from "../../../components/Client";
import Seat from "../../../components/seatingplan/Seat";

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

type seatingplan = {
    id: string,
    title: string,
    courseId: string,
    created: string,
}

type props = {
    seats: seat[],
    seatingplan: seatingplan,
    studentsNotAssigned: student[]
}

const Seatingplan: NextPage<props> = ({seats, seatingplan, studentsNotAssigned}) => {

    const router = useRouter()
    const created = new Date(parseInt(seatingplan.created))

    return (
        <div className="min-h-screen flex flex-col justify-between space-y-10">
            <Header />

            <main className="flex-col items-center justify-center flex overflow-hidden">

                <div className="max-w-6xl w-full md:max-w-2xl lg:max-w-4xl flex flex-col items-center justify-center">

                    {/* Heading */}
                    <div className="w-full text-4xl text-blue-400 border-b border-zinc-500 px-4 text-center md:text-left md:mx-4 py-2 flex flex-col items-left justify-center">

                        <div className="flex flex-row items-center justify-start space-x-3">
                            <h1>{seatingplan.title}</h1>
                            <button onClick={() => router.push(`/seatingplan/${seatingplan.id}/edit`)} className="w-8 h-8 bg-white border border-zinc-500 rounded-md flex items-center justify-center cursor-pointer"><MdEdit className="h-6 w-6 text-stone-800" /></button>
                        </div>

                        <div className="flex flex-row items-center justify-start text-stone-800 text-sm space-x-2">
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

                </div>

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
                                            />
                                        )
                                    })
                                }
                                {
                                    seats.slice(7, 9).map(seat => {
                                        return (
                                            <Seat 
                                                seat={seat} 
                                                width={250}
                                                height={150} 
                                            />
                                        )
                                    })
                                }
                                {
                                    seats.slice(14, 16).map(seat => {
                                        return (
                                            <Seat 
                                                seat={seat} 
                                                width={250}
                                                height={150} 
                                            />
                                        )
                                    })
                                }
                            </div>
                            <div className="bg-white w-[150px] h-[75px] border border-zinc-500 flex flex-col items-center justify-center text-xs p-1">
                                <p className="text-lg font-semibold">Sniper</p>
                            </div>
                        </div>

                        <div className="w-[1200px] grid grid-cols-5 grid-rows-5 gap-1">
                            {
                                // This is very ugly, but necessary to keep the functionality of placing students with visual impairments on 
                                // proper seats simple (place them by index)
                                seats.slice(2, 7).map(seat => {
                                    return (
                                        <Seat 
                                            seat={seat} 
                                            width={250}
                                            height={150}
                                        />
                                    )
                                })
                            }
                            {
                                seats.slice(9, 14).map(seat => {
                                    return (
                                        <Seat 
                                            seat={seat} 
                                            width={250}
                                            height={150} 
                                        />
                                    )
                                })
                            }
                            {
                                seats.slice(16).map(seat => {
                                    return (
                                        <Seat 
                                            seat={seat} 
                                            width={250}
                                            height={150} 
                                        />
                                    )
                                })
                            }
                        </div>

                    </div>
                </div>
            </main>

            <Footer />

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const id = context.query.id?.toString()

    const seatingplan = await prisma.seatingplan.findFirst({
        where: {
            id: id,
        }
    })

    const seatsInDatabase = await prisma.seat.findMany({
        where: {
            seatingplan: {
                id: id,
            }
        }
    })

    let seats: seat[] = []

    for(let i = 0; i < 30; i++) {
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

    const studentsNotAssigned = await prisma.student.findMany({
        where: {
            course_participation: {
                some: {
                    course: {
                        id: seatingplan?.courseId.toString()
                    }
                }
            },
            seats: {
                none: {
                    seatingplan: {
                        id: id
                    }
                }
            }
        }
    })

    return {
        props: {seats, seatingplan, studentsNotAssigned}
    }
}

export default Seatingplan