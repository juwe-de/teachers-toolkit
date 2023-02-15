import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../components/Client";

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

    const { courseId, groups, groupingTitle } = request.body
    
    const craeteGroupsQuery = groups.map((group: group) => {
        return {
            title: group.title,
            groupSize: group.capacity,
            group_member: {
                connectOrCreate: group.students.map(student => ({
                    create: student,
                    where: { id: student.id },
                }))
            }
        }
    })
    
    try {

        // prisma create queries sind sehr verständlich :)
        const createGrouping = await prisma.course.update({
            where: {
                id: courseId
            },
            data: {
                groupings: {
                    create: {
                        title: groupingTitle,
                        created: new Date().getTime().toString(),
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
                }
            }
        })

        response.status(200).json({message: "grouping created"})

    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }

}