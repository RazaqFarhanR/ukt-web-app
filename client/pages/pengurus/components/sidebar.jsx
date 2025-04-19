import React, { useContext, useEffect, useState } from 'react'
import { globalState } from '@/context/context'
import { useRouter } from 'next/router'
import Link from 'next/link'
const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

const sidebar = () => {

    // state role
    const [role, setRole] = useState ([])
    const [dataPengurus, setDataPegurus] = useState([])

    const getRole = () => {
        const role = JSON.parse(localStorage.getItem ('pengurus'))
        setDataPegurus(role)
        setRole (role)
    }

    // deklarasi router
    const router = useRouter()

    // state router
    const location = useRouter()
    const { pathname } = location
    const splitLoc = pathname.split('/pengurus/')

    // state sidebar
    const {showSideBar, setShowSideBar} = useContext (globalState)

    useEffect (() => {
        getRole ()
    }, [])

    return (
        <aside className="absolute z-20 lg:relative transition-all font-lato">
            
            {/* wrapper */}
            <div className={`${showSideBar ? 'w-60 py-8 px-5' : 'w-20 py-6 px-4 text-center'} h-screen overflow-y-auto shadow-md drop-shadow-md bg-navy transition-all duration-300 scrollbar-hide`}>

                {/* awal content */}
                <div className='flex flex-col items-center'>

                    {/* photo profile */}
                    <div className={`${showSideBar ? 'block' : 'hidden'} h-fit rounded-full bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] p-0.5 mb-3`}>
                        <img className='object-cover rounded-full w-28' src={IMAGE_URL + dataPengurus.foto} alt="" />
                    </div>

                    {/* username and name */}
                    <div className={`${showSideBar ? 'block' : 'hidden'} text-center mb-5`}>
                        <h1 className='text-white text-xl font-medium tracking-wider'>{dataPengurus.username}</h1>
                        <span className='text-green text-sm'>{dataPengurus.username}</span>
                    </div>

                    {/* wrapper navigation button */}
                    <div className="space-y-4 w-full">

                        {/* ---------- DASHBOARD ---------- */}
                        <Link href={'/pengurus/'} className={splitLoc[1] === '' ? 
                        
                        // clicked
                        `${showSideBar ? 'px-5 py-4 gap-x-3' : 'justify-center p-2'} bg-white shadow-md shadow-purple rounded-lg flex items-center text-purple` 
                        : 
                        
                        // not clicked
                        `${showSideBar ? 'px-5 py-4 gap-x-3' : 'justify-center p-2'} flex items-center text-white`}>        
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.125 6.37484L8.5 1.4165L14.875 6.37484V14.1665C14.875 14.5422 14.7257 14.9026 14.4601 15.1682C14.1944 15.4339 13.8341 15.5832 13.4583 15.5832H3.54167C3.16594 15.5832 2.80561 15.4339 2.53993 15.1682C2.27426 14.9026 2.125 14.5422 2.125 14.1665V6.37484Z" stroke="#6464F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M6.375 15.5833V8.5H10.625V15.5833" stroke="#6464F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <h1 className={`${showSideBar ? 'block' : 'hidden'} translate-y-[1px]`}>Dashboard</h1>
                        </Link>

                        {/* navigation button data */}
                        <div className={`${showSideBar ? '' : 'space-y-3'}`}>
                            <h1 className='text-gray mb-2'>Data</h1>
                                                
                            {/* ---------- SISWA ---------- */}
                            <Link href={dataPengurus.id_role == 'pengurus cabang' ? '/pengurus/data/siswa' : `/pengurus/data/${dataPengurus.id_ranting}`} className={splitLoc[1] === 'data/siswa' || splitLoc[1] === 'data/detail_siswa' ?
                            
                            // clicked
                            `${showSideBar ? 'px-5 py-2 gap-x-3' : 'justify-center p-2'} bg-white shadow-md shadow-purple rounded-lg flex items-center text-purple` 
                            : 
                            
                            // not clicked
                            `${showSideBar ? 'px-5 py-2 gap-x-3' : 'justify-center p-2'} flex items-center text-white`}>            
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.5503 2.64594L8.70472 0.0307256C8.57159 -0.0102419 8.42922 -0.0102419 8.29609 0.0307256L0.458636 2.64594H0.442291L0.360566 2.6868H0.352393L0.270668 2.73583C0.270668 2.74401 0.262496 2.74401 0.254323 2.75218L0.188943 2.80939L0.131735 2.87477C0.131735 2.88294 0.123563 2.88294 0.123563 2.89111L0.0745273 2.96466C0.0745273 2.97284 0.0745273 2.97284 0.0663548 2.98101L0.0336647 3.05456L0.00914718 3.14446V3.16898C0.00108611 3.201 -0.00167465 3.23413 0.000974615 3.26705V9.80507C0.000974615 9.97847 0.0698571 10.1448 0.192469 10.2674C0.315081 10.39 0.481378 10.4589 0.654777 10.4589C0.828176 10.4589 0.994473 10.39 1.11708 10.2674C1.2397 10.1448 1.30858 9.97847 1.30858 9.80507V4.1742L4.05455 5.08952C3.53867 5.91527 3.26669 6.87002 3.26999 7.84366C3.27029 8.72916 3.4954 9.60009 3.92422 10.3748C4.35304 11.1496 4.97154 11.8028 5.72175 12.2732C4.16275 12.8629 2.83182 13.9334 1.92152 15.3297C1.82873 15.4764 1.7973 15.6537 1.83399 15.8234C1.87067 15.9931 1.97255 16.1416 2.11766 16.2369C2.18887 16.284 2.26874 16.3166 2.35264 16.3327C2.43653 16.3488 2.52279 16.3481 2.6064 16.3306C2.69002 16.3131 2.76934 16.2792 2.83976 16.2309C2.91017 16.1825 2.9703 16.1206 3.01664 16.0489C3.61007 15.1348 4.42259 14.3835 5.38031 13.8634C6.33803 13.3434 7.41058 13.0709 8.50041 13.0709C9.59023 13.0709 10.6628 13.3434 11.6205 13.8634C12.5782 14.3835 13.3907 15.1348 13.9842 16.0489C14.0439 16.1395 14.1252 16.2139 14.2208 16.2652C14.3163 16.3166 14.4232 16.3433 14.5317 16.3431C14.657 16.3444 14.7796 16.3073 14.8832 16.2369C15.0283 16.1416 15.1301 15.9931 15.1668 15.8234C15.2035 15.6537 15.1721 15.4764 15.0793 15.3297C14.169 13.9334 12.8381 12.8629 11.2791 12.2732C12.0293 11.8028 12.6478 11.1496 13.0766 10.3748C13.5054 9.60009 13.7305 8.72916 13.7308 7.84366C13.7341 6.87002 13.4621 5.91527 12.9463 5.08952L16.5503 3.88816C16.6812 3.84517 16.795 3.76197 16.8758 3.65044C16.9565 3.53891 17 3.40474 17 3.26705C17 3.12936 16.9565 2.99518 16.8758 2.88365C16.795 2.77212 16.6812 2.68893 16.5503 2.64594ZM12.4232 7.84366C12.4232 8.88406 12.0099 9.88184 11.2743 10.6175C10.5386 11.3532 9.5408 11.7665 8.50041 11.7665C7.46001 11.7665 6.46223 11.3532 5.72656 10.6175C4.99089 9.88184 4.57759 8.88406 4.57759 7.84366C4.57917 7.00658 4.84518 6.19139 5.33764 5.51449L8.29609 6.50337C8.4288 6.54703 8.57201 6.54703 8.70472 6.50337L11.6632 5.51449C12.1556 6.19139 12.4216 7.00658 12.4232 7.84366ZM11.6632 4.14151H11.655L8.50041 5.19576L5.34581 4.14151H5.33764L2.72243 3.26705L8.50041 1.33833L14.2784 3.26705L11.6632 4.14151Z" fill={splitLoc[1] === 'data/siswa' || splitLoc[1] === 'data/detail_siswa' ? '#6464F6' : "white"}/>
                                </svg>
                                <h1 className={`${showSideBar ? 'block' : 'hidden'} translate-y-[1px]`}>Siswa</h1>
                            </Link>

                        </div>

                        {/* navigation button UKT */}
                        <div className={`${showSideBar ? '' : 'space-y-3'}`}>
                            <h1 className='text-gray mb-2'>UKT</h1>

                            {/* ---------- UKT JAMBON ---------- */}
                            <Link href={'/pengurus/ukt/ukt_jambon'} className={splitLoc[1] === 'ukt_jambon' ? 
                            `${showSideBar ? 'px-5 py-2 gap-x-3' : 'justify-center p-2'} bg-white shadow-md shadow-purple rounded-lg flex items-center text-purple` 
                            :
                            `${showSideBar ? 'px-5 py-2 gap-x-3' : 'justify-center p-2'} flex items-center text-white`}>
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="17" height="17" rx="3" fill="#FF32DE"/>
                                </svg>
                                <h1 className={`${showSideBar ? 'block' : 'hidden'} translate-y-[1px]`}>UKT Jambon</h1>
                            </Link>

                            {/* ---------- UKT HIJAU ---------- */}
                            <Link href={'/pengurus/ukt/ukt_hijau'} className={splitLoc[1] === 'ukt_hijau' ? 
                            `${showSideBar ? 'px-5 py-2 gap-x-3' : 'justify-center p-2'} bg-white shadow-md shadow-purple rounded-lg flex items-center text-purple` 
                            :
                            `${showSideBar ? 'px-5 py-2 gap-x-3' : 'justify-center p-2'} flex items-center text-white`}>
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="17" height="17" rx="3" fill="#0B8800"/>
                                </svg>
                                <h1 className={`${showSideBar ? 'block' : 'hidden'} translate-y-[1px]`}>UKT Hijau</h1>
                            </Link>

                            {/* ---------- UKT PUTIH ---------- */}
                            <Link href={'/pengurus/ukt/ukt_putih'} className={splitLoc[1] === 'ukt_putih' ? 
                            `${showSideBar ? 'px-5 py-2 gap-x-3' : 'justify-center p-2'} bg-white shadow-md shadow-purple rounded-lg flex items-center text-purple` 
                            :
                            `${showSideBar ? 'px-5 py-2 gap-x-3' : 'justify-center p-2'} flex items-center text-white`}>
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="17" height="17" rx="3" fill="#FFFFFF"/>
                                </svg>
                                <h1 className={`${showSideBar ? 'block' : 'hidden'} translate-y-[1px]`}>UKT Putih</h1>
                            </Link>

                            {/* ---------- UKCW ---------- */}
                            <Link href={'/pengurus/ukt/ukcw'} className={splitLoc[1] === 'ukcw' ? 
                            `${showSideBar ? 'px-5 py-2 gap-x-3' : 'justify-center p-2'} bg-white shadow-md shadow-purple rounded-lg flex items-center text-purple` 
                            :
                            `${showSideBar ? 'px-5 py-2 gap-x-3' : 'justify-center p-2'} flex items-center text-white`}>
                                
                                <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.5 0L0 4.63636L3.09091 6.32091V10.9573L8.5 13.9091L13.9091 10.9573V6.32091L15.4545 5.47864V10.8182H17V4.63636L8.5 0ZM13.77 4.63636L8.5 7.51091L3.23 4.63636L8.5 1.76182L13.77 4.63636ZM12.3636 10.0455L8.5 12.1473L4.63636 10.0455V7.16318L8.5 9.27273L12.3636 7.16318V10.0455Z" fill={splitLoc[1] === 'ukcw' ? '#6464F6' : "white"}/>
                                </svg>

                                <h1 className={`${showSideBar ? 'block' : 'hidden'} translate-y-[1px]`}>UKCW</h1>
                            </Link>
                        </div>
                    </div>

                </div>
                {/* akhir content */}

            </div>
        </aside>
    )
}

export default sidebar