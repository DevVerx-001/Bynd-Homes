import React from 'react'
import { TbBrandFacebook } from "react-icons/tb";
import { CiTwitter } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import { LuLinkedin } from "react-icons/lu";

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
              
              <a href="#" className="text-black ">
                <TbBrandFacebook size={`20px`} />
              </a>
             <a href="#" className="text-black ">
                <CiTwitter size={`22px`} />
              </a>
               <a href="#" className="text-black ">
               <FaInstagram size={`20px`} />
              </a>
               <a href="#" className="text-black ">
               <LuLinkedin size={`20px`} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer