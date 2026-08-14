import React, { useEffect, useState } from 'react'
import { assets, cityList} from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'
import { generateCounterfactuals } from '../utils/croe'

const MyBookings = () => {

  const { axios, user, currency, cars } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [expandedBookings, setExpandedBookings] = useState({})

  const fetchMyBookings = async ()=>{
    try {
      const { data } = await axios.get('/api/bookings/user')
      if (data.success){
        setBookings(data.bookings)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    user && fetchMyBookings()
  },[user])

  return (
    <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    
    className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'>

      <Title title='My Bookings'
       subTitle='View and manage your all car bookings'
       align="left"/>

       <div>
        {bookings.map((booking, index)=>(
          <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          
          key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-gray-300 rounded-lg mt-5 first:mt-12'>
            {/* Car Image + Info */}

            <div className='md:col-span-1'>
              <div className='rounded-md overflow-hidden mb-3'>
                <img src={booking.car.image} alt="" className='w-full h-auto aspect-video object-cover'/>
              </div>
              <p className='text-lg font-medium mt-2'>{booking.car.brand} {booking.car.model}</p>

              <p className='text-gray-500'>{booking.car.year} • {booking.car.category} • {booking.car.location}</p>
            </div>

            {/* Booking Info */}
            <div className='md:col-span-2'>
              <div className='flex items-center gap-2'>
                <p className='px-3 py-1.5 bg-light rounded'>Booking #{index+1}</p>
                <p className={`px-3 py-1 text-xs rounded-full ${booking.status === 'confirmed' ? 'bg-green-400/15 text-green-600' : 'bg-red-400/15 text-red-600'}`}>{booking.status}</p>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1'/>
                <div>
                  <p className='text-gray-500'>Rental Period</p>
                  <p>{booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}</p>
                </div>
              </div>

              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1'/>
                <div>
                  <p className='text-gray-500'>Pick-up Location</p>
                  <p>{booking.car.location}</p>
                </div>
              </div>

              {booking.ecoSavings > 0 && (
                <div className='flex items-start gap-2 mt-3'>
                  <img src={assets.fuel_icon} alt="" className='w-4 h-4 mt-1'/>
                  <div>
                    <p className='text-gray-500'>Eco Impact</p>
                    <p>Saved {booking.ecoSavings.toFixed(1)} kg CO₂</p>
                  </div>
                </div>
              )}

              <button onClick={() => setExpandedBookings(prev => ({...prev, [booking._id]: !prev[booking._id]}))} className='mt-3 text-sm text-blue-600 hover:underline'>
                {expandedBookings[booking._id] ? 'Hide' : 'Explore'} what-if scenarios
              </button>

              {expandedBookings[booking._id] && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className='mt-3 p-3 bg-light rounded-lg'>
                  <h4 className='font-medium mb-2'>What would have happened if you chose differently?</h4>
                  {generateCounterfactuals(booking, cars, cityList).map((cf, idx) => (
                    <p key={idx} className='text-sm text-gray-600 mb-1'>
                      {cf.description}: {cf.cost !== 0 ? `${currency}${Math.abs(cf.cost).toFixed(0)} ${cf.cost > 0 ? 'more' : 'saved'}` : ''} {cf.co2 !== 0 ? `, CO₂ ${cf.co2 > 0 ? '+' : ''}${cf.co2.toFixed(1)} kg` : ''} {cf.onTime !== 0 ? `, on-time likelihood ${cf.onTime > 0 ? '+' : ''}${cf.onTime}%` : ''}
                    </p>
                  ))}
                </motion.div>
              )}
            </div>

           {/* Price */}
           <div className='md:col-span-1 flex flex-col justify-between gap-6'>
              <div className='text-sm text-gray-500 text-right'>
                <p>Total Price</p>
                <h1 className='text-2xl font-semibold text-blue-600'>{currency}{booking.price}</h1>
                <p>Booked on {booking.createdAt.split('T')[0]}</p>
              </div>
           </div>


          </motion.div>
        ))}
       </div>
      
    </motion.div>
  )
}

export default MyBookings
