import { FunctionComponent } from "react";
import { AiFillStar } from "react-icons/ai";

type props = {
    count: number,
    rating: number,
    setRating: Function,
    editable: boolean,
    size: number
}

const Rating: FunctionComponent<props> = ({count, rating, setRating, editable, size}) => {

    const changeRating = (index: number) => {
        if(!editable) return
        setRating(index + 1)
    }

    return (
        <div className="flex flex-row items-center justify-center p-4 space-x-2">
            {[...Array(count)].map((_, index) => {
                return (
                    <AiFillStar 
                        onClick={() => changeRating(index)} 
                        key={index} 
                        className={`w-${size} h-${size} ${rating - 1 >= index ? "text-yellow-400" : "text-gray-500"} ${editable ? "cursor-pinter" : ""}`} 
                    />
                )
            })}
        </div>
    )
}

export default Rating