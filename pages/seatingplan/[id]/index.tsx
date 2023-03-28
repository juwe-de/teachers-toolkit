import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react"
import { useRouter } from "next/router";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdCancel, MdEdit } from "react-icons/md";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import prisma from "../../../components/Client";
import Seat from "../../../components/seatingplan/Seat";
import { TfiAlert } from "react-icons/tfi";
import Link from "next/link";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";

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

type course = {
    id: string,
    title: string,
}

type props = {
    seats: seat[],
    seatingplan: seatingplan,
    studentsNotAssigned: student[],
    course: course
}

const Seatingplan: NextPage<props> = ({seats, seatingplan, studentsNotAssigned, course}) => {

    const router = useRouter()
    const created = new Date(parseInt(seatingplan.created))

    const deleteSeatingplan = async () => {
        if(!confirm("Möchtest du wirklich den Sitzplan löschen? DIES KANN NICHT RÜCKGÄNGIG GEMACHT WERDEN")) return

        await fetch(`/api/seatingplan/${router.query.id}/delete`)

        router.push(`/course/${seatingplan.courseId}`)
    }

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

                {/* seatingplan (needs fixing in terms of fixed width / height values, no time right now)*/}
                <div className="w-full flex items-center seatingplan-scrollable overflow-x-scroll">
                    <div className=" bg-white rounded-md flex flex-row justify-between p-3 space-x-10 !mt-10">

                        <div className="h-[620px] flex flex-col items-center justify-between space-y-10">
                            <div className="h-[370px] w-[450px] grid grid-cols-2 grid-rows-3 gap-1">
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
                                    seats.slice(6, 8).map(seat => {
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
                                    seats.slice(12, 14).map(seat => {
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

                        <div className="w-[900px] grid grid-cols-4 grid-rows-5 gap-1">
                            {
                                // This is very ugly, but necessary to keep the functionality of placing students with visual impairments on 
                                // proper seats simple (place them by index)
                                seats.slice(2, 6).map(seat => {
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
                                seats.slice(8, 12).map(seat => {
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
                                seats.slice(14).map(seat => {
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

                {/* students that are not included in the seatingplan (got added to the course after seatingplan was created) */}
                {/* only show when there are unassigned students */}
                <div className="w-full flex items-center justify-center">
                    {studentsNotAssigned.length > 0 && (<div className="bg-white w-full max-w-2xl flex flex-col items-center justify-center border border-zinc-500 rounded-md !mt-20 p-3">

                        <div className="flex flex-col items-center justify-center space-y-2 w-full border-b border-zinc-500 pb-1">

                            <h1 className="w-full text-center text-2xl font-md flex flex-row items-center justify-center space-x-2 text-red-500">
                                <TfiAlert />
                                <p>Nicht zugewiesen</p>
                            </h1>

                            <Link href={`/seatingplan/${router.query.id}/edit`}>
                                <div className="rounded-md border border-zinc-500 p-1 bg-blue-400 text-white">
                                    Beheben
                                </div>
                            </Link>

                        </div>

                        <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5">

                            {
                                studentsNotAssigned.map((student: student, studentIndex) => {
                                    return (
                                        <div
                                            key={studentIndex}
                                            className="flex flex-row justify-between items-center w-full border-b border-zinc-500 border-dashed last:border-0 hover:bg-slate-50"
                                        >
                                            <div className="w-full p-1">{student.sirname}, {student.name}</div>
                                            {student.gender == 0 ? (<BsGenderMale />) : (<BsGenderFemale />)}
                                        </div>
                                    )
                                })
                            }

                        </div>

                    </div>)}
                </div>

                <Link href={`/course/${course.id}`} className="text-blue-500 underline text-xl mt-10">
                    Zurück zu {course.title}
                </Link>

                <div className="w-full flex items-center justify-center mt-3">
                    <button onClick={() => deleteSeatingplan()} className="bg-red-500 text-slate-50 text-xl text-center p-2 rounded-md flex flex-row items-center justify-center font-semibold space-x-3"><MdCancel className="h-6 w-6 mr-3" /> Löschen</button>
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

    if(seatingplan == undefined) return {props: {}}

    const course = await prisma.course.findFirst({
        where: {
            id: seatingplan.courseId?.toString()
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
        props: {seats, seatingplan, studentsNotAssigned, course}
    }
}

export default Seatingplan