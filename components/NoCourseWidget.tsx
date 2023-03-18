import Link from "next/link";
import { FunctionComponent } from "react";

type student = {
    id: string,
    name: string,
    sirname: string,
    dateOfBirth: string,
    visuals: number,
    gender: number,
    _count: {
        course_participation: number
    }
}

type props = {
    students: student[]
}

const NoCourseWidget: FunctionComponent<props> = ({students}) => {

    const studentsWithoutCourse = students.filter(student => {
        return student._count.course_participation == 0
    })

    return (
        <div className={`w-full mx-2 bg-white ${studentsWithoutCourse.length > 0 ? "flex" : "hidden"} flex-col items-center justify-center border border-zinc-500 rounded-md !mt-10 p-3 relative max-w-xl lg:max-w-4xl`}>

            <div className="w-full flex flex-col items-center justify-center space-y-2 border-b border-zinc-500 pb-1 text-stone-800">
                <h1 className="text-center text-2xl">Schüler ohne Kurs</h1>
            </div>

            <div className="flex flex-col space-y-2 items-center justify-center w-full px-5 mt-5 mx-3">
                {studentsWithoutCourse.map(student => {
                    // for now this is just a list
                    // change to some kind of slider later
                    return (
                        <Link href={`/student/${student.id}`} className="flex flex-row border-b border-dashed border-zinc-500 last:border-0 items-center justify-center space-x-4 w-full py-2 cursor-pointer hover:bg-slate-50">
                            <p className="text-lg ">{student.name} {student.sirname}</p>
                        </Link>
                    )
                })}
            </div>

        </div>
    )
}

export default NoCourseWidget