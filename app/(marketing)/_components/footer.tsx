import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full flex flex-col border-t py-4 text-center text-sm text-muted-foreground">
      <div>
      © {new Date().getFullYear()} VidMark. All rights reserved.
      </div>
      <div>
        <Link className='hover:underline' href="/privacy-policy">Privacy policy</Link>
      </div>
    </footer>
  )
}

export default Footer
