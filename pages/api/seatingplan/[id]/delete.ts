import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../components/Client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const seatingplanId = request.query.id?.toString()

    try {

        const deleteSeats = await prisma.seat.deleteMany({
            where: {
                seatingplan: {
                    id: seatingplanId
                }
            }
        })

        const deleteSeatingplan = await prisma.seatingplan.delete({
            where: {
                id: seatingplanId
            }
        })

        response.status(200).json({message: "deleted."})
        
    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }

}