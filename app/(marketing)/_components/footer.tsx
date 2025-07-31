import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full border-t py-4 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} VidMark. All rights reserved.
    </footer>
  )
}

export default Footer
