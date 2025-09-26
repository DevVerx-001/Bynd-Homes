import React from 'react'

import twitter from "../assets/twitter.svg"
import insta from "../assets/insta.svg"
import linkdin from "../assets/linkdin.svg"
import facebook from "../assets/facebook.svg"


const Footer = () => {
  return (
    <>
      <footer className="bg-white border-t border-gray-200 ">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Footer Navigation */}
            <nav className="flex space-x-8">
              <a href="#" className="text-black font-semibold">
                Company
              </a>
              <a href="#" className="text-black font-semibold ">
                Support
              </a>
              <a href="#" className="text-black font-semibold ">
                Legal
              </a>
            </nav>

            {/* Social Media Icons */}
            <div className="flex  space-x-4">
              
        
             <img src={facebook} alt="" className='w-4 h-4' />


             
             <img src={twitter} alt="" className='w-4 h-4 ' />
          
           <img src={insta} alt=""  className='w-4 h-4 '/>
              
               
             <img src={linkdin} alt="" className='w-4 h-4' />
             
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer