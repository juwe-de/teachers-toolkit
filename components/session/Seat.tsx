import { FunctionComponent } from "react";
import { BsGenderFemale, BsGenderMale, BsFillHandThumbsUpFill, BsFillHandThumbsDownFill } from "react-icons/bs";
import { HiHandRaised } from "react-icons/hi2"

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

type session = {
    id: number
}

type props = {
    seat: seat,
    height: number,
    width: number,
    toggleAnnotationModal: Function,
    toggleAnswerModal: Function
}

const Seat: FunctionComponent<props> = ({seat, height, width, toggleAnnotationModal, toggleAnswerModal}) => {

    const sights = [
        "Keine Sichtprobleme",
        "Kurzsichtig",
        "Weitsichtig",
    ]

    return (
        <div key={seat.index} className={`bg-white w-[${width}px] h-[${height}px] border border-zinc-500 flex flex-col items-center justify-center p-1`}>
            <div className="flex flex-row items-center justify-between w-full">
                {seat.student.gender != -1 && (
                    <p className="font-semibold">{seat.student.sirname}, {seat.student.name}</p>
                )}
                {seat.student.gender != -1 ? seat.student.gender == 0 ? (<BsGenderMale className="h-5 w-5" />) : (<BsGenderFemale className="h-5 w-5" />) : (<></>)}
            </div>
            {seat.student.visuals != -1 && (
                <div className="flex flex-col w-full items-center justify-center p-3 space-y-2">
                    <div className="flex flex-row w-full items-center justify-center space-x-2">
                        
                        <BsFillHandThumbsUpFill onClick={() => toggleAnnotationModal(seat.student.id, 0)} className="text-yellow-300 hover:text-yellow-500 cursor-pointer h-6 w-6 " />
                        
                        <BsFillHandThumbsDownFill onClick={() => toggleAnnotationModal(seat.student.id, 1)} className=" text-red-300 hover:text-red-500 cursor-pointer h-6 w-6 " />
                    </div>
                    <button onClick={() => toggleAnswerModal(seat.student.id)} className="text-stone-800 rounded-md border border-zinc-500 p-1 flex flex-row items-center justify-center space-x-2 group hover:font-semibold">
                        <HiHandRaised className="w-6 h-6 text-yellow-400 group-hover:text-yellow-500" /> Antwort
                    </button>
                </div>
            )}
        </div>
    )
}

export default Seat