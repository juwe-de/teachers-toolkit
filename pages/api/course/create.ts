import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../components/Client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const { title, subject, year, quantityValue, students } = request.body

    type student = {
        name: string,
        sirname: string,
        gender: number,
        visuals: number,
        dateOfBirth: number,
    }

    try {

        await prisma.course.create({
            data: {
                title,
                subject,
                year,
                quantityValue,
                created: Date.now().toString(),
                course_participation: {
                    create: students.map((student: student) => {
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
                }
            }
        })

        response.status(200).json({message: "course created successfully"})

    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }
}