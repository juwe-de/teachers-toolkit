import { FunctionComponent, useState } from "react"
import Rating from "./Rating"
import { HiHandRaised } from "react-icons/hi2"

type props = {
    close: Function,
    save: Function,
    show: boolean
}

const AnswerModal: FunctionComponent<props> = ({close, save, show}) => {

    const [quality, setQuality] = useState<number>(0)


    return (
        <div className={`backdrop-blur-sm w-full h-full absolute items-center justify-center text-stone-800 z-50 ${show ? "flex" : "hidden"}`}>   
                    
            <div className="bg-white min-w-[300px] border border-zinc-500 rounded-md flex flex-col items-center justify-center text-slate-50 pb-4">
                <h1 className="border-b border-zinc-500 p-2 w-full text-center bg-blue-400 text-4xl relative !pb-2">
                    <p className="text-xl font-semibold">Antwort</p>

                    <div className="absolute text-yellow-500 left-1/2 -translate-x-1/2 -translate-y-[5px] p-1 bg-white rounded-full border border-zinc-500">
                        <HiHandRaised className="w-6 h-6" />
                    </div>
                </h1>

                <div className="flex flex-col items-center justify-center space-y-2 w-full mt-2 text-stone-800">
                    <p className="text-lg mt-6">Wie gut war die Antwort?</p>

                    <Rating 
                        count={5}
                        rating={quality}
                        setRating={(rating: number) => setQuality(rating)}
                        editable={true}
                        size={12}
                    />
                    
                </div>

                <div className="flex flex-row items-center justify-center space-x-4 mt-5">
                    <button onClick={() => {save(quality); setQuality(5)}} className="text-lg font-semibold text-slate-50 bg-blue-400 border border-blue-400 p-2 rounded-full">
                        Speichern
                    </button>
                    <button onClick={() => close()} className="text-lg font-semibold p-2 text-red-500 hover:text-slate-50 border border-red-500 rounded-full hover:bg-red-500">
                        Abbrechen
                    </button>
                </div>
            </div>
                    
        </div>
    )
}

export default AnswerModal