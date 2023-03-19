import Link from "next/link"
import Image from "next/image"

import { AiOutlineSearch } from "react-icons/ai"

import { NextComponentType } from "next"
import { FunctionComponent } from "react"

type Props = {
    active : boolean,
}

const Menu : FunctionComponent<Props> = ({ active }) => {
    return (
        <div className={`${active ? "opacity-100 translate-y-0 backdrop-blur-md" : "opacity-0 -translate-y-72 backdrop-blur-none"} z-20 md:hidden absolute top-12 left-0 p-2 w-full h-60 border border-zinc-500 flex flex-col space-y-4 justify-center items-center transition translate ease-in duration-300`}>
            {/* Profile picture */}
            <Image src="/profile.jpg" alt={"Profilbild"} width={50} height={50} className="rounded-full border-4 border-stone-900" />

            <div className="flex flex-row items-center justify-center text-xl text-stone-800 space-x-1">
                <p className="font-semibold">Heya,</p>
                <p className="underline">Christopher</p>
            </div>

            <Link href="/search?term=" className="flex flex-row space-x-1 text-lg text-stone-800 items-center">
                <AiOutlineSearch className="w-5 h-5"/>
                <p>Suche</p>
            </Link>
        </div>
    )
}

export default Menu