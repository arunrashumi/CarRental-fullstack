import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  return (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
    
    className='px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500'>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            
            className='flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-b'>
                <div>
                    <motion.img 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}

                    src={assets.logo} alt="CarRentalHub" className='h-8 md:h-9' />

                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}

                    className='max-w-80 mt-3'>
                        Premium car rental service with a wide selection of luxury and everyday vehicles for all your driving needs.
                    </motion.p>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    
                    className='flex items-center gap-3 mt-6'>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"> <img src={assets.facebook_logo} className='w-5 h-5' alt="Facebook" /> </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"> <img src={assets.instagram_logo} className='w-5 h-5' alt="Instagram" /> </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"> <img src={assets.twitter_logo} className='w-5 h-5' alt="Twitter" /> </a>
                        <a href="mailto:arunkumar@gmail.com"> <img src={assets.gmail_logo} className='w-5 h-5' alt="Email" /> </a>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}

                className='flex flex-wrap justify-between w-1/2 gap-8'>

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Quick Links</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><button onClick={() => navigate('/')} className='text-left hover:text-gray-800'>Home</button></li>
                        <li><button onClick={() => navigate('/cars')} className='text-left hover:text-gray-800'>Browse Cars</button></li>
                        <li><button onClick={() => navigate('/owner/add-car')} className='text-left hover:text-gray-800'>List Your Car</button></li>
                        <li><button onClick={() => setShowAbout(!showAbout)} className='text-left hover:text-gray-800'>About Us</button></li>
                    </ul>
                </div>

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Resources</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><button onClick={() => alert('Help Center: For assistance, contact support at arunkumar@gmail.com or call 6384395806.')} className='text-left hover:text-gray-800'>Help Center</button></li>
                        <li><button onClick={() => alert('Terms of Service: By using our service, you agree to fair use, no illegal activities, and our booking policies. Full terms available soon.')} className='text-left hover:text-gray-800'>Terms of Service</button></li>
                        <li><button onClick={() => alert('Privacy Policy: We collect minimal data for bookings. Your info is secure and not shared. Full policy available soon.')} className='text-left hover:text-gray-800'>Privacy Policy</button></li>
                        <li><button onClick={() => alert('Insurance: Basic coverage included with rentals. Additional options available. Contact for details.')} className='text-left hover:text-gray-800'>Insurance</button></li>
                    </ul>
                </div>

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Contact</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li>1234 Bannerghatta Road</li>
                        <li>Bangalore, Karnataka 560001</li>
                        <li>+91 6384395806</li>
                        <li>arunkumar@gmail.com</li>
                    </ul>
                </div>

                </motion.div>
                

                  
                

            </motion.div>
            
            {showAbout && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className='py-4 border-t border-borderColor'
                >
                    <h3 className='text-base font-medium text-gray-800'>About Us</h3>
                    <p className='mt-2'>Contact Details:</p>
                    <ul className='mt-1'>
                        <li>Name: Arun Kumar</li>
                        <li>Phone: 6384395806</li>
                        <li>Email: arunkumar@gmail.com</li>
                    </ul>
                </motion.div>
            )}
            
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                
            className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} Brand. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><button onClick={() => alert('Privacy Policy: We collect minimal data for bookings. Your info is secure and not shared. Full policy available soon.')} className='hover:text-gray-800'>Privacy</button></li>
                    <li>|</li>
                    <li><button onClick={() => alert('Terms of Service: By using our service, you agree to fair use, no illegal activities, and our booking policies. Full terms available soon.')} className='hover:text-gray-800'>Terms</button></li>
                    <li>|</li>
                    <li><button onClick={() => alert('Cookies: We use cookies to improve your experience. Essential cookies for functionality, optional for analytics.')} className='hover:text-gray-800'>Cookies</button></li>
                </ul>
            </motion.div>
        </motion.div>
  )
}

export default Footer
