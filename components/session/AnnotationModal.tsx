import { FunctionComponent, useState } from "react"
import { BsFillHandThumbsUpFill, BsFillHandThumbsDownFill } from "react-icons/bs";

type props = {
    type: number,
    close: Function,
    save: Function,
    show: boolean
}

const AnnotationModal: FunctionComponent<props> = ({type, close, save, show}) => {

    const [description, setDescription] = useState<string>("")

    return (
        <div className={`backdrop-blur-sm w-full h-full absolute items-center justify-center text-stone-800 z-20 ${show ? "flex" : "hidden"}`}>   
                    
            <div className="bg-white min-w-[300px] border border-zinc-500 rounded-md flex flex-col items-center justify-center text-slate-50 pb-4">
                <h1 className="border-b border-zinc-500 p-2 w-full text-center bg-blue-400 text-2xl relative !pb-2">
                    <p className="text-xl font-semibold">Anmerkung</p>

                    <div className="absolute text-yellow-500 left-1/2 -translate-x-1/2 -translate-y-[5px] p-1 bg-white rounded-full border border-zinc-500">
                        {
                            type == 0 ? (<BsFillHandThumbsUpFill />) : (<BsFillHandThumbsDownFill />)
                        }
                    </div>
                </h1>

                <textarea 
                    className="focus:outline-none w-3/4 bg-slate-50 border border-zinc-500 mt-6 rounded-sm p-2 text-stone-800 !mx-4" 
                    placeholder={type == 1 ? "Was hat er/sie angestellt?" : "Warum ist er/sie so super?"}
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                />

                <div className="flex flex-row items-center justify-center space-x-4 mt-5">
                    <button onClick={() => {save(description, type); setDescription("")}} className="text-lg font-semibold text-slate-50 bg-blue-400 border border-blue-400 p-2 rounded-full">
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

export default AnnotationModal