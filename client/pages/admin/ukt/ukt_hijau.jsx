import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'
import { globalState } from '@/context/context'
import Sidebar from '../components/sidebar'
import Header from '../components/header'
import Footer from '../components/footer'
import Modal_event from '../components/modal_event'
import Modal_delete from '../components/modal_delete'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ukt_hijau = () => {

    // deklarasi router
    const router = useRouter()

    // state modal
    const [showModalEvent, setShowModalEvent] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)

    // state
    const [dataUser, setDataUser] = useState({})
    const [dataEvent, setDataEvent] = useState([])
    const [dataRanting, setDataRanting] = useState([])
    const [isActive, setIsActive] = useState(false)
    const [action, setAction] = useState('')
    const [idEvent, setIdEvent] = useState('')
    const [name, setName] = useState('')
    const [date, setDate] = useState()
    const [tipe, setTipe] = useState('')

    // function get data ranting
    const getDataRanting = async () => {
        const user = localStorage.getItem('admin')
        const dataUser = JSON.parse(user)
        setDataUser(dataUser)
        const token = localStorage.getItem('token')

        axios.get(BASE_URL + `ranting`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setDataRanting(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    // function get data event
    const getDataEvent = () => {
        const token = localStorage.getItem('token')

        axios.get(BASE_URL + `event/ukt/UKT Hijau`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setDataEvent(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    // function to detail nilai
    const goToEventRanting = (item) => {
        // localStorage.setItem('event', JSON.stringify(item))
        router.push({
            pathname: './ranting',
            query: { ranting: item, ukt: 'UKT Hijau', tipe: 'ukt_hijau' } // Add your parameter here
        });
    }

    // function login checker
    const isLogged = () => {
        if (localStorage.getItem('token') === null || localStorage.getItem('admin') === null) {
            router.push('/admin/login')
        }
    }

    useEffect(() => {
        
        getDataEvent()
        getDataRanting()
        isLogged()
    }, [])

    return (
        <>
            <div className="flex font-lato">

                {/* sidebar */}
                <Sidebar />
                {/* akhir sidebar */}

                {/* awal wrapper konten utama */}
                {/* supaya konten header dapat di scroll dan tidak mempengaruhi sidebar */}
                <div className="w-full overflow-y-auto h-screen">

                    {/* overlap untuk device sm */}
                    {/* <div className="absolute hidden lg:hidden inset-0 bg-slate-400 opacity-50 z-10">
    </div> */}

                    {/* header */}
                    <Header />
                    {/* akhir header */}

                    {/* konten utama */}
                    <div className="min-h-full bg-darkBlue p-6">

                        {/* wrapper page name and search */}
                        <div className="flex justify-between items-center text-white mb-7">

                            {/* page name */}
                            <h1 className='text-2xl tracking-wider uppercase font-bold'>Data Ukt Hijau</h1>
                        </div>
                        {/* ranting data count wrapper */}
                        <div className="grid grid-cols-4 gap-x-5 gap-y-3">

                            {/* card ranting */}
                            {dataUser.id_role === 'admin ranting'
                                ? <><button 
                                        onClick={() => goToEventRanting(dataUser.id_ranting)} key={1} 
                                        className="bg-navy hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5">
    
                                            {/* inner bg */}
                                            <div className="bg-navy p-5 rounded-md space-y-5">
    
                                                {/* ranting name */}
                                                <h1 className='text-green text-lg'>Ranting {dataUser.id_ranting}</h1>
    
                                                {/* ranting data count and add button */}
                                                <h1 className='text-white text-3xl font-semibold tracking-wider'>{dataEvent.filter(a => a.id_ranting === `${dataUser.id_ranting}`).length}</h1>
                                            </div>
                                        </button>
                                    </>
                                : dataRanting?.map((item, index) => (
                                    <><button 
                                        onClick={() => goToEventRanting(item.id_ranting)} key={index + 1} 
                                        className="bg-navy hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5">
    
                                            {/* inner bg */}
                                            <div className="bg-navy p-5 rounded-md space-y-5">
    
                                                {/* ranting name */}
                                                <h1 className='text-green text-lg'>Ranting {item.id_ranting}</h1>
    
                                                {/* ranting data count and add button */}
                                                <h1 className='text-white text-3xl font-semibold tracking-wider'>{dataEvent.filter(a => a.id_ranting === `${item.id_ranting}`).length}</h1>
                                            </div>
                                        </button>
                                    </>
                                ))
                            }
                        </div>
                    </div>
                    {/* akhir konten utama */}

                    {/* footer */}
                    <Footer />
                    {/* akhir footer */}

                </div>
                {/* akhir wrapper konten utama */}
            </div>

            {/* memanggil modal */}
            <globalState.Provider value={{ showModalEvent, setShowModalEvent, setDataEvent, action, idEvent, name, setName, date, setDate, tipe, setTipe, isActive, setIsActive }}>
                <Modal_event />
            </globalState.Provider>

            <globalState.Provider value={{ showModalDelete, setShowModalDelete, setDataEvent, action, idEvent, tipe, setTipe }}>
                <Modal_delete />
            </globalState.Provider>
        </>
    )
}

export default ukt_hijau