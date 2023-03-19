import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../components/Client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const {courseId, seatingplanId} = request.body

    try {

        const createSession = await prisma.session.create({
            data: {
                topic: "",
                description: "",
                duration: 0,
                date: new Date().getTime().toString(),
                course: {
                    connect: {
                        id: courseId
                    }
                },
                seatingplan: {
                    connect: {
                        id: seatingplanId
                    }
                }
            }
        })

        response.status(200).json({message: "created", session: createSession})
        
    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }

}