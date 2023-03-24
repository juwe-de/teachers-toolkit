import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { AiOutlineClockCircle, AiOutlineSearch } from "react-icons/ai";
import { HiHome } from "react-icons/hi2";
import Footer from "../components/Footer";
import prisma from "../components/Client";
import Link from "next/link";

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

type props = {
    students: student[],
    courses: course[],
    seatingplans: seatingplan[],
    groupings: grouping[]
}

const Search: NextPage<props> = ({students, courses, seatingplans, groupings}) => {

    const router = useRouter()

    const initialTerm: string = router.query.term?.toString() == undefined ? "" : router.query.term?.toString()
    const [term, setTerm] = useState<string>(initialTerm)

    const [searchedStudents, setSearchedStudents] = useState<student[]>([])
    const [searchedCourses, setSearchedCourses] = useState<course[]>([])
    const [searchedGroupings, setSearchedGroupings] = useState<grouping[]>([])
    const [searchedSeatingplans, setSearchedSeatingplans] = useState<seatingplan[]>([])

    const search = () => {
        setSearchedStudents([...students.filter(student => {
            return student.name.toLowerCase().includes(term.toLowerCase()) || student.sirname.toLowerCase().includes(term)
        })])
        setSearchedCourses([...courses.filter(course => {
            return course.title.toLowerCase().includes(term.toLowerCase())
        })])
        setSearchedGroupings([...groupings.filter(grouping => {
            return grouping.title.toLowerCase().includes(term.toLowerCase())
        })])
        setSearchedSeatingplans([...seatingplans.filter(seatingplan => {
            return seatingplan.title.toLowerCase().includes(term.toLowerCase())
        })])
    }

    useEffect(() => {
        search()
    }, [term])

    return (
        <div className="min-h-screen flex flex-col items-center justify-between space-y-10">
            
            <div className="w-4/5 flex flex-row flex-1 bg-white max-h-12 h-full rounded-md shadow-md items-center justify-center space-x-2 mx-4 mt-4 text-xl">
                <button onClick={() => router.push("/")}>
                    <HiHome className="h-8 w-8 text-stone-900 ml-1 bg-slate-200 p-1 rounded-md" />
                </button>

                <button type="submit">
                    <AiOutlineSearch className="h-8 w-8 text-stone-900 ml-1 bg-slate-200 p-1 rounded-md"/>
                </button>
                
                <input onChange={(e) => {setTerm(e.target.value)}} value={term} className="!ml-6 bg-transparent focus:outline-none h-12 text-stone-800 w-full" placeholder="Suche nach irgendetwas..." />
            </div>

            <main className="flex flex-col items-center justify-center w-full px-4">

                <div className="max-w-2xl w-full flex flex-col items-center justify-center space-y-10 mt-10">

                    <div className="flex flex-col items-center justify-center w-full space-y-2">
                        {searchedStudents.length > 0 && (<h1 className="text-2xl font-semibold text-stone-800">Schüler</h1>)}
                        {
                            searchedStudents.map(student => {
                                return (
                                    <Link href={`/student/${student.id}`} key={student.id} className="flex flex-row space-x-4 justify-between items-center w-full bg-white text-stone-800 text-lg border border-zinc-500 p-2 rounded-sm hover:bg-slate-50" >
                                                
                                        <div className="w-full flex flex-row items-center justify-between space-x-2">
                                            <p className="w-full">{student.sirname}, {student.name}</p>
                                        </div>
                                        
                                    </Link>
                                )
                            })
                        }

                        {searchedCourses.length > 0 && (<h1 className="text-2xl font-semibold text-stone-800">Kurse</h1>)}
                        {
                            searchedCourses.map(course => {
                                const createdDate = new Date(parseInt(course.created))
                                return (
                                    <Link href={`/course/${course.id}`} key={course.id} className="flex flex-row space-x-4 justify-between items-center w-full bg-white text-stone-800 text-lg border border-zinc-500 p-2 rounded-sm hover:bg-slate-50" >
                                                
                                        <div className="w-full flex flex-row items-center justify-between space-x-2">
                                            <p className="w-full">{course.title}</p>
                                        </div>

                                        <div className="flex flex-row items-center justify-end space-x-1">
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

                        {searchedSeatingplans.length > 0 && (<h1 className="text-2xl font-semibold text-stone-800">Sitzpläne</h1>)}
                        {
                            searchedSeatingplans.map(seatingplan => {
                                const createdDate = new Date(parseInt(seatingplan.created))
                                return (
                                    <Link href={`/seatingplan/${seatingplan.id}`} key={seatingplan.id} className="flex flex-row space-x-4 justify-between items-center w-full bg-white text-stone-800 text-lg border border-zinc-500 p-2 rounded-sm hover:bg-slate-50" >
                                                
                                        <div className="w-full flex flex-row items-center justify-between space-x-2">
                                            <p className="w-full">{seatingplan.title}</p>
                                        </div>

                                        <div className="flex flex-row items-center justify-end space-x-1">
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

                        {searchedGroupings.length > 0 && (<h1 className="text-2xl font-semibold text-stone-800">Gruppeneinteilungen</h1>)}
                        {
                            searchedGroupings.map(grouping => {
                                const createdDate = new Date(parseInt(grouping.created))
                                return (
                                    <Link href={`/grouping/${grouping.id}`} key={grouping.id} className="flex flex-row space-x-4 justify-between items-center w-full bg-white text-stone-800 text-lg border border-zinc-500 p-2 rounded-sm hover:bg-slate-50" >
                                                
                                        <div className="w-full flex flex-row items-center justify-between space-x-2">
                                            <p className="w-full">{grouping.title}</p>
                                        </div>

                                        <div className="flex flex-row items-center justify-end space-x-1">
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
                    </div>

                </div>

            </main>

            <Footer />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {

    const students = await prisma.student.findMany()
    const courses = await prisma.course.findMany()
    const seatingplans = await prisma.seatingplan.findMany()
    const groupings = await prisma.grouping.findMany()

    return {
        props: {students, courses, seatingplans, groupings}
    }
} 

export default Search