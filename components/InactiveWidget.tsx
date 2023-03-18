import Link from "next/link"
import {FunctionComponent} from "react"

type session = {
    id: string,
    courseId: string,
    date: string,
}

type course = {
    id: string,
    title: string,
    year: number,
    subject: string,
    quantityValue: number,
    _count: {
        course_participation: number
    }
}

type props = {
    courses: course[],
    sessions: session[]
}

const InactiveWidget: FunctionComponent<props> = ({courses, sessions}) => {

    const inactiveCourses = courses.filter(course => {
        // courses with no sessions at all are not considered inactive
        if(sessions.filter(session => session.courseId == course.id).length == 0) return false
        return !sessions.find(session => {
            const dateOfSession = new Date(parseInt(session.date))
            const today = new Date()
            return session.courseId == course.id && today.getTime() - dateOfSession.getTime() < 1000 * 60 * 60 * 24 * 21
        })
    })

    return (
        <div className={`w-full mx-2 bg-white ${inactiveCourses.length > 0 ? "flex" : "hidden"} flex-col items-center justify-center border border-zinc-500 rounded-md !mt-10 p-3 relative max-w-xl lg:max-w-4xl`}>

            <div className="w-full flex flex-col items-center justify-center space-y-2 border-b border-zinc-500 pb-1 text-stone-800">
                <h1 className="text-center text-2xl">Inaktive Kurse</h1>
            </div>

            <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5 mx-3">
                {inactiveCourses.map(course => {
                    // for now this is just a list
                    // change to some kind of slider later
                    return (
                        <Link href={`/course/${course.id}`} className="flex flex-row border-b border-dashed border-zinc-500 last:border-0 items-center justify-center space-x-4 w-full py-2 cursor-pointer hover:bg-slate-50">
                            <p className="text-lg ">{course.title}</p>
                        </Link>
                    )
                })}
            </div>

        </div>
    )
}

export default InactiveWidget