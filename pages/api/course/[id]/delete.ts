import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../components/Client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const courseId = request.query.id?.toString()

    try {

        const deleteParticipations = await prisma.course_Participation.deleteMany({
            where: {
                course: {
                    id: courseId
                }
            }
        })

        const groupings = await prisma.grouping.findMany({
            where: {
                course: {
                    id: courseId
                }
            }
        })

        const seatingplans = await prisma.seatingplan.findMany({
            where: {
                course: {
                    id: courseId
                }
            }
        })

        const sessions = await prisma.session.findMany({
            where: {
                course: {
                    id: courseId
                }
            }
        })

        // delete every grouping

        const deleteGroupMembers = await prisma.group_Member.deleteMany({
            where: {
                group: {
                    grouping: {
                        course: {
                            id: courseId
                        }
                    }
                }
            }
        })

        const deleteGroups = await prisma.group.deleteMany({
            where: {
                grouping: {
                    course: {
                        id: courseId
                    }
                }
            }
        })

        const deleteGroupings = await prisma.grouping.deleteMany({
            where: {
                course: {
                    id: courseId
                }
            }
        })

        // delete every session

        const deleteAnswers = await prisma.answer.deleteMany({
            where: {
                session: {
                    course: {
                        id: courseId
                    }
                }
            }
        })

        const deleteAnnotations = await prisma.annotation.deleteMany({
            where: {
                session: {
                    course: {
                        id: courseId
                    }
                }
            }
        })
        
        const deleteSessions = await prisma.session.deleteMany({
            where: {
                course: {
                    id: courseId
                }
            }
        })

        // delete every seatingplan

        const deleteSeats = await prisma.seat.deleteMany({
            where: {
                seatingplan: {
                    course: {
                        id: courseId
                    }
                }
            }
        })

        const deleteSeatingplans = await prisma.seatingplan.deleteMany({
            where: {
                course: {
                    id: courseId
                }
            }
        })

        // delete course

        const deleteCourse = await prisma.course.delete({
            where: {
                id: courseId
            }
        })

        response.status(200).json({message: "deleted"})

    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }

}