import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import Header from '../components/Header'

const Home: NextPage = () => {
  return (
    <div className='min-h-screen'>
      <Header />
      <div className='flex flex-col items-center justify-center py-2'>
        <main className='flex max-w-4xl sm:w-full flex-wrap items-center justify-around'>
          <p className='w-96 p-10'>Dies ist ein Test!</p>
          <p className='w-96 p-10'>Hier entsteht bald:</p>
          <p className='w-96 p-10'>Eine Landing Page mit</p>
          <p className='w-96 p-10'>Einem Dashboard</p>
        </main>
      </div>
    </div>
  )
}

export default Home
