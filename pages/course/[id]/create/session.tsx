import { GetServerSideProps, NextPage } from "next"
import Footer from "../../../../components/Footer"
import Header from "../../../../components/Header"
import prisma from "../../../../components/Client"
import { useReducer, useState } from "react"
import { useRouter } from "next/router"

type seatingplan = {
    id: string,
    title: string
}

type props = {
    seatingplans: seatingplan[]
}

const CreateSession: NextPage<props> = ({seatingplans}) => {

    const [seatingplan, setSeatingplan] = useState<string>(seatingplans[0].id)

    const router = useRouter()

    const create = async () => {
        const response = await fetch(`/api/session/create`, {
            body: JSON.stringify({
                courseId: router.query.id?.toString(),
                seatingplanId: seatingplan
            }),
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await response.json()

        const sessionId = data.session.id
        
        router.push(`/session/${sessionId}`)
    }

    return (
        <div className="min-h-screen flex flex-col justify-between space-y-10">
            <Header />

            <main className="flex-col items-center justify-center flex w-full">
 
                <div className="w-full max-w-2xl bg-white border border-zinc-500 flex flex-col items-center justify-center space-y-2 rounded-md text-stone-800 p-4">
                    <p className="text-4xl text-center w-full p-2 border-b border-zinc-500 text-blue-400">Erstelle eine Session</p>

                    <div className="flex flex-col w-full items-center justify-center space-y-1 !mt-5">
                        <p className="w-full text-left text-xl text-stone-800">Bitte wähle einen Sitzplan aus</p>

                        <select value={seatingplan} onChange={e => {setSeatingplan(e.target.value); console.log(seatingplan)}} id="select-1" className="py-1 border border-zinc-500 rounded-md bg-white w-full text-lg text-stone-800 px-2 focus:outline-none text-center">
                            {seatingplans.map(seatingplan => {
                                return (
                                    <option value={seatingplan.id}>{seatingplan.title}</option>
                                )
                            })}
                        </select>
                    </div>

                    <button onClick={(e) => create()} className="text-lg bg-blue-400 rounded-full text-slate-50 font-semibold p-2 !mt-5">Los geht's!</button>
                </div>

            </main>

            <Footer />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const courseId = context.query.id?.toString()

    const seatingplans = await prisma.seatingplan.findMany({
        where: {
            course: {
                id: courseId
            }
        }
    })

    return {
        props: {seatingplans}
    }
}

export default CreateSession