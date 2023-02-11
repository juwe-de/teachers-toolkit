import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../components/Client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
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

    const courseId = request.query.id?.toString()

    const { title, subject, year, quantityValue, students, existingStudents } = request.body

    try {
        const deleteParticipations = await prisma.course_Participation.deleteMany({
            where: {
                course: {
                    id: courseId
                }
            }
        })
    
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
    
        const updateCourse = await prisma.course.update({
            where: {
                id: courseId
            },
            data: {
                title: title,
                subject: subject,
                year: year,
                quantityValue: quantityValue,
                course_participation: {
                    create: finalQuery
                }
            }
        })

        response.status(200).json({message: "updated course"})

    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }
}