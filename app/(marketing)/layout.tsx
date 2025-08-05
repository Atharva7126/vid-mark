import React from 'react'
import Navbar from './_components/navbar'

const MarketingLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  
  return (
    <div className='min-h-full dark:bg-[#1F1F1F]'>
      <Navbar />
      <main className='h-[100vh]'>
        {children}
      </main>
    </div>
  )
}

export default MarketingLayout
