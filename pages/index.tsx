import type { NextPage } from 'next'
import prisma from '../components/Client'
import Footer from '../components/Footer'

import Header from '../components/Header'

const Home: NextPage = () => {
  return (
    <div className='min-h-screen flex flex-col justify-between'>
      <Header />
      <main className='flex flex-col items-center justify-center py-2'>
        <div className='flex max-w-4xl sm:w-full flex-wrap items-center justify-around text-center'>
          <p className='w-96 p-10'>Dies ist ein Test!</p>
          <p className='w-96 p-10'>Hier entsteht bald:</p>
          <p className='w-96 p-10'>Eine Landing Page mit</p>
          <p className='w-96 p-10'>Einem Dashboard</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home
