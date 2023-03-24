import { FunctionComponent } from "react"

import { GoTrashcan } from "react-icons/go" 
import { FaBirthdayCake } from "react-icons/fa"
import { AiOutlineEyeInvisible } from "react-icons/ai"
import { BsGenderMale, BsGenderFemale } from "react-icons/bs"

// Component to show a student in a listing of students, e.g. in the create course page
type Props = {
    information: {
        name: string,
        sirname: string,
        gender: number
        dateOfBirth: number,
        visuals: number,
    },
    deleteStudent: Function,
}

const sights = [
    "Gute Sicht",
    "Kurzsichtig",
    "Weitsichtig",
]

const StudentItem: FunctionComponent<Props> = ({ information, deleteStudent }) => {

    const dateOfBirth = new Date(information.dateOfBirth)
    const day = dateOfBirth.getDate()
    const month = dateOfBirth.getMonth() + 1
    const year = dateOfBirth.getFullYear()

    return (
        <div className="w-full bg-white border-b border-dashed border-zinc-500 last:border-b-0 py-2 flex flex-col md:flex-row items-center justify-center md:justify-start space-x-1 text-lg text-stone-800">
            <div className="flex flex-row items-center justify-between space-x-2 w-full max-w-[300px]">
                <div className="flex flex-row items-center justify-start w-full space-x-1">
                    <p className="w-1/2 overflow-hidden truncate">{information.sirname},</p>
                    <p className="w-1/2 overflow-hidden truncate">{information.name}</p>
                </div>
                {information.gender == 0 ? (<BsGenderMale />) : (< BsGenderFemale />)}
            </div>

            <p className="flex flex-row items-center justify-center space-x-2 w-28">
                <FaBirthdayCake className="mr-2" /> 
                {day < 10 ? 0 : ""}{day}.{month < 10 ? 0 : ""}{month}.{year}
            </p>

            <p className="flex flex-row items-center justify-center space-x-2 min-w-[120px]">
                <AiOutlineEyeInvisible className="mr-2" />
                {sights[information.visuals]}
            </p>

            <button onClick={() => deleteStudent(information)} className="bg-red-500 text-slate-50 p-1 rounded-md"><GoTrashcan className="h-6 w-6" /></button>
        </div>
    )
}

export default StudentItem