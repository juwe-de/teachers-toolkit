import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../components/Client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const studentId = request.query.id?.toString()

    const {courseId, sessionId} = request.body

    try {

        // invalid request
        // trying to cacluclate student rating inside a session and a course at the same time
        if(courseId != undefined && sessionId != undefined) return 0

        let rating = 0

        // get the/all course participation(s)
        const courseParticipations = await prisma.course_Participation.findMany({
            where: {
                student: {
                    id: studentId
                },
                course: {
                    // courseId == undefined returns all courses
                    id: courseId
                }
            }
        })

        for(let courseParticipation of courseParticipations) {

            const course = await prisma.course.findFirst({
                where: {
                    id: courseParticipation.courseId
                }
            })
            // something went wrong
            if(course == undefined) return 0

            const quantityValue = course.quantityValue / 100
            const qualityValue = 1 - quantityValue

            // get answers of the student in respective course / session
            const answers = await prisma.answer.findMany({
                where: {
                    session: {
                        // sessionId == undefined returns all sessions
                        id: sessionId,
                        course: {
                            id: course.id
                        }
                    },
                    student: {
                        id: studentId
                    }
                }
            })

            // get annotations of the student in respective course / session
            const annotations = await prisma.annotation.findMany({
                where: {
                    session: {
                        // sessionId == undefined returns all sessions
                        id: sessionId,
                        course: {
                            id: course.id
                        }
                    },
                    student: {
                        id: studentId
                    }
                }
            })

            // calculate the students rating
            if(answers.length > 0) {
                const averageAnswerQuality = answers.reduce((totalQuality: number, nextAnswer: {quality: number}) => totalQuality + nextAnswer.quality, 0) / answers.length
                rating += Math.ceil(averageAnswerQuality * qualityValue + answers.length * 2 * quantityValue)
            }

            annotations.map((annotation: {type: number}) => {
                annotation.type == 0 ? rating++ : rating--
            })
        }

        response.status(200).json({rating: rating})

    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }

}