import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../components/Client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const sessionId = request.query.id?.toString()

    const { studentId, type, description } = request.body

    try {

        const createAnnotation = await prisma.annotation.create({
            data: {
                session: {
                    connect: {
                        id: sessionId
                    }
                },
                student: {
                    connect: {
                        id: studentId
                    }
                },
                type: type,
                description: description
            }
        })

        response.status(200).json({message: "added"})

    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }
    
}