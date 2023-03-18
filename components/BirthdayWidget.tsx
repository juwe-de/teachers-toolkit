import Link from "next/link"
import { FunctionComponent } from "react"
import { FaBirthdayCake } from "react-icons/fa"

type student = {
    id: string,
    name: string,
    sirname: string,
    dateOfBirth: string,
    visuals: number,
    gender: number
}

type props = {
    students: student[]
}

const BirthdayWidget: FunctionComponent<props> = ({students}) => {
    
    // determine if it is any students birthday
    const today = new Date()
    const birthdayStudents = students.filter(student => {
        const birthday = new Date(parseInt(student.dateOfBirth))
        return birthday.getDate() == today.getDate() && birthday.getMonth() == today.getMonth()
    })

    return (
        <div className={`w-full mx-2 bg-white ${birthdayStudents.length > 0 ? "flex" : "hidden"} flex-col items-center justify-center border border-zinc-500 rounded-md !mt-10 pb-3 relative max-w-xl lg:max-w-4xl`}>

            <div className="w-full flex flex-col items-center justify-center space-y-2 border-b border-zinc-500 pb-1 text-slate-50 bg-green-500 p-4 relative overflow-hidden">
                <h1 className="text-center text-2xl font-semibold z-20">Geburtstag</h1>
                {
                    // confetti for animation
                    Array(20).fill("_").map((_, i) => {
                        return <div className="confetti"></div>
                    })
                }
            </div>

            <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5 mx-3">
                {birthdayStudents.map(student => {
                    // for now this is just a list
                    // change to some kind of slider later

                    // determine students age
                    const birthday = new Date(parseInt(student.dateOfBirth))
                    const age = today.getFullYear() - birthday.getFullYear()
                    return (
                        <Link href={`/student/${student.id}`} className="flex flex-row border-b border-dashed border-zinc-500 last:border-0 items-center justify-center space-x-4 w-full py-2 cursor-pointer hover:bg-slate-50">
                            <p className="text-lg ">{student.name} {student.sirname}</p>
                            <div className="flex flex-row items-center justify-center space-x-2">
                                <FaBirthdayCake className="w-5 h-5" />
                                <p className="text-lg">{age} Jahre</p> 
                            </div>
                        </Link>
                    )
                })}
            </div>

        </div>
    )
}

export default BirthdayWidget