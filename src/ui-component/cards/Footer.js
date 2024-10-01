import React from 'react'
import './style.css'

const Footer = () => {
  return (
    <>
      <div className='footer'>
        <p>
        Copyright © {new Date().getFullYear()} MedMine, LLC. All rights reserved.
        </p>
      </div>
    </>
  )
}

export default Footer
