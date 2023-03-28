import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../components/Client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const { title, subject, year, quantityValue, students, existingStudents } = request.body

    type student = {
        name: string,
        sirname: string,
        gender: number,
        visuals: number,
        dateOfBirth: number,
    }

    type exisitngStudent = {
        id: string,
        name: string,
        sirname: string,
        gender: number,
        visuals: number,
        dateOfBirth: string,
    }

    const queryCreateStudents = students.map((student: student) => {
        return {
            student: {
                create: {
                    name: student.name,
                    sirname: student.sirname,
                    visuals: student.visuals,
                    gender: student.gender,
                    dateOfBirth: student.dateOfBirth.toString(),
                }
            }
        }
    })

    const queryAddStudents = existingStudents.map((existingStudent: exisitngStudent) => {
        return {
            student:{
                connect: {
                    id: existingStudent.id
                }
            }
        }
    })

    const finalQuery = [...queryCreateStudents, ...queryAddStudents]

    try {

        // create the course
        const createCourse = prisma.course.create({
            data: {
                title,
                subject,
                year,
                quantityValue,
                created: Date.now().toString(),
                course_participation: {
                    create: finalQuery
                }
            }
        })

        const createCourseResult = await prisma.$transaction([createCourse])

        response.status(200).json({
            message: "course created",
            courseId: createCourseResult[0].id
        })

    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }
}