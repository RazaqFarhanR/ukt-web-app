import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';
const SECRET = process.env.NEXT_PUBLIC_SECRET;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const index = () => {
    const router = useRouter()

    //param value
    const {tipe, ranting} = router.query

    //state
    const [events,setEvents] = useState([])
    // const [dataRanting, setDataRanting] = useState([])

    const encryptId = (str) => {
        const ciphertext = AES.encrypt(JSON.stringify(str), SECRET);
        return encodeURIComponent(ciphertext.toString());
    }

    const getEvents = async () => {
        await axios.get(BASE_URL + `event/siswa/ukt/${tipe}/${ranting}`)
        .then(res => {
            setEvents(res.data.data)
        })
        .catch (err => {
            console.log(err.message);
        })
    }

    useEffect(() => {
        if(!tipe){
            return;
        }
        getEvents()
    }, [tipe, ranting])
    

    return (
        <div className='min-h-screen h-auto bg-darkBlue'>
            {/* header */}
            <div className='bg-[#080D18] py-5 px-4 flex'>
                <button onClick={() => router.back()} className="rounded-md w-9 h-9 flex justify-center items-center group duration-300">
                    <svg className='stroke-white group-hover:stroke-purple duration-300' width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23 10H2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 18L2 10L10 2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className='mx-auto text-white text-center text-3xl uppercase font-lato font-bold tracking-wider'>{router.query.tipe} - RANTING {router.query.ranting}</h1>
            </div>

            {/* konten utama */}
            <div className='h-auto overflow-y-auto px-5 py-7 grid grid-flow-row auto-rows-max gap-y-6'>
                {events.map((item, index) => (
                    <button 
                        key={index+1} 
                        className='w-full bg-[#1B2537] py-5'
                        onClick={() => router.push({pathname:`/siswa/${router.query.tipe}/${router.query.ranting}/${encryptId(JSON.stringify({id:item.id_event,name:item.name}))}`})}
                    >
                        <h1 className='text-[#42C6A3] text-3xl font-[600] tracking-wide text-center'>{item.name}</h1>
                    </button>
                ))}
            </div>       
      

        </div>
    )
}

export default index