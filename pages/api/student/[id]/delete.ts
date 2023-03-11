import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../components/Client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const studentId = request.query.id?.toString()

    try {

        const deleteAnnotations = await prisma.annotation.deleteMany({
            where: {
                student: {
                    id: studentId
                }
            }
        })

        const deleteAnswers = await prisma.answer.deleteMany({
            where: {
                student: {
                    id: studentId
                }
            }
        })

        const deleteGroupMembers = await prisma.group_Member.deleteMany({
            where: {
                student: {
                    id: studentId
                }
            }
        })

        const deleteSeats = await prisma.seat.deleteMany({
            where: {
                student: {
                    id: studentId
                }
            }
        })

        const deleteCourseMembers = await prisma.course_Participation.deleteMany({
            where: {
                student: {
                    id: studentId
                }
            }
        })

        const deleteStudent = await prisma.student.delete({
            where: {
                id: studentId
            }
        })

        response.status(200).json({message: "deleted."})

    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }

}