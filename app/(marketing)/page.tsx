import React from 'react'
import Heading from './_components/heading'
import Footer from './_components/footer'

const MarketingPage = () => {
  return (
    <div className='min-h-full flex flex-col pt-5 md:pt-40'>
        <div className='flex flex-col justify-center md:justify-start items-center text-center gap-y-8 flex-1 px-6 '>
            <Heading />
        </div>
        <Footer />
    </div>
  )
}

export default MarketingPage
