import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../components/Client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const sessionId = request.query.id?.toString()

    try {

        const deleteAnnotations = await prisma.annotation.deleteMany({
            where: {
                session: {
                    id: sessionId
                }
            }
        })

        const deleteAnswers = await prisma.answer.deleteMany({
            where: {
                session: {
                    id: sessionId
                }
            }
        })

        const deleteSession = await prisma.session.delete({
            where: {
                id: sessionId
            }
        })

        response.status(200).json({message: "deleted"})
        
    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }

}