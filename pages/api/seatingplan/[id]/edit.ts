import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../components/Client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    
    const seatingplanId = request.query.id?.toString()

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

    const {seatingplan, title} = request.body

    const seatsToSave = seatingplan.filter((seat: seat) => seat.student.gender != -1)

    try {

        const deletePreviousSeats = await prisma.seat.deleteMany({
            where: {
                seatingplan: {
                    id: seatingplanId
                }
            }
        })

        const editSeatingplan = await prisma.seatingplan.update({
            where: {
                id: seatingplanId
            },
            data: {
                title: title,
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
        })

        response.status(200).json({message: "updated"})

    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }

}