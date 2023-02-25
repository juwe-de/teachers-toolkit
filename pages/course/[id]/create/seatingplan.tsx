import { GetServerSideProps, NextPage } from "next";
import Footer from "../../../../components/Footer";
import Header from "../../../../components/Header";
import prisma from "../../../../components/Client";
import { useState } from "react";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";

type student = {
    id: string,
    name: string,
    sirname: string,
    dateOfBirth: string,
    gender: number,
    visuals: number
}

type props = {
    students: student[]
}

type seat = {
    student: student,
    index: number,
}

const CreateSeatingplan: NextPage<props> = ({students}) => {

    const [studentsNotAssigned, setStudentsNotAssigned] = useState<student[]>(students)
    const [title, setTitle] = useState<string>("Unbenannte Gruppeneinteilung")
    const [seatingplan, setSeatingplan] = useState<seat[]>([])

    return (
        <div className="min-h-screen flex flex-col justify-between space-y-10">
            <Header />

            <main className="flex-col items-center justify-center hidden xl:flex">

                <div className="max-w-6xl w-full md:max-w-2xl lg:max-w-4xl flex flex-col items-center justify-center">

                    {/* Heading */}
                    <div className="w-full text-4xl text-blue-400 border-b border-zinc-500 px-4 text-center md:text-left md:mx-4 py-2">
                        <h1>Erstelle einen Sitzplan</h1>
                    </div>


                    <div className="w-full max-w-2xl flex flex-col items-center justify-center mt-10 space-y-10 px-4">
                        <div className="flex flex-col space-y-2 w-full">
                            <p className="w-full text-left text-xl text-stone-800">Name</p>
                            <input onChange={e => setTitle(e.target.value == "" ? "Unbenannte Gruppeneinteilung" : e.target.value)} className="py-1 border border-zinc-500 rounded-md bg-white w-full text-lg text-stone-800 px-2 focus:outline-none" placeholder="Unbenannte Gruppeneinteilung"/>
                        </div>


                        {/* list all of the students */}
                        <div className="w-full bg-white flex flex-col items-center justify-center border border-zinc-500 rounded-md p-3">
                            <h1 className="w-full text-center mx-4 text-2xl text-stone-800 border-b border-zinc-500 pb-1 font-md">Schüler (unzugeordnet)</h1>

                            <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5">
                                {studentsNotAssigned.map((student, index) => {
                                    return (
                                        <div key={index} className="flex flex-col items-center justify-center w-full border-b border-zinc-500 border-dashed last:border-0"
                                            draggable
                                        >
                                            <div className="flex flex-row justify-between items-center w-full hover:bg-slate-50">
                                                <div className="w-full p-1 cursor-move">{student.sirname}, {student.name}</div>
                                                {student.gender == 0 ? (<BsGenderMale />) : (<BsGenderFemale />)}
                                            </div>
                                            <div className="flex flex-row items-center justify-center space-x-2">

                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                </div>
            
            </main>

            <p className="w-full text-center block xl:hidden">
                Wechle für das Erstellen eines Sitzplans bitte auf einen größeren Bildschirm mit Tastatur und Maus.
            </p>

            <Footer />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const courseId = context.query.id?.toString()

    const students = await prisma.student.findMany({
        where: {
            course_participation: {
                some: {
                    course: {
                        id: courseId
                    }
                }
            }
        }
    })

    return {
        props: {students}
    }
} 

export default CreateSeatingplan