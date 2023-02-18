import { GetServerSideProps, NextPage } from "next";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs"

import prisma from "../../../components/Client";
import { useEffect, useRef, useState } from "react";
import { BiSave } from "react-icons/bi";
import { MdCancel } from "react-icons/md";
import { useRouter } from "next/router";

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
    title: string,
}

type props = {
    studentsWithoutGroup: student[],
    grouping: grouping,
    exisitingGroups: group[],
    allStudents: student[]
}

const EditGrouping: NextPage<props> = ({ grouping, exisitingGroups, studentsWithoutGroup, allStudents }) => {

    const [groupingTitle, setGroupingTitle] = useState<string>(grouping.title)
    const [groups, setGroups] = useState<group[]>(exisitingGroups)

    const [groupSize, setGroupSize] = useState<number>(exisitingGroups[0].capacity)

    const [studentsNotAssigned, setStudentsNotAssigned] = useState<student[]>(studentsWithoutGroup)

    // the student being dragged
    const dragItem = useRef<any>(null)
    // the group a student is being dragged over
    const groupDragOverItem = useRef<any>(null)
    // the group a student is being dragged from to another group
    const startGroupItem = useRef<any>(null)
    // the student another student has been dropped on
    const studentDragOverItem = useRef<any>(null)
    
    const router = useRouter()

    const createMoreGroupsIfNeeded = () => {
        const groupCount = Math.ceil(allStudents.length / groupSize)

        // we have enough groups
        if(groups.length >= groupCount) return

        // we need to create more groups
        const newGroups = groups

        for(let i = groups.length + 1; i <= groupCount; i++) {
            const group = {
                title: `Gruppe ${i}`,
                capacity: groupSize,
                students: []
            }

            newGroups.push(group)
        }

        setGroups([...newGroups])
    }


    useEffect(() => {
        createMoreGroupsIfNeeded()
    }, [])

    const reset = () => {
        const newGroups = groups
        const newStudentsNotAssigned = studentsNotAssigned

        // add all students to unassigned list
        newGroups.map((group: group) => {
            group.students.map((student: student) => {
                newStudentsNotAssigned.push(student)
            })

            // remove all students from their groups
            group.students.splice(0, group.students.length)
        })

        setStudentsNotAssigned([...newStudentsNotAssigned])
        setGroups([...newGroups])
    }

    const handleDropUnassigned = () => {
        // called when an unassigned student is dropped

        // student is being dropped over "nothing"
        if(groupDragOverItem.current == null) return

        const studentDropped = studentsNotAssigned[dragItem.current]
        const group = groups[groupDragOverItem.current]

        // student already is in the group
        if(group.students.some(student => student === studentDropped)) return

        // group is already full
        if(group.students.length >= group.capacity) return

        // remove the students from not assigned list
        const newStudentsNotAssigned = studentsNotAssigned
        newStudentsNotAssigned.splice(dragItem.current, 1)
        setStudentsNotAssigned([...studentsNotAssigned])

        // add student to the group
        group.students.push(studentDropped)

        const newGroups = groups
        newGroups[groupDragOverItem.current] = group
        setGroups([...newGroups])

        dragItem.current == null
        groupDragOverItem.current == null

    }

    const handleDropAssigned = () => {
        // called when an assigned student is dropped

        // student is being dropped over "nothing"
        if(groupDragOverItem.current == null) return
        // something went wrong...
        if(startGroupItem.current == null) return
        // student is already in this group
        if(startGroupItem.current == groupDragOverItem.current) return

        const groupDraggedFrom = groups[startGroupItem.current]
        const groupDraggedTo = groups[groupDragOverItem.current]

        // group is full
        if(groupDraggedTo.students.length >= groupDraggedTo.capacity) {
            if(studentDragOverItem.current == null) return

            // swap students
            const studentToSwapWith = groupDraggedTo.students[studentDragOverItem.current]
            groupDraggedTo.students.splice(studentDragOverItem.current, 1)
            groupDraggedFrom.students.push(studentToSwapWith)
        }

        const student = groupDraggedFrom.students[dragItem.current]

        groupDraggedFrom.students.splice(dragItem.current, 1)
        groupDraggedTo.students.push(student)

        const newGroups = groups
        newGroups[startGroupItem.current] = groupDraggedFrom
        newGroups[groupDragOverItem.current] = groupDraggedTo

        setGroups([...newGroups])

        dragItem.current = null
        groupDragOverItem.current = null
        startGroupItem.current = null
        studentDragOverItem.current = null

    }

    const handleGroupTitleChange = (title: string, groupIndex: number) => {
        const newGroups = groups
        const groupToRename = groups[groupIndex]

        groupToRename.title = title

        newGroups[groupIndex] = groupToRename

        setGroups([...newGroups])

        console.log(groups)
    }

    const generateRandomly = () => {

        // groups are full, so reset students to regenerate groups
        // if not, fill up the rest of te groups
        if(studentsNotAssigned.length == 0) reset()

        const newGroups = groups
        newGroups.map((group: group) => {

            for(let i = group.students.length; i < group.capacity; i++) {

                if(studentsNotAssigned.length == 0) break

                // random student index
                const studentIndex = Math.floor(Math.random() * studentsNotAssigned.length)

                const student = studentsNotAssigned[studentIndex]

                const newStudentsNotAssigned = studentsNotAssigned
                newStudentsNotAssigned.splice(studentIndex, 1)
                setStudentsNotAssigned([...newStudentsNotAssigned])

                group.students.push(student)

            }
            
        })

        setGroups([...newGroups])

    }

    const save = async () => {
        if(studentsNotAssigned.length > 0) {
            alert("Nicht alle Schüler sind in einer Gruppe!")
            return
        }

        if(!validateTitles()) {
            alert("Bitte stelle sicher, dass alle Gruppen und die Gruppeneinteilungen einen Titel haben!")
            return
        }
        
        await fetch(`/api/grouping/${grouping.id}/edit`, {
            body: JSON.stringify({
                groups: groups,
                groupingTitle: groupingTitle
            }),
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        })

        router.push(`/grouping/${router.query.id}`)
        
    }

    const cancel = () => {
        if(!confirm("Willst du wirklich abbrechen? Alle Daten gehen verloren!")) return

        router.push(`/grouping/${router.query.id}`)
    }

    const validateTitles = () => {
        // checks if titles of groups are not ""
        // That would cause problems in the ui for displaying the groups, so we don't want that
        // grouping title itself changes to "Unbenannte Gruppeneinteilung", so this won't be a problem

        for(let group of groups) {
            if(group.title == "") return false
        }

        if(groupingTitle == "") return false

        return true
    }

    return (
        <div className="min-h-screen flex flex-col justify-between space-y-10 overflow-y-scroll no-scrollbar">
            <Header />

            <main className="flex flex-col items-center justify-center">
                <div className="max-w-lg md:max-w-2xl lg:max-w-4xl w-full flex flex-col items-center justify-center">

                    {/* Heading */}
                    <div className="w-full flex flex-row items-center justify-start space-x-2 text-4xl text-blue-400 border-b border-zinc-500 px-4 text-center md:text-left md:mx-4 py-2">
                        <h1>Bearbeite</h1>
                        <h1 className="underline">{grouping.title}</h1>
                    </div>

                    
                    <div className="w-full max-w-2xl flex flex-col items-center justify-center mt-10 space-y-10 px-4">
                        <div className="flex flex-col space-y-2 w-full">
                            <p className="w-full text-left text-xl text-stone-800">Name</p>
                            <input value={groupingTitle} onChange={e => setGroupingTitle(e.target.value)} className="py-1 border border-zinc-500 rounded-md bg-white w-full text-lg text-stone-800 px-2 focus:outline-none" placeholder="Unbenannte Gruppeneinteilung"/>
                        </div>

                        {/* List of unassigned students */}
                        <div className="w-full bg-white flex flex-col items-center justify-center border border-zinc-500 rounded-md !mt-28 p-3">
                            <h1 className="w-full text-center mx-4 text-2xl text-stone-800 border-b border-zinc-500 pb-1 font-md">Schüler (unzugeordnet)</h1>

                            <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5">
                                {studentsNotAssigned.map((student, index) => {
                                    return (
                                        <div key={index} className="flex flex-row justify-between items-center w-full border-b border-zinc-500 border-dashed last:border-0 hover:bg-slate-50"
                                            draggable
                                            onDragStart={(e) => dragItem.current = index}
                                            onDragEnd={handleDropUnassigned}
                                            onDragOver={(e) => {e.preventDefault(); e.dataTransfer.dropEffect="move"}}
                                        >
                                            <div className="w-full p-1 cursor-move">{student.sirname}, {student.name}</div>
                                            {student.gender == 0 ? (<BsGenderMale />) : (<BsGenderFemale />)}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="flex flex-row items-center justify-center space-x-4 mt-10">
                            <button onClick={() => generateRandomly()} className="text-stone-800 text-md text-center p-2 rounded-lg flex flex-row items-center justify-center space-x-3 border border-zinc-500">Zufällig</button>
                            <button onClick={() => reset()} className="text-stone-800 text-md text-center p-2 rounded-lg flex flex-row items-center justify-center space-x-3 border border-zinc-500">Zurücksetzen</button>
                        </div>

                        {/* List of groups */}
                        {groups.map((group: group, groupIndex) => {
                            return (
                                <div key={groupIndex} className="w-full bg-white flex flex-col items-center justify-center border border-zinc-500 rounded-md !mt-20 p-3"  onDragEnter={(e) => {groupDragOverItem.current = groupIndex}}>

                                    <input onChange={(e) => handleGroupTitleChange(e.target.value, groupIndex)} className="text-center py-1 border border-zinc-500 rounded-md bg-white w-full text-lg text-stone-800 px-2 focus:outline-none" placeholder={`Gruppe ${groupIndex + 1}`} value={group.title}></input>

                                    <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5">

                                        {
                                            group.students.map((student: student, studentIndex) => {
                                                return (
                                                    <div
                                                        key={studentIndex}
                                                        draggable
                                                        onDragEnter={(e) => studentDragOverItem.current = studentIndex}
                                                        onDragStart={(e) => {dragItem.current = studentIndex; startGroupItem.current = groupIndex}}
                                                        onDragEnd={handleDropAssigned}
                                                        onDragOver={(e) => {e.preventDefault(); e.dataTransfer.dropEffect="move"}}
                                                        className="flex flex-row justify-between items-center w-full border-b border-zinc-500 border-dashed last:border-0 hover:bg-slate-50"
                                                    >
                                                        <div className="w-full p-1 cursor-move">{student.sirname}, {student.name}</div>
                                                        {student.gender == 0 ? (<BsGenderMale />) : (<BsGenderFemale />)}
                                                    </div>
                                                )
                                            })
                                        }

                                    </div>

                                </div>
                            )
                        })}

                        <div className="flex flex-row items-center justify-center space-x-4 mt-10">
                            <button onClick={() => save()} className="bg-green-500 text-slate-50 text-xl text-center p-2 rounded-md flex flex-row items-center justify-center font-semibold space-x-3"><BiSave className="h-6 w-6 mr-3" /> Speichern </button>
                            <button onClick={() => cancel()} className="bg-red-500 text-slate-50 text-xl text-center p-2 rounded-md flex flex-row items-center justify-center font-semibold space-x-3"><MdCancel className="h-6 w-6 mr-3" /> Abbrechen</button>
                        </div>

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

    const exisitingGroups: group[] = []

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

        exisitingGroups.push(group)
    }

    const course = await prisma.course.findFirst({
        where: {
            id: grouping?.courseId?.toString()
        }
    })

    const studentsWithoutGroup = await prisma.student.findMany({
        where: {
            group_member: {
                none: {
                    group: {
                        grouping: {
                            id: groupingId
                        }
                    }
                }
            }
        }
    })

    // every student in the course of the grouping (needed to calculate max gorup size)
    const allStudents = await prisma.student.findMany({
        where: {
            course_participation: {
                some: {
                    course: {
                        id: course?.id?.toString()
                    }
                }
            }
        }
    })

    console.log(studentsWithoutGroup)

    return {
        props: {grouping, exisitingGroups, studentsWithoutGroup, allStudents}
    }
} 

export default EditGrouping