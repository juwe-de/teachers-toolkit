import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../components/Client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const courseId = request.query.id?.toString()

    try {

        const answersInCourse = await prisma.answer.findMany({
            where: {
                session: {
                    course: {
                        id: courseId
                    }
                }
            }
        })

        const annotationsInCourse = await prisma.annotation.findMany({
            where: {
                session: {
                    course: {
                        id: courseId
                    }
                }
            }
        })

        const course = await prisma.course.findFirst({
            where: {
                id: courseId
            }
        })

        if(course == undefined) {
            response.status(400).json({
                message: "This course doesn't exist"
            })
            return
        }

        // how important is quantity and quality?
        const quantityValue = course.quantityValue / 100
        const qualityValue = 1 - quantityValue

        let averageAnswerQuality = 0
        if(answersInCourse.length > 0) {
            averageAnswerQuality = answersInCourse.reduce((totalQuality, nextAnswer) => totalQuality + nextAnswer.quality, 0) / answersInCourse.length
        }

        // calculate partial rating
        let rating = 0
        if(answersInCourse.length > 0) {
            rating = Math.ceil(averageAnswerQuality * qualityValue + answersInCourse.length * 2 * quantityValue)
        }

        // finish calculating rating 
        annotationsInCourse.map(annotation => annotation.type == 0 ? rating++ : rating--)

        response.status(200).json({rating: rating})

    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }

}