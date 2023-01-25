import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <main className='flex max-w-4xl sm:w-full flex-wrap items-center justify-around'>
        <p className='w-96 p-10'>Dies ist ein Test!</p>
        <p className='w-96 p-10'>Hier entsteht bald:</p>
        <p className='w-96 p-10'>Eine Landing Page mit</p>
        <p className='w-96 p-10'>Einem Dashboard</p>
      </main>
    </div>
  )
}

export default Home
