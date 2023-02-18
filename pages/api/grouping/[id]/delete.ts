import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../components/Client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const groupingId = request.query.id?.toString()

    try {

        const deleteGroupMembers = await prisma.group_Member.deleteMany({
            where: {
                group: {
                    grouping: {
                        id: groupingId
                    }
                }
            }
        })
    
        const deleteGroups = await prisma.group.deleteMany({
            where: {
                grouping: {
                    id: groupingId
                }
            }
        })

        const deleteGrouping = await prisma.grouping.delete({
            where: {
                id: groupingId
            }
        })

        response.status(200).json({message: "deleted."})

    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }
    
}