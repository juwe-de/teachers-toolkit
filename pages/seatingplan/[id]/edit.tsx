import { GetServerSideProps, NextPage } from "next";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import prisma from "../../../components/Client";
import { useRef, useState } from "react";
import { BsFilterSquare, BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import Seat from "../../../components/seatingplan/DraggableSeat";
import { BiSave } from "react-icons/bi";
import { MdCancel } from "react-icons/md";
import { useRouter } from "next/router";
import DraggableSeat from "../../../components/seatingplan/DraggableSeat"

type student = {
    id: string,
    name: string,
    sirname: string,
    dateOfBirth: string,
    gender: number,
    visuals: number
}

type props = {
    students: student[],
    seats: seat[],
    prevTitle: string,
}

type seat = {
    student: student,
    index: number,
}

const EditSeatingplan: NextPage<props> = ({students, seats, prevTitle}) => {

    const [studentsNotAssigned, setStudentsNotAssigned] = useState<student[]>(students)
    const [title, setTitle] = useState<string>(prevTitle)

    const [seatingplan, setSeatingplan] = useState<seat[]>(seats)
    const [boysNextToGirls, setBoysNextToGirls] = useState<boolean>(false)

    const sights = [
        "Keine Sichtprobleme",
        "Kurzsichtig",
        "Weitsichtig",
    ]

    // the student or seat being dragged
    const dragItem = useRef<any>(null)
    // the seat a student is being dragged over
    const dragOverItem = useRef<any>(null)

    const generateRandomly = () => {

        // we want to only reset when all students are assigned
        // if not, we want to keep the current seatingplan and just add on to it
        if(studentsNotAssigned.length == 0) reset()

        if(boysNextToGirls){ 
            placeBoysNextToGirls()
        }
        else {
            placeStudentsNormally()
        }

    }

    // This whole system may need an overhaul, but it works for now
    const placeBoysNextToGirls = () => {

        const maleStudents = studentsNotAssigned.filter(student => student.gender == 0)
        const femaleStudents = studentsNotAssigned.filter(student => student.gender == 1)

        if(maleStudents.length == 0 || femaleStudents.length == 0) {
            placeStudentsNormally()
            return
        }

        const newSeatingplan = seatingplan

        // place the male students first (no pun intended)

        // sort students by visual impairment to place them accordingly
        let shortSightedStudents = maleStudents.filter(student => student.visuals == 1)
        let farSightedStudents = maleStudents.filter(student => student.visuals == 2)
        let nonImpairedStudents = maleStudents.filter(student => student.visuals == 0)

        for(let i = newSeatingplan.length-1; i >= 0; i -= 2) {
            // farsighted students should sit in the back and so on and so forth
            let studentToBeSeated
            if (farSightedStudents.length > 0) {

                studentToBeSeated = farSightedStudents.splice(Math.floor(Math.random()*farSightedStudents.length), 1)

            } else if (nonImpairedStudents.length > 0) {

                studentToBeSeated = nonImpairedStudents.splice(Math.floor(Math.random()*nonImpairedStudents.length), 1)

            } else if (shortSightedStudents.length > 0) {

                studentToBeSeated = shortSightedStudents.splice(Math.floor(Math.random()*shortSightedStudents.length), 1)

            }

            // there are no male students left
            if(studentToBeSeated == undefined) break

            // seat isn't empty, readd the student to either nonImpared, shortSighted or farSighted depending on the students visuals
            if(newSeatingplan[i].student.gender != -1) {
                studentToBeSeated[0].visuals == 0 ? nonImpairedStudents.push(studentToBeSeated[0]) : studentToBeSeated[0].visuals == 1 ? shortSightedStudents.push(studentToBeSeated[0]) : farSightedStudents.push(studentToBeSeated[0])
                continue
            }

            newSeatingplan[i].student = studentToBeSeated[0]
        }

        // now place the female students

        shortSightedStudents = femaleStudents.filter(student => student.visuals == 1)
        farSightedStudents = femaleStudents.filter(student => student.visuals == 2)
        nonImpairedStudents = femaleStudents.filter(student => student.visuals == 0)

        for(let i = newSeatingplan.length-2; i >= 1; i -= 2) {
            // farsighted students should sit in the back and so on and so forth
            let studentToBeSeated = undefined
            if (farSightedStudents.length > 0) {

                studentToBeSeated = farSightedStudents.splice(Math.floor(Math.random()*farSightedStudents.length), 1)

            } else if (nonImpairedStudents.length > 0) {

                studentToBeSeated = nonImpairedStudents.splice(Math.floor(Math.random()*nonImpairedStudents.length), 1)

            } else if (shortSightedStudents.length > 0) {

                studentToBeSeated = shortSightedStudents.splice(Math.floor(Math.random()*shortSightedStudents.length), 1)

            }

            // there are no female students left
            if(studentToBeSeated == undefined) break

            // seat isn't empty, readd the student to either nonImpared, shortSighted or farSighted depending on the students visuals
            if(newSeatingplan[i].student.gender != -1) {
                studentToBeSeated[0].visuals == 0 ? nonImpairedStudents.push(studentToBeSeated[0]) : studentToBeSeated[0].visuals == 1 ? shortSightedStudents.push(studentToBeSeated[0]) : farSightedStudents.push(studentToBeSeated[0])
                continue
            }
            newSeatingplan[i].student = studentToBeSeated[0]
        }

        setStudentsNotAssigned([])
        setSeatingplan([...newSeatingplan])

    }

    const placeStudentsNormally = () => {
        // sort students by visual impairment
        const shortSightedStudents = studentsNotAssigned.filter(student => student.visuals == 1)
        const farSightedStudents = studentsNotAssigned.filter(student => student.visuals == 2)
        const nonImpairedStudents = studentsNotAssigned.filter(student => student.visuals == 0)

        const newSeatingplan = seatingplan

        for(let i = newSeatingplan.length-1; i >= 0; i --) {
            // farsighted students should sit in the back and so on and so forth
            let studentToBeSeated
            if (farSightedStudents.length > 0) {

                studentToBeSeated = farSightedStudents.splice(Math.floor(Math.random()*farSightedStudents.length), 1)

            } else if (nonImpairedStudents.length > 0) {

                studentToBeSeated = nonImpairedStudents.splice(Math.floor(Math.random()*nonImpairedStudents.length), 1)

            } else if (shortSightedStudents.length > 0) {

                studentToBeSeated = shortSightedStudents.splice(Math.floor(Math.random()*shortSightedStudents.length), 1)

            }

            // there are no male students left
            if(studentToBeSeated == undefined) break

            // seat isn't empty, readd the student to either nonImpared, shortSighted or farSighted depending on the students visuals
            if(newSeatingplan[i].student.gender != -1) {
                studentToBeSeated[0].visuals == 0 ? nonImpairedStudents.push(studentToBeSeated[0]) : studentToBeSeated[0].visuals == 1 ? shortSightedStudents.push(studentToBeSeated[0]) : farSightedStudents.push(studentToBeSeated[0])
                continue
            }

            newSeatingplan[i].student = studentToBeSeated[0]
        }

        setStudentsNotAssigned([])
        setSeatingplan([...newSeatingplan])

    }
 
    const reset = () => {
        // remove all students from the seatingplan and add them to the unassigned list

        const newStudentsNotAssigned = studentsNotAssigned
        const newSeatingplan = seatingplan

        newSeatingplan.map((seat: seat) => {
            if(seat.student.gender != -1) {
                newStudentsNotAssigned.push(seat.student)
            }
            seat.student = {
                id: "",
                name: "",
                sirname: "",
                dateOfBirth: "",
                gender: -1,
                visuals: -1
            }
        })

        setStudentsNotAssigned([...newStudentsNotAssigned])
        setSeatingplan([...newSeatingplan])

    }

    const handleDropAssigned = () => {

        // a student has been dragged over from a seat to another seat
        if(dragItem.current == null) return
        if(dragOverItem.current == null) return

        // student has been dragged to seat he was on prior to the drag
        if(dragItem.current == dragOverItem.current) return

        const draggedSeat = seatingplan[dragItem.current]
        const seatDraggedTo = seatingplan[dragOverItem.current]

        // dragged an empty seat
        if(draggedSeat.student.gender == -1) return

        // switch the students, also works with empty seat as they have an "empty student"
        const tempStudent = seatDraggedTo.student
        seatDraggedTo.student = draggedSeat.student
        draggedSeat.student = tempStudent

        // replace the seats on the seatingplan
        const newSeatingplan = seatingplan
        newSeatingplan[dragItem.current] = draggedSeat
        newSeatingplan[dragOverItem.current] = seatDraggedTo
        setSeatingplan([...newSeatingplan])

        // reset the drag variables
        dragItem.current = null
        dragOverItem.current = null

    }

    const handleDropUnassigned = () => {

        // a student has been dragged over from the unassigned list to a seat
        if(dragItem.current == null) return
        if(dragOverItem.current == null) return

        const draggedStudent = studentsNotAssigned[dragItem.current]
        const seatDraggedTo = seatingplan[dragOverItem.current]

        // this seat is occupied
        if(seatDraggedTo.student.gender != -1) return

        seatDraggedTo.student = draggedStudent

        // remove the student from the unassigned list
        const newStudentsNotAssigned = studentsNotAssigned
        newStudentsNotAssigned.splice(dragItem.current, 1)
        setStudentsNotAssigned([...newStudentsNotAssigned])

        // add the "new" seat to the seatingplan
        const newSeatingplan = seatingplan
        newSeatingplan[dragOverItem.current] = seatDraggedTo
        setSeatingplan([...newSeatingplan])

        // reset the drag variables
        dragItem.current = null
        dragOverItem.current = null

    }

    const router = useRouter()

    const save = async () => {

        if(studentsNotAssigned.length > 0) {
            alert("Bitte platziere alle Schüler, bevor du den Sitzplan speicherst.")
            return
        }

        if(title == "") {
            alert("Bitte gib einen Titel ein, bevor du den Sitzplan speicherst")
            return
        }

        await fetch(`/api/seatingplan/${router.query.id}/edit`, {
            body: JSON.stringify({
                courseId: router.query.id?.toString(),
                seatingplan: seatingplan,
                title: title
            }),
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        })

        router.push(`/seatingplan/${router.query.id}`)

    }

    const cancel = () => {

        if(!confirm("Möchtest du wirklich abbrechen? Alle Daten gehen verloren!")) return

        router.push(`/seatingplan/${router.query.id}`)

    }

    return (
        <div className="min-h-screen flex flex-col justify-between space-y-10">
            <Header />

            <main className="flex-col items-center justify-center hidden xl:flex">

                <div className="max-w-6xl w-full md:max-w-2xl lg:max-w-4xl flex flex-col items-center justify-center">

                    {/* Heading */}
                    <div className="w-full text-4xl text-blue-400 border-b border-zinc-500 px-4 text-center md:text-left md:mx-4 py-2">
                        <h1>Bearbeite {prevTitle}</h1>
                    </div>


                    <div className="w-full max-w-2xl flex flex-col items-center justify-center mt-10 space-y-10 px-4">
                        <div className="flex flex-col space-y-2 w-full">
                            <p className="w-full text-left text-xl text-stone-800">Name</p>
                            <input value={title} onChange={e => setTitle(e.target.value)} className="py-1 border border-zinc-500 rounded-md bg-white w-full text-lg text-stone-800 px-2 focus:outline-none" placeholder="Neuen Titel eingeben..."/>
                        </div>


                        {/* list all of the students */}
                        <div className="w-full bg-white flex flex-col items-center justify-center border border-zinc-500 rounded-md p-3">
                            <h1 className="w-full text-center mx-4 text-2xl text-stone-800 border-b border-zinc-500 pb-1 font-md">Schüler (unzugeordnet)</h1>

                            <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5">
                                {studentsNotAssigned.map((student, index) => {
                                    return (
                                        <div key={index} className="flex flex-col cursor-move items-center justify-center w-full border-b border-zinc-500 border-dashed last:border-0 hover:bg-slate-50"
                                            draggable
                                            onDragStart={(e) => dragItem.current = index}
                                            onDragEnd={(e) => handleDropUnassigned()}
                                            onDragOver={(e) => e.preventDefault()}
                                        >
                                            <div className="flex flex-row justify-between items-center w-full ">
                                                <div className="w-full p-1 text-lg">{student.sirname}, {student.name}</div>
                                                {student.gender == 0 ? (<BsGenderMale />) : (<BsGenderFemale />)}
                                            </div>
                                            <div className="flex flex-row items-center justify-start w-full space-x-2">
                                                <AiOutlineEyeInvisible />
                                                <p>{sights[student.visuals]}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center space-y-4 mt-10">
                            <div className={`w-full flex flex-col items-center justify-center space-y-2 !mb-2 transition-all duration-300`}>
                                <div>
                                    <label 
                                        htmlFor="toogleA"
                                        className="flex items-center cursor-pointer"
                                    >
                                        {/* toggle */}
                                        <div className="relative">
                                            {/* input */}
                                            <input id="toogleA" type="checkbox" className="sr-only" onChange={(e) => setBoysNextToGirls(e.target?.checked)} />
                                            {/* line */}
                                            <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                                            {/* dot */}
                                            <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition border border-zinc-500"></div>
                                        </div>
                                        {/* label */}
                                        <div className="ml-3 text-gray-700 font-medium">
                                            Jungen neben Mädchen
                                        </div>
                                    </label>
                                </div>
                                <div className="flex flex-row items-center justify-between space-x-2">
                                    <button onClick={() => generateRandomly()} className="bg-blue-400 rounded-full p-2 text-slate-50 font-semibold">Generieren</button>
                                    <button onClick={() => reset()} className="bg-blue-400 rounded-full p-2 text-slate-50 font-semibold">Zurücksetzen</button>
                                </div>
                            </div>
                        </div>
                    </div>

                                            

                </div>

                {/* Seatingplan */}
                    
                <div className="bg-white rounded-md flex flex-row justify-between p-3 space-x-10 !mt-10">

                    <div className="flex flex-col items-center justify-between space-y-10">
                        <div className="h-[232px] top-0 grid grid-cols-2 grid-rows-3 gap-1">
                            {
                                // This is very ugly, but necessary to keep the functionality of placing students with visual impairments on 
                                // proper seats simple (place them by index)
                                seatingplan.slice(0, 2).map(seat => {
                                    return (
                                        <DraggableSeat  
                                            seat={seat} 
                                            onDragStart={(index: number) => dragItem.current = index}
                                            onDragEnd={() => handleDropAssigned()} 
                                            onDragEnter={(index: number) => dragOverItem.current = index}
                                            width={150}
                                            height={75}
                                        />
                                    )
                                })
                            }
                            {
                                seatingplan.slice(6, 8).map(seat => {
                                    return (
                                        <DraggableSeat 
                                            seat={seat} 
                                            onDragStart={(index: number) => dragItem.current = index}
                                            onDragEnd={() => handleDropAssigned()} 
                                            onDragEnter={(index: number) => dragOverItem.current = index}
                                            width={150}
                                            height={75} 
                                        />
                                    )
                                })
                            }
                            {
                                seatingplan.slice(12, 14).map(seat => {
                                    return (
                                        <DraggableSeat 
                                            seat={seat} 
                                            onDragStart={(index: number) => dragItem.current = index}
                                            onDragEnd={() => handleDropAssigned()} 
                                            onDragEnter={(index: number) => dragOverItem.current = index}
                                            width={150}
                                            height={75} 
                                        />
                                    )
                                })
                            }
                        </div>
                        <div className="bg-white w-[150px] h-[75px] border border-zinc-500 flex flex-col items-center justify-center text-xs p-1">
                            <p className="text-lg font-semibold">Sniper</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 grid-rows-5 gap-1">
                        {
                            // This is very ugly, but necessary to keep the functionality of placing students with visual impairments on 
                            // proper seats simple (place them by index)
                            seatingplan.slice(2, 6).map(seat => {
                                return (
                                    <DraggableSeat 
                                        seat={seat} 
                                        onDragStart={(index: number) => dragItem.current = index}
                                        onDragEnd={() => handleDropAssigned()} 
                                        onDragEnter={(index: number) => dragOverItem.current = index}
                                        width={150}
                                        height={75}
                                    />
                                )
                            })
                        }
                        {
                            seatingplan.slice(8, 12).map(seat => {
                                return (
                                    <DraggableSeat 
                                        seat={seat} 
                                        onDragStart={(index: number) => dragItem.current = index}
                                        onDragEnd={() => handleDropAssigned()} 
                                        onDragEnter={(index: number) => dragOverItem.current = index}
                                        width={150}
                                        height={75} 
                                    />
                                )
                            })
                        }
                        {
                            seatingplan.slice(14).map(seat => {
                                return (
                                    <DraggableSeat 
                                        seat={seat} 
                                        onDragStart={(index: number) => dragItem.current = index}
                                        onDragEnd={() => handleDropAssigned()} 
                                        onDragEnter={(index: number) => dragOverItem.current = index}
                                        width={150}
                                        height={75}
                                    />
                                )
                            })
                        }
                    </div>

                </div>

                <div className="flex flex-row items-center justify-center space-x-4 mt-10">
                    <button onClick={() => save()} className="bg-green-500 text-slate-50 text-xl text-center p-2 rounded-md flex flex-row items-center justify-center font-semibold space-x-3"><BiSave className="h-6 w-6 mr-3" /> Speichern </button>
                    <button onClick={() => cancel()} className="bg-red-500 text-slate-50 text-xl text-center p-2 rounded-md flex flex-row items-center justify-center font-semibold space-x-3"><MdCancel className="h-6 w-6 mr-3" /> Abbrechen</button>
                </div>
            
            </main>

            <p className="w-full text-center block xl:hidden">
                Wechsle für das Erstellen eines Sitzplans bitte auf einen größeren Bildschirm mit Tastatur und Maus.
            </p>

            <Footer />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const seatingplanId = context.query.id?.toString()

    const seatingplan = await prisma.seatingplan.findFirst({
        where: {
            id: seatingplanId
        }
    })

    const courseId = seatingplan?.courseId.toString()

    const students = await prisma.student.findMany({
        where: {
            course_participation: {
                some: {
                    course: {
                        id: courseId
                    }
                }
            },
            seats: {
                none: {
                    seatingplan: {
                        id: seatingplanId
                    }
                }
            }
        }
    })

    const seatsInDatabase = await prisma.seat.findMany({
        where: {
            seatingplan: {
                id: seatingplanId,
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

    return {
        props: {students, seats, prevTitle: seatingplan?.title}
    }
} 

export default EditSeatingplan