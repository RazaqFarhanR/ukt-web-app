import React, { useEffect, useState, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { globalState } from '@/context/context'


const header = () => {

    // state router
    const location = useRouter()
    const { pathname } = location
    const splitLoc = pathname.split('/penguji')[1]

    const [event,setEvent] = useState([])
    const {active, setActive} = useContext(globalState)

    const getEvent = () => {
        setEvent(JSON.parse(localStorage.getItem('event')))
    }
    useEffect(() => {
        if (splitLoc == '/[name]') {
            getEvent()
        }
    }, [])
    
    return (
        <>
            <div className="sticky top-0 z-10 header border-b bg-navy shadow shadow-black w-full px-2 py-3 font-lato">
                {splitLoc == '' ?
                <Link href={'/penguji/edit_profile'} className="absolute px-2 translate-y-1">
                    <svg className='stroke-white hover:stroke-purple duration-300' width="25" height="25" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25 26.25V23.75C25 22.4239 24.4732 21.1521 23.5355 20.2145C22.5979 19.2768 21.3261 18.75 20 18.75H10C8.67392 18.75 7.40215 19.2768 6.46447 20.2145C5.52678 21.1521 5 22.4239 5 23.75V26.25" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 13.75C17.7614 13.75 20 11.5114 20 8.75C20 5.98858 17.7614 3.75 15 3.75C12.2386 3.75 10 5.98858 10 8.75C10 11.5114 12.2386 13.75 15 13.75Z" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Link>
                    :
                    <button onClick={() => location.back()} className="text-slate-600 text-2xl w-10 h-10 absolute top-0 translate-y-1 px-2 group">
                        <svg className='stroke-white group-hover:stroke-purple duration-300' width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23 10H2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 18L2 10L10 2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                }   

                <div className="flex justify-center items-center px-4">

                    {/* Title */}
                    {(() =>{
                        if (splitLoc == '') {
                            return (
                                <h1 className='text-xl font-semibold text-green tracking-wide'>PENGUJI UKT</h1>

                            )
                        } else {
                            if (splitLoc == '/[name]') {
                                return (
                                    <h1 className='text-xl font-semibold text-green tracking-wide uppercase'>{event.tipe_ukt} - {active}</h1>
    
                                )
                            } else if(splitLoc.includes('/event_')){
                                let active = splitLoc.split('/event_')[1]
                                if (active == '') {
                                    return (
                                        <h1 className='text-xl font-semibold text-green tracking-wide uppercase'>{active}</h1>
        
                                    )
                                }else if (active == 'ukcw') {
                                    return (
                                        <h1 className='text-xl font-semibold text-green tracking-wide uppercase'>{active}</h1>
                                    )     
                                } else {
                                    return (
                                        <h1 className='text-xl font-semibold text-green tracking-wide uppercase'>UKT {active}</h1>
                                    )
                                }
                            } else {
                                return (
                                    <h1 className='text-xl font-semibold text-green tracking-wide uppercase'>{splitLoc.split('/')[1]    }</h1>
                                )
                            }
                        }
                    })()}
                </div>
            </div>
        </>
    )
}

export default header