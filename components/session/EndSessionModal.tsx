import { GiFinishLine } from "react-icons/gi"
import { FunctionComponent, useState } from "react"

type props = {
    save: Function,
    close: Function,
    show: boolean
}

const EndSessionModal: FunctionComponent<props> = ({save, close, show}) => {

    const [topic, setTopic] = useState<string>("")
    const [description, setDescription] = useState<string>("")

    return (
        <div className={`backdrop-blur-sm w-full h-full absolute items-center justify-center text-stone-800 z-50 ${show ? "flex" : "hidden"}`}>   
                    
            <div className="bg-white min-w-[400px] border border-zinc-500 rounded-md flex flex-col items-center justify-center text-slate-50 pb-4">
                <h1 className="border-b border-zinc-500 p-2 w-full text-center bg-blue-400 text-4xl relative !pb-2">
                    <p className="text-xl font-semibold">Session abschließen</p>

                    <div className="absolute text-stone-800 left-1/2 -translate-x-1/2 -translate-y-[5px] p-1 bg-white rounded-full border border-zinc-500">
                        <GiFinishLine className="w-6 h-6" />
                    </div>
                </h1>

                <form onSubmit={(e) => {e.preventDefault(); save(topic, description); setTopic(""); setDescription("")}} className="w-3/4 flex flex-col items-center justify-center space-y-3 mt-6 text-stone-800">
                    <div className="flex flex-col items-center justify-center w-full space-y-1">
                        <p className="w-full text-left">Thema der Session</p>
                        <input placeholder="Spezielle Algorithmen" onChange={(e) => setTopic(e.target.value)} className="w-full focus:outline-none border border-zinc-500 bg-slate-50 p-1 rounded-md" />
                    </div>
                    <div className="flex flex-col items-center justify-center w-full space-y-1">
                        <p className="w-full text-left">Beschreibung (optional)</p>
                        <textarea placeholder="Die Schüler*innen haben..." onChange={(e) => setDescription(e.target.value)} className="w-full focus:outline-none border border-zinc-500 bg-slate-50 p-1 rounded-md" />
                    </div>

                    <div className="flex flex-row items-center justify-center space-x-4 mt-5">
                        <button type="submit" className="text-lg font-semibold text-slate-50 bg-blue-400 border border-blue-400 p-2 rounded-full">
                            Abschließen
                        </button>
                        <button onClick={(e) => close(e)} className="text-lg font-semibold p-2 text-red-500 hover:text-slate-50 border border-red-500 rounded-full hover:bg-red-500">
                            Abbrechen
                        </button>
                    </div>
                </form>
            </div>
                    
        </div>
    )
}

export default EndSessionModal