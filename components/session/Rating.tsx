import { FunctionComponent } from "react";
import { AiFillStar } from "react-icons/ai";

type props = {
    count: number,
    rating: number,
    setRating: Function
}

const Rating: FunctionComponent<props> = ({count, rating, setRating}) => {
    return (
        <div className="flex flex-row items-center justify-center p-4 space-x-2">
            {[...Array(count)].map((_, index) => {
                return (
                    <AiFillStar onClick={() => setRating(index + 1)} key={index} cursor="pointer" className={`w-14 h-14 ${rating - 1 >= index ? "text-yellow-400" : "text-gray-500"}`} />
                )
            })}
        </div>
    )
}

export default Rating