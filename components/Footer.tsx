import Link from "next/link"
import { FunctionComponent } from "react"

const Footer : FunctionComponent = () => {
    return (
        <div className="w-full h-40 bg-slate-900 flex flex-col py-3 items-center justify-center text-slate-50 space-y-5 md: space-y-10">
            <div className="flex flex-col items-center">
                <h1 className="text-lg font-semibold">DESIGNED BY THE HEINIS</h1>
                <p className="text-sm">2023</p>
            </div>

            <ul className="flex flex-col md:flex-row md:space-x-20 space-y-2 md:space-y-0 text-center justify-between underline">
                <li className="w-40">
                    <Link href="https://github.com/jew-de/teachers-toolkit/issues" rel="noreferrer" target="_blank">
                        <p>Bugreport</p>
                    </Link>
                </li>
                <li className="w-40"> 
                    <Link href="/" rel="noreferrer" target="_blank">
                        <p>Datenschutz</p>
                    </Link>
                </li>
                <li className="w-40">
                    <Link href="/" rel="noreferrer" target="_blank">
                        <p>Nutzungsbedingungen</p>
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Footer