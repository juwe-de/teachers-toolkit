import Footer from "../../../components/Footer"
import Header from "../../../components/Header"
import StudentItem from "../../../components/course/StudentItem"
import ExistingStudentItem from "../../../components/course/ExistingStudentItem"

import { FormEvent, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { useRouter } from "next/router"

import { MdOutlineInfo, MdCancel } from "react-icons/md"
import { AiOutlineCheck } from "react-icons/ai"
import { RxCross1 } from "react-icons/rx"
import { BiSave } from "react-icons/bi" 
import { GetServerSideProps, NextPage } from "next"

import prisma from "../../../components/Client"
import { title } from "process"

type existingStudent = {
    id: string,
    name: string,
    sirname: string,
    dateOfBirth: string,
    gender: number,
    visuals: number,
    courses: course[]
}

type course = {
    id: string,
    title: string,
    subject: string,
    year: number,
    quantityValue: number,
}

type props = {
    existingStudents: existingStudent[]
    course: course
    studentsInCourse: existingStudent[]
}

const Create: NextPage<props> = ({ existingStudents, course, studentsInCourse }) => {

    interface student {
        name: string, sirname: string, gender: number, dateOfBirth: number, visuals: number
    }

    const router = useRouter()

    // value of the slider
    const [quantityValue, setQuantityValue] = useState(course.quantityValue)
    const [courseTitle, setCourseTitle] = useState(course.title)
    const [year, setYear] = useState(course.year)
    const [subject, setSubject] = useState(course.subject)
    const [students, setStundents] = useState<student[]>([])

    // keep track of the date selected when adding a new student
    const [selectedDate, setSelectedDate] = useState(new Date())

    // keep track of whether the form for adding a student should be open
    const [addingStudent, setAddingStudent] = useState(false)

    // keep track of the form inputs for creating a new student
    const [name, setName] = useState("")
    const [sirname, setSirname] = useState("")
    const [gender, setGender] = useState(0)
    const [visuals, setVisuals] = useState(0)

    // existing students that have been added to the course by suggestion
    // students that are created and students that already exist need to be handled in different ways to maintain the db structure
    const [existingStudentsInCourse, setExistingStudentsInCourse] = useState<existingStudent[]>(studentsInCourse)

    // update the sliders value
    // gets called every time the slider input changes
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuantityValue(parseInt(e.target?.value))
    } 

    // delete a student of this course
    // gets passed down to every student list item and called from there
    const deleteStudent = (student: student) => {

        const index = students.indexOf(student)

        const newStudents = students
        newStudents.splice(index, 1)

        setStundents([...newStudents])

    }

    const deleteExistingStudent = (student: existingStudent) => {

        const index = existingStudentsInCourse.indexOf(student)

        const newStudents = existingStudentsInCourse
        newStudents.splice(index, 1)

        setExistingStudentsInCourse([...newStudents])

    }

    // called when a new student gets created
    const handleSubmitNewStudent = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // create the student
        const studentToAdd: student = {
            name: name,
            sirname: sirname,
            gender: gender,
            dateOfBirth: selectedDate.getTime(),
            visuals: visuals,
        }

        // add the student
        students.push(studentToAdd)
        
        // reset the states
        setName("")
        setSirname("")
        setGender(0)
        setSelectedDate(new Date())
        setVisuals(0)

        // hide the form
        setAddingStudent(!addingStudent)

    }

    const save = async () => {
        // creating a course without students is very unusual, so ask for confirmation
        if(students.length == 0 && existingStudentsInCourse.length == 0 && !confirm("Möchtest du wirklich einen Kurs ohne Schüler erstellen?")) return
        if(courseTitle == "") {
            alert("Bitte gib einen Kursnamen ein!")
            return
        }

        await fetch(`/api/course/${course.id}/update`, {
            body: JSON.stringify({
                title: courseTitle,
                subject: subject,
                year: year,
                quantityValue: quantityValue,
                students: students,
                existingStudents: existingStudentsInCourse
            }),
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        })
        router.push(`/course/${course.id}`)
    }

    const cancel = () => {
        if(!confirm("Möchtest du wirklich abbrechen? Alle Informationen gehen verloren.")) return

        router.push(`/course/${course.id}`)
    }

    return(
        <div className="min-h-screen flex flex-col justify-between space-y-10">
            <Header />

            <main className="flex flex-col items-center justify-center">
                <div className="max-w-lg md:max-w-2xl lg:max-w-4xl w-full flex flex-col items-center justify-center">
                    {/* Heading */}
                    <div className="w-full flex flex-row items-center justify-start space-x-2 text-4xl text-blue-400 border-b border-zinc-500 px-4 text-center md:text-left md:mx-4 py-2">
                        <h1>Bearbeite</h1>
                        <h1 className="underline">{course.title}</h1>
                    </div>
                    
                    {/* Basic form */}
                    <div className="w-full max-w-2xl flex flex-col items-center justify-center mt-10 space-y-10 px-4">
                        
                        {/* Title input */}
                        <div className="flex flex-col space-y-2 w-full">
                            <p className="w-full text-left text-xl text-stone-800">Kursname</p>
                            <input value={courseTitle} onChange={e => setCourseTitle(e.target.value)} className="py-1 border border-zinc-500 rounded-md bg-white w-full text-lg text-stone-800 px-2 focus:outline-none" placeholder="Neuen Kursnamen eingeben..."/>
                        </div>

                        {/* year/subject select */}
                        <div className="flex flex-col md:flex-row space-y-10 md:space-y-0 md:space-x-6 justify-center items-center w-full">
                            <div className="flex flex-col space-y-2 w-full">
                                <p className="w-full text-left text-xl text-stone-800">Klassenstufe</p>
                                <select value={year} onChange={e => setYear(parseInt(e.target.value))} id="select-1" className="py-1 border border-zinc-500 rounded-md bg-white w-full text-lg text-stone-800 px-2 focus:outline-none text-center">
                                    <option value="7" >7</option>
                                    <option value="8" >8</option>
                                    <option value="9" >9</option>
                                    <option value="10" >10</option>
                                    <option value="11" >11</option>
                                    <option value="12" >12</option>
                                </select>
                            </div>
                            <div className="flex flex-col space-y-2 w-full">
                                <p className="w-full text-left text-xl text-stone-800">Fach</p>
                                <select value={subject} onChange={e => setSubject(e.target.value)} className="py-1 border border-zinc-500 rounded-md bg-white w-full text-lg text-stone-800 px-2 focus:outline-none text-center">
                                    <option value="Informatik">Informatik</option>
                                    <option value="Medien und Kommunikation">Medien und Kommunikation</option>
                                    <option value="Englisch">Englisch :-)</option>
                                </select>
                            </div>
                        </div>

                        {/* Slider for rating */}
                        <div className="flex flex-col space-y-2 w-full">
                            
                            <div className="flex flex-row items-center justify-start space-x-2">
                                <p className="text-xl text-stone-800">Gewichtung</p>
                                {/* Info icon with tooltip on hover */}
                                <div className="group relative inline-block text-stone-800 underline duration-300">
                                    <MdOutlineInfo className="h-6 w-6" />
                                    <span className="absolute hidden group-hover:flex -left-5 -top-2 -translate-y-full w-48 px-2 py-1 bg-slate-900 rounded-lg text-center text-slate-50 text-sm after:content-[''] after:absolute after:left-8 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                                        Lege hier fest, wieviel Wert bei der Berechnung des Ratings (der Mitarbeit) von Schüler*innen auf Quantität und Qualität gelegt wird.
                                    </span>
                                </div>
                            </div>
                            <input onChange={handleSliderChange} className="rounded-lg overflow-hidden appearance-none bg-blue-700 h-3 w-full" type="range" min="1" max="100" step="1" value={quantityValue} />
                            <div className="flex flex-row items-center justify-between">

                                <p className="text-md text-blue-500 w-10">Qualität</p>

                                {/* Button for setting the slider on 50% */}
                                <button onClick={() => {setQuantityValue(50)}} className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg px-2 text-slate-50">50/50</button>

                                <p className="text-md text-blue-700 w-10">Quantität</p>

                            </div>

                        </div>

                        {/* Student widget */}
                        <div className="w-full bg-white flex flex-col items-center justify-center border border-zinc-500 rounded-md !mt-28 p-3">
                            <h1 className="w-full text-center mx-4 text-2xl text-stone-800 border-b border-zinc-500 pb-1 font-md">Schüler in diesem Kurs</h1>
                            
                            <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5">
                                {/* List all of the students */}
                                {students.map((student) => {
                                    return (
                                        <StudentItem deleteStudent={(student: student) => deleteStudent(student)} information={student} />
                                    )
                                })}

                                {existingStudentsInCourse.map((student) => {
                                    return (
                                        <ExistingStudentItem deleteStudent={(student: existingStudent) => deleteExistingStudent(student)} information={student} />
                                    )
                                })}
                            </div>

                            <button onClick={() => {setAddingStudent(!addingStudent)}} className={`w-full bg-slate-50 text-center text-lg border border-zinc-500 rounded-sm  ${addingStudent ? "hidden" : ""} `}>+</button>

                            {/* form for creating a new student */}
                            <form onSubmit={handleSubmitNewStudent} className={`w-full flex flex-col items-center justify-center space-y-2 m-4 border-t border-zinc-500 pt-4 font-md ${addingStudent ? "" : "hidden"}`}>

                                <div className="flex flex-col md:flex-row items-center justify-center space-x-2 w-full">

                                    <div className="flex flex-col items-center justify-center w-full">
                                        <p className="text-stone-800 text-left w-full">Name</p>

                                        <div className="group w-full relative">
                                            <input value={name} onChange={(e) => {setName(e.target.value)}} name="name" className="w-full border border-zinc-500 focus:outline-none p-1 rounded-md" placeholder="John" required />
                                            
                                            {/* suggest existing students by name */}
                                            <div className={`w-full max-h-40 hidden flex-col items-center bg-white border border-zinc-500 rounded-md p-2 absolute z-20 -translate-y-full -top-2 overflow-y-scroll overflow-x-scroll ${name == "" ? "" : "group-focus-within:flex"}`}>
                                	            {existingStudents.map(student => {
                                                    // typed out sirname doesnt match this student
                                                    if(!student.name.toLowerCase().includes(name.toLowerCase())) return
                                                    // student has already been added to the course, cannot add again
                                                    if(existingStudentsInCourse.some(existingStudent => existingStudent.id?.toString() == student.id?.toString())) return
                                                    
                                                    return (
                                                        <button onClick={() => {setExistingStudentsInCourse([...existingStudentsInCourse, student]); setAddingStudent(!addingStudent)}} className="w-full space-x-4 bg-white border-b border-zinc-500 p-1 last:border-0 flex flex-row items-center justify-between text-stone-800 text-sm hover:bg-slate-50 cursor-pointer">
                                                            <p>{student.sirname}, {student.name}</p>
                                                            <div className="flex flex-row items-center justify-start space-x-2 over">
                                                                {student.courses.map(course => {
                                                                    return (
                                                                        <p className="max-h-12 min-w-max bg-orange-600 text-slate-50 p-1 rounded-md">{course.title}</p>
                                                                    )
                                                                })}
                                                            </div>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                       
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center justify-center w-full">
                                        <p className="text-stone-800 text-left w-full">Nachname</p>

                                        <div className="group w-full relative">
                                            <input value={sirname} onChange={(e) => {setSirname(e.target.value)}} name="sirname" className="w-full border border-zinc-500 focus:outline-none p-1 rounded-md" placeholder="Doe" required />

                                            {/* suggest existing students by sirname */}
                                            <div className={`w-full max-h-40 hidden flex-col items-center bg-white border border-zinc-500 rounded-md p-2 absolute z-20 -translate-y-full -top-2 overflow-y-scroll overflow-x-scroll ${sirname == "" ? "" : "group-focus-within:flex"}`}>
                                	            {existingStudents.map(student => {
                                                    // typed out sirname doesnt match this student
                                                    if(!student.sirname.toLowerCase().includes(sirname.toLowerCase())) return
                                                    // student has already been added to the course, cannot add again
                                                    if(existingStudentsInCourse.some(existingStudent => existingStudent.id?.toString() == student.id?.toString())) return

                                                    return (
                                                        <button onClick={() => {setExistingStudentsInCourse([...existingStudentsInCourse, student]); setAddingStudent(!addingStudent)}} className="w-full space-x-4 bg-white border-b border-zinc-500 p-1 last:border-0 flex flex-row items-center justify-between text-stone-800 text-sm hover:bg-slate-50 cursor-pointer">
                                                            <p>{student.sirname}, {student.name}</p>
                                                            <div className="flex flex-row items-center justify-start space-x-2 over">
                                                                {student.courses.map(course => {
                                                                    return (
                                                                        <p className="max-h-12 min-w-max bg-orange-600 text-slate-50 p-1 rounded-md">{course.title}</p>
                                                                    )
                                                                })}
                                                            </div>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-center justify-center w-full md:w-20">
                                    <p className="text-stone-800 text-left w-full">Geschlecht</p>
                                    <select value={gender} onChange={(e) => {setGender(parseInt(e.target.value))}} name="gender" className="w-full md:w-20 border border-zinc-500 focus:outline-none p-1 rounded-md" required >
                                        <option value="0">M</option>
                                        <option value="1">F</option>
                                    </select>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-center w-full space-x-2">
                                    <div className="flex flex-col items-center justify-center w-full">
                                        <p className="text-stone-800 text-left w-full">Geburtsdatum</p>
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

                                    <div className="flex flex-col items-center justify-center w-full">
                                        <p className="text-stone-800 text-left w-full">Sicht</p>
                                        <select value={visuals} onChange={(e) => {setVisuals(parseInt(e.target.value))}} name="visuals" className="w-full border border-zinc-500 focus:outline-none rounded-md text-center text-stone-800 p-1">
                                            <option value="0">Gute Sicht</option>
                                            <option value="1">Kurzsichtig</option>
                                            <option value="2">Weitsichtig</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-row items-center justify-center space-x-2">
                                    <button type="submit" className="bg-green-500 text-slate-50 text-lg text-center p-1 rounded-md"><AiOutlineCheck className="h-6 w-6" /></button>
                                    <button onClick={(e) => {e.preventDefault(); setAddingStudent(!addingStudent)}} className="bg-red-500 text-slate-50 text-lg text-center p-1 rounded-md"><RxCross1 className="h-6 w-6" /></button>
                                </div>

                            </form>
                        </div>

                    </div>

                    <div className="flex flex-row items-center justify-center space-x-4 mt-10">
                        <button onClick={save} className="bg-green-500 text-slate-50 text-xl text-center p-2 rounded-md flex flex-row items-center justify-center font-semibold space-x-3"><BiSave className="h-6 w-6 mr-3" /> Speichern</button>
                        <button onClick={cancel} className="bg-red-500 text-slate-50 text-xl text-center p-2 rounded-md flex flex-row items-center justify-center font-semibold space-x-3"><MdCancel className="h-6 w-6 mr-3" /> Abbrechen</button>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const courseId = context.query.id?.toString()

    const existingStudentsInDatabase = await prisma.student.findMany()

    const existingStudents: existingStudent[] = []

    // find all of the courses each existing student is in
    for(let existingStudentInDatabase of existingStudentsInDatabase) {
        const courses = await prisma.course.findMany({
            where: {
                course_participation: {
                    some: {
                        student: {
                            id: existingStudentInDatabase.id?.toString()
                        }
                    }
                }
            }
        })

        existingStudents.push({
            name: existingStudentInDatabase.name,
            sirname: existingStudentInDatabase.sirname,
            dateOfBirth: existingStudentInDatabase.dateOfBirth,
            id: existingStudentInDatabase.id,
            gender: existingStudentInDatabase.gender,
            visuals: existingStudentInDatabase.visuals,
            courses: courses
        })
    }

    const course = await prisma.course.findFirst({
        where: {
            id: courseId
        }
    })
    const studentsInCourse = await prisma.student.findMany({
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
        props: {existingStudents, course, studentsInCourse}
    }
}

export default Create;