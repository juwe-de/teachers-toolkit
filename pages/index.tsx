import type { GetServerSideProps, NextPage } from 'next'
import prisma from '../components/Client'
import Footer from '../components/Footer'
import Header from '../components/Header'

type course = {
  id: string,
  title: string,
  subject: string,
  year: number,
  quantityValue: number,
}

type props = {
  courses: course[]
}

const Home: NextPage<props> = ({ courses }) => {
  return (
    <div className='min-h-screen flex flex-col justify-between'>
      <Header />
      <main className='flex flex-col items-center justify-center py-2'>
        <div className='flex flex-col max-w-4xl sm:w-full items-center justify-center text-center'>
          {courses.map(course => {
            return(
              <div className='flex flex-col text-center'>
                <p>{course.title}</p>
                <p>{course.subject}</p>
              </div>
            )
          })}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const courses = await prisma.course.findMany()


  return {
    props: {courses}
  }
}

export default Home
