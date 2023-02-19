import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../components/Client";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
type student = {
        name: string,
        sirname: string,
        gender: number,
        visuals: number,
        dateOfBirth: number,
    }

    type exisitngStudent = {
        id: string,
        name: string,
        sirname: string,
        gender: number,
        visuals: number,
        dateOfBirth: string,
    }

    const courseId = request.query.id?.toString()

    const { title, subject, year, quantityValue, students, existingStudents } = request.body

    try {

        // We want to see if any exisitng students that were in the course from the beginning
        const previouslyExistingStudents = await prisma.student.findMany({
            where: {
                course_participation: {
                    some: {
                        course: {
                            id: courseId
                        }
                    }
                }
            }
        })

        // Now we can compare that to the updated existingStudents list and figure out if any students got removed
        const removedStudents = previouslyExistingStudents.filter(
            previouslyExistingStudent => !existingStudents.find((existingStudent: exisitngStudent) => existingStudent.id == previouslyExistingStudent.id )
        )

        // Now remove these students from any grouping or seatingplan in that course
        const removeFromGroupings = await prisma.group_Member.deleteMany({
            where: {
                student: {
                    id: {
                        in: removedStudents.map(student => {
                            return student.id
                        })
                    }
                },
                group: {
                    grouping: {
                        course: {
                            id: courseId
                        }
                    }
                }
            }
        })

        // TODO remove from seatingplans

        const deleteParticipations = await prisma.course_Participation.deleteMany({
            where: {
                course: {
                    id: courseId
                }
            }
        })
    
        const queryCreateStudents = students.map((student: student) => {
            return {
                student: {
                    create: {
                        name: student.name,
                        sirname: student.sirname,
                        visuals: student.visuals,
                        gender: student.gender,
                        dateOfBirth: student.dateOfBirth.toString(),
                    }
                }
            }
        })
    
        const queryAddStudents = existingStudents.map((existingStudent: exisitngStudent) => {
            return {
                student:{
                    connect: {
                        id: existingStudent.id
                    }
                }
            }
        })
    
        const finalQuery = [...queryCreateStudents, ...queryAddStudents]
    
        const updateCourse = await prisma.course.update({
            where: {
                id: courseId
            },
            data: {
                title: title,
                subject: subject,
                year: year,
                quantityValue: quantityValue,
                course_participation: {
                    create: finalQuery
                }
            }
        })

        response.status(200).json({message: "updated course"})

    } catch(error) {
        console.log(error)
        response.status(400).json({message: error})
    }
}