import { FunctionComponent } from "react";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";

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

type props = {
    seat: seat
    onDragStart: Function,
    onDragEnd: Function,
    onDragEnter: Function,
    height: number,
    width: number
}

const Seat: FunctionComponent<props> = ({seat, onDragStart, onDragEnd, onDragEnter, height, width}) => {

    const sights = [
        "Keine Sichtprobleme",
        "Kurzsichtig",
        "Weitsichtig",
    ]

    return (
        <div className={`bg-white w-[${width}px] h-[${height}px] border border-zinc-500 flex flex-col items-center justify-center text-xs p-1 ${seat.student.gender != -1 ? "cursor-move" : ""}`}
            draggable
            onDragStart={(e) => onDragStart(seat.index)}
            onDragEnd={(e) => onDragEnd()}
            onDragEnter={(e) => onDragEnter(seat.index)}
            onDragOver={(e) => e.preventDefault()}
        >
            <div className="flex flex-row items-center justify-between w-full">
                {seat.student.gender != -1 && (
                    <p className="font-semibold">{seat.student.sirname}, {seat.student.name}</p>
                )}
                {seat.student.gender != -1 ? seat.student.gender == 0 ? (<BsGenderMale className="h-4 w-4" />) : (<BsGenderFemale className="h-4 w-4" />) : (<></>)}
            </div>
            {seat.student.visuals != -1 && (<div className="flex flex-row w-full items-center justify-start space-x-2">
                <AiOutlineEyeInvisible />
                <p>{sights[seat.student.visuals]}</p>
            </div>)}
        </div>
    )
}

export default Seat