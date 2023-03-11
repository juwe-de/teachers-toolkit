import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../components/Client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const studentId = request.query.id?.toString()

    const {name, sirname, dateOfBirth, visuals, gender} = request.body

    try {

        const updateStudent = await prisma.student.update({
            where: {
                id: studentId
            },
            data: {
                name: name,
                sirname: sirname,
                dateOfBirth: dateOfBirth,
                visuals: visuals,
                gender: gender
            }
        })

        response.status(200).json({message: "deleted."})

    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }

}