import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../components/Client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    type student = {
        id: string,
        name: string,
        sirname: string,
        dateOfBirth: string,
        gender: number,
        visuals: number
    }
    
    type group = {
        title: string,
        capacity: number,
        students: student[]
    }

    const groupingId = request.query.id?.toString()

    const { groups, groupingTitle } = request.body

    try {
        const deleteOldGroupMembers = await prisma.group_Member.deleteMany({
            where: {
                group: {
                    grouping: {
                        id: groupingId
                    }
                }
            }
        })
    
        const deleteOldGroups = await prisma.group.deleteMany({
            where: {
                grouping: {
                    id: groupingId
                }
            }
        })
    
        const updateGrouping = await prisma.grouping.update({
            where: {
                id: groupingId
            },
            data: {
                title: groupingTitle,
                groups: {
                    create: groups.map((group: group) => {
                        return {
                            title: group.title,
                            groupSize: group.capacity,
                            group_member: {
                                create: group.students.map((student: student) => {
                                    return {
                                        student: {
                                            connect: {
                                                id: student.id
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })

        response.status(200).json({message: "updated."})
        
    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }
}