import Link from "next/link"
import Image from "next/image"

import { FormEvent, useState } from "react"
import { AiOutlineSearch } from "react-icons/ai"

import Menu from "./Menu"
import { useRouter } from "next/router"

import {FunctionComponent} from "react"

const Header: FunctionComponent = () => {
    const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
    const burgerButtonLine = "h-1 w-6 my-1 rounded-full transition ease transform duration-300"

    const [term, setTerm] = useState<string>("")

    const router = useRouter()

    const search = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        router.push({
            pathname: "/search",
            query: {
                term: term
            }
        })
    }

    return (
        <div className="w-full h-12 mb-2 bg-blue-500 top-0 flex flex-row items-center px-4 justify-between shadow-lg relative">
            {/* Burger menu button (only shown when on small devices) */}
            <button 
                className="flex md:hidden flex-col h-12 w-12 rounded justify-center items-center group z-10"
                onClick={() => setBurgerMenuOpen(!burgerMenuOpen)}
            >
                {/* Three lines forming a hamburger button */}
                {/* When hovered they form an X */}
                <div 
                    className={
                        `${burgerButtonLine} ${burgerMenuOpen ? "rotate-45 translate-y-3 bg-slate-200 group-hover:bg-slate-50" : "bg-slate-200 group-hover:bg-slate-50"}`
                    } 
                />
                <div 
                    className={
                        `${burgerButtonLine} ${burgerMenuOpen ? "opacity-0" : "bg-slate-200 group-hover:bg-slate-50"}`
                    } 
                />
                <div 
                    className={
                        `${burgerButtonLine} ${burgerMenuOpen ? "-rotate-45 -translate-y-3 bg-slate-200 group-hover:bg-slate-50" : "bg-slate-200 group-hover:bg-slate-50"}`
                    } 
                />
            </button>

            {/* Logo */}
            <h1 className="w-60 xl:w-96 text-2xl font-bold text-slate-50 z-10">
                <Link href="/">
                    TEACHER'S TOOLKIT
                </Link>
            </h1>
            
            <div className="md:hidden opacity-0 h-12 w-12" />

            {/* Searchbar */}
            <form onSubmit={(e) => search(e)} className="hidden md:flex flex-row flex-1 bg-slate-50 h-4/5 max-w-5xl rounded-md shadow-md items-center space-x-2 ml-2 xl:m-0">
                <button type="submit">
                    <AiOutlineSearch className="h-7 w-7 text-stone-900 ml-1 bg-slate-200 p-1 rounded-md"/>
                </button>
                
                <input onChange={(e) => setTerm(e.target.value)} className="bg-transparent focus:outline-none text-stone-800 w-full" placeholder="Suche nach irgendetwas..." />
            </form>
            
            {/* Account details (COMING SOON) */}
            <div className="hidden md:flex w-60 xl:w-96 flex-row space-x-1 justify-end text-lg text-slate-50">
                <p className="font-semibold">Heya,</p>
                <p className="underline">Christopher</p>
                <Image src="/profile.jpg" alt={"Profilbild"} width={35} height={35} className="rounded-full border-2 border-slate-50" />
            </div>

            {
                // Only show menu when button is active
                <Menu active={burgerMenuOpen} />
            }
        </div>
    )
}

export default Header;