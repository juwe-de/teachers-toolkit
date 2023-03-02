import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../components/Client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    type seat = {
        student: student,
        index: number,
    }

    type student = {
        id: string,
        name: string,
        sirname: string,
        dateOfBirth: string,
        gender: number,
        visuals: number
    }

    const {courseId, seatingplan, title} = request.body

    const seatsToSave = seatingplan.filter((seat: seat) => seat.student.gender != -1)

    try {

        const createSeatingplan = await prisma.course.update({
            where: {
                id: courseId
            },
            data: {
                seatingplans: {
                    create: {
                        title: title,
                        created: new Date().getTime().toString(),
                        seats: {
                            create: seatsToSave.map((seat: seat) => {
                                return {
                                    student: {
                                        connect: {
                                            id: seat.student.id
                                        }
                                    },
                                    index: seat.index
                                }
                            })
                        }
                    }
                }
            }
        })

        response.status(200).json({message: "created"})

    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }

}