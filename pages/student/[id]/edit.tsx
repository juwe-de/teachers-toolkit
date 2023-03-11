import { GetServerSideProps, NextPage } from "next"
import { useState } from "react"
import ReactDatePicker from "react-datepicker"
import prisma from "../../../components/Client"
import Footer from "../../../components/Footer"
import Header from "../../../components/Header"

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useRouter } from "next/router"
import { BiSave } from "react-icons/bi"
import { MdCancel } from "react-icons/md"

type student = {
    id: string,
    name: string,
    sirname: string,
    dateOfBirth: string,
    visuals: number,
    gender: number
}

type props = {
    student: student
}

const EditStudent: NextPage<props> = ({student}) => {

    const [name, setName] = useState<string>(student.name)
    const [sirname, setSirname] = useState<string>(student.sirname)
    const [visuals, setVisuals] = useState<number>(student.visuals)
    const [gender, setGender] = useState<number>(student.gender)

    const [selectedDate, setSelectedDate] = useState<Date>(new Date(parseInt(student.dateOfBirth)))

    const router = useRouter()

    const save = async () => {
        if(name == "") {
            alert("bitte gib einen Namen ein.")
            return
        }
        if(sirname == "") {
            alert("bitte gib einen Nachnamen ein.")
            return
        }

        await fetch(`/api/student/${student.id}/update`, {
            body: JSON.stringify({
                name: name,
                sirname: sirname,
                dateOfBirth: selectedDate.getTime().toString(),
                visuals: visuals,
                gender: gender
            }),
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })

        router.push(`/student/${student.id}`)
    }

    const cancel = () => {
        if(!confirm("Möchtest du wirklich abbrechen? Alle Informationen gehen verloren.")) return

        router.push("/")
    }

    return (
        <div className="min-h-screen flex flex-col justify-between space-y-10">
            <Header />

            <main className="flex-col items-center justify-center flex w-full">

                <div className="max-w-lg md:max-w-2xl lg:max-w-4xl w-full flex flex-col items-center justify-center">
                    <div className="w-full text-4xl text-blue-400 border-b border-zinc-500 px-4 text-center md:text-left md:mx-4 py-2 flex flex-col items-left justify-center">

                        <div className="flex flex-row items-center justify-start space-x-3">
                            <h1>Bearbeite</h1>
                            <h1 className="underline">{student.name} {student.sirname}</h1>
                        </div>
                    
                    </div>

                    <div className="w-full flex flex-col items-center justify-center space-y-5 mt-10 max-w-xl">
                        <div className="flex flex-col items-center justify-center space-y-2 w-full">
                            <p className="text-stone-800 text-xl w-full text-left font-semibold">Vorname</p>
                            <input value={name} onChange={(e) => {setName(e.target.value)}} name="name" className="w-full border border-zinc-500 focus:outline-none p-1 rounded-md" placeholder={student.name} required />
                        </div>

                        <div className="flex flex-col items-center justify-center space-y-2 w-full">
                            <p className="text-stone-800 text-xl w-full text-left font-semibold">Nachname</p>
                            <input value={sirname} onChange={(e) => {setSirname(e.target.value)}} name="sirname" className="w-full border border-zinc-500 focus:outline-none p-1 rounded-md" placeholder={student.sirname} required />
                        </div>

                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full">

                            <div className="flex flex-col items-center justify-center space-y-2 w-full">
                                <p className="text-stone-800 text-xl w-full text-left font-semibold">Geschlecht</p>
                                <select value={gender} onChange={(e) => {setGender(parseInt(e.target.value))}} name="gender" className="w-full border border-zinc-500 focus:outline-none p-1 rounded-md" required >
                                    <option value="0">M</option>
                                    <option value="1">F</option>
                                </select>
                            </div>

                            <div className="flex flex-col items-center justify-center w-full">
                                <p className="text-stone-800 text-xl w-full text-left font-semibold">Geburtsdatum</p>
                                <DatePicker 
                                    className="text-center text-stone-800 w-full focus:outline-none border border-zinc-500 rounded-md p-1"
                                    selected={selectedDate} 
                                    onChange={(date) => {setSelectedDate(date ? date : new Date())}}
                                    dateFormat="dd.MM.yyyy"
                                    maxDate={new Date()} 
                                    showYearDropdown
                                    scrollableMonthYearDropdown
                                />
                            </div>

                            <div className="flex flex-col items-center justify-center space-y-2 w-full">
                                <p className="text-stone-800 text-xl w-full text-left font-semibold">Geschlecht</p>
                                <select value={visuals} onChange={(e) => {setVisuals(parseInt(e.target.value))}} name="visuals" className="w-full border border-zinc-500 focus:outline-none rounded-md text-center text-stone-800 p-1">
                                    <option value="0">Gute Sicht</option>
                                    <option value="1">Kurzsichtig</option>
                                    <option value="2">Weitsichtig</option>
                                </select>
                            </div>

                        </div>
                    </div>

                </div>

                <div className="flex flex-row items-center justify-center space-x-4 mt-10">
                    <button onClick={save} className="bg-green-500 text-slate-50 text-xl text-center p-2 rounded-md flex flex-row items-center justify-center font-semibold space-x-3"><BiSave className="h-6 w-6 mr-3" /> Speichern </button>
                    <button onClick={cancel} className="bg-red-500 text-slate-50 text-xl text-center p-2 rounded-md flex flex-row items-center justify-center font-semibold space-x-3"><MdCancel className="h-6 w-6 mr-3" /> Abbrechen</button>
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

    return {
        props: {student}
    }
}

export default EditStudent