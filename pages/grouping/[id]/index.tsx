import { GetServerSideProps, NextPage } from "next";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";

import prisma from "../../../components/Client";
import { useRouter } from "next/router";
import { MdCancel, MdEdit, MdOutlineClass, MdSubject } from "react-icons/md";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { TfiAlert } from "react-icons/tfi"
import Link from "next/link";

type student = {
    id: string,
    name: string,
    sirname: string,
    dateOfBirth: string,
    gender: number,
    visuals: number
}

type group = {
    title: string,
    capacity: number,
    students: student[]
}

type grouping = {
    id: string,
    courseId: string,
    title: string,
    created: string,
}

type course = {
    id: string,
    title: string,
}

type props = {
    grouping: grouping,
    groups: group[],
    studentsNotAssigned: student[],
    course: course
}

const Grouping: NextPage<props> = ({ grouping, groups, studentsNotAssigned, course }) => {

    const router = useRouter()

    const created = new Date(parseInt(grouping.created))

    const deleteGrouping = async () => {
        if(!confirm("Möchtest du wirklich die Gruppeneinteilung löschen? DIES KANN NICHT RÜCKGÄNGIG GEMACHT WERDEN")) return

        await fetch(`/api/grouping/${router.query.id}/delete`)

        router.push(`/course/${grouping.courseId}`)
    }

    return(
        <div className="min-h-screen flex flex-col justify-between space-y-10">
            <Header />

            <main className="flex flex-col items-center justify-center">

                <div className="max-w-lg md:max-w-2xl lg:max-w-4xl w-full flex flex-col items-center justify-center">
                    {/* Heading */}
                    <div className="w-full text-4xl text-blue-400 border-b border-zinc-500 px-4 text-center md:text-left md:mx-4 py-2 flex flex-col items-left justify-center">

                        <div className="flex flex-row items-center justify-start space-x-3">
                            <h1>{grouping.title}</h1>
                            <button onClick={() => router.push(`/grouping/${grouping.id}/edit`)} className="w-8 h-8 bg-white border border-zinc-500 rounded-md flex items-center justify-center cursor-pointer"><MdEdit className="h-6 w-6 text-stone-800" /></button>
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

                    <div className="w-full max-w-2xl flex flex-col items-center justify-center mt-5 space-y-10 px-4">
                        {/* List of groups */}

                        {groups.map((group: group, groupIndex) => {
                            return (
                                <div key={groupIndex} className="w-full bg-white flex flex-col items-center justify-center border border-zinc-500 rounded-md !mt-20 p-3">

                                    <h1 className="w-full text-center text-2xl font-md border-b border-zinc-500 pb-1">{group.title}</h1>

                                    <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5">

                                        {
                                            group.students.map((student: student, studentIndex) => {
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

                                </div>
                            )
                        })}

                        {/* students that are not included in the grouping (got added to the course after grouping was created) */}
                        {/* only show when there are unassigned students */}

                        {studentsNotAssigned.length > 0 && (<div className="bg-white w-full flex flex-col items-center justify-center border border-zinc-500 rounded-md !mt-20 p-3">

                            <div className="flex flex-col items-center justify-center space-y-2 w-full border-b border-zinc-500 pb-1">

                                <h1 className="w-full text-center text-2xl font-md flex flex-row items-center justify-center space-x-2 text-red-500">
                                    <TfiAlert />
                                    <p>Nicht zugewiesen</p>
                                </h1>

                                <Link href={`/grouping/${router.query.id}/edit`}>
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

                        <Link href={`/course/${course.id}`} className="text-blue-500 underline text-xl mt-10">
                            Zurück zu {course.title}
                        </Link>

                        <button onClick={() => deleteGrouping()} className="bg-red-500 text-slate-50 text-xl text-center p-2 rounded-md flex flex-row items-center justify-center font-semibold space-x-3"><MdCancel className="h-6 w-6 mr-3" /> Löschen</button>

                    </div>
                </div>

            </main>

            <Footer />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const groupingId = context.query.id?.toString()

    const grouping = await prisma.grouping.findFirst({
        where: {
            id: groupingId
        }
    })

    // The key is to get the data of the students and groups combined in a way you can display easily
    // aka fuse them together in a single nested list
    const groupsInDatabase = await prisma.group.findMany({
        where: {
            grouping: {
                id: groupingId
            }
        }
    })

    const groups: group[] = []

    for(let groupInDatabase of groupsInDatabase) {
        const studentsInGroup = await prisma.student.findMany({
            where: {
                group_member: {
                    some: {
                        group: {
                            id: groupInDatabase?.id?.toString()
                        }
                    }
                }
            }
        })

        const group = {
            id: groupInDatabase.id.toString(),
            title: groupInDatabase.title,
            capacity: groupInDatabase.groupSize,
            students: studentsInGroup
        }

        groups.push(group)
    }

    const course = await prisma.course.findFirst({
        where: {
            id: grouping?.courseId?.toString()
        }
    })

    const studentsNotAssigned = await prisma.student.findMany({
        where: {
            group_member: {
                none: {
                    group: {
                        grouping: {
                            id: groupingId
                        }
                    }
                }
            },
            course_participation: {
                some: {
                    course: {
                        id: course?.id?.toString()
                    }
                }
            }
        }
    })

    return {
        props: {grouping, groups, studentsNotAssigned, course}
    }
}

export default Grouping