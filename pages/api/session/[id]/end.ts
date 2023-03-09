import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../components/Client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const sessionId = request.query.id?.toString()
    const {topic, description} = request.body

    try {

        const session = await prisma.session.findFirst({
            where: {
                id: sessionId
            }
        })

        if(session == null) return

        // Get the number of minutes (the duration) the session has lasted
        const today = new Date()
        const created = new Date(parseInt(session?.date))

        const differenceMilliseconds = today.getTime() - created.getTime()
        const differenceInMinutes = Math.floor((differenceMilliseconds/1000)/60)

        const endSession = await prisma.session.update({
            where: {
                id: sessionId
            },
            data: {
                duration: differenceInMinutes,
                topic: topic,
                description: description,
            }
        })

        response.status(200).json({message: "ended"})
        
    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }

}