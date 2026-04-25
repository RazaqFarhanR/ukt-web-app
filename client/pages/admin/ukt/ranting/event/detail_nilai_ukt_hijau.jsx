import React, { Suspense, useEffect, useState } from 'react'
import Sidebar from '../../../components/sidebar'
import Header from '../../../components/header'
import Footer from '../../../components/footer'

// ---- content --- //
const Senam = React.lazy(() => import('../../content/senam'))
const Teknik = React.lazy(() => import('../../content/teknik'))
const Jurus = React.lazy(() => import('../../content/jurus'))
const Fisik = React.lazy(() => import('../../content/fisik'))
const Sambung = React.lazy(() => import('../../content/sambung'))
const Keshan = React.lazy(() => import('../../content/keshan'))


import { useRouter } from 'next/router'
import DropdownRantingDetail from '@/pages/admin/components/dropdownRantingDetail'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const detail_nilai_ukt_hijau = () => {

    // deklarasi router
    const router = useRouter()
    const { eventId, idRanting, nameEvent } = router.query;
    // state set jenis
    const [dataEvent, setDataEvent] = useState([])
    const [dataAdmin, setDataAdmin] = useState()
    const [active, setActive] = useState('keshan')
    const [ranting, setRanting] = useState(idRanting || '')
    const [role, setRole] = useState('')
    const [mounted, setMounted] = useState(false)  // ← guards localStorage

    // function set jneis
    const onActive = (e) => {
        setActive(e)
    }
    useEffect(() => {
        // All localStorage reads happen here — safe, client-only
        const token = localStorage.getItem('token')
        const admin = localStorage.getItem('admin')

        if (!token || !admin) {
            router.push('/admin/login')
            return
        }

        const event = JSON.parse(localStorage.getItem('event'))
        const role = JSON.parse(admin)

        setDataEvent(event)
        setDataAdmin(role)

        if (role?.id_role === 'admin ranting') {
            setRanting(role.id_ranting)
        }

        setMounted(true)  // ← only render content after localStorage is ready
    }, [])

    let activeComponent;
    const data = { tipe_ukt: "UKT HIJAU", ranting: ranting }
    if (active === 'senam') {
        activeComponent = <Senam data={data} />;
    } else if (active === 'jurus') {
        activeComponent = <Jurus data={data} />;
    } else if (active === 'fisik') {
        activeComponent = <Fisik data={data} />;
    } else if (active === 'teknik') {
        activeComponent = <Teknik data={data} />;
    } else if (active === 'sambung') {
        activeComponent = <Sambung data={data} />;
    } else if (active === 'keshan') {
        activeComponent = <Keshan data={data} />;
    }


    useEffect(() => {
        const role = JSON.parse(localStorage.getItem('admin'))
        if (role.id_role === 'admin ranting') {
            setRanting(role.id_ranting)
            setRole('admin ranting')
        } else if (idRanting) {
            setRanting(idRanting)
        }
    }, [idRanting])

    if (!mounted) return null
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
                    <div className="min-h-full bg-darkBlue px-10 py-8">

                        {/* wrapper category */}
                        <div className="flex justify-between items-center mb-5">
                            <h1 className='text-2xl tracking-wider text-white font-lato font-bold uppercase'>Detail Nilai - {nameEvent} {ranting}</h1>
                            {dataAdmin.id_role !== 'admin ranting' && <div className='ml-auto'>
                                <DropdownRantingDetail ranting={ranting} setRanting={setRanting} eventId={eventId} />
                            </div>}
                        </div>

                        <div className="flex bg-navy gap-x-2 overflow-x-scroll text-purple mb-3 scrollbar-hide w-full text-2xl">
                            <button onClick={() => onActive('keshan')} className={active === 'keshan' ? "bg-purple text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full" : "bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full"}>KESHAN</button>
                            <button onClick={() => onActive('senam')} className={active === 'senam' ? "bg-purple text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full" : "bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full"}>Senam</button>
                            <button onClick={() => onActive('jurus')} className={active === 'jurus' ? "bg-purple text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full" : "bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full"}>Jurus</button>
                            <button onClick={() => onActive('fisik')} className={active === 'fisik' ? "bg-purple text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full" : "bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full"}>Fisik</button>
                            <button onClick={() => onActive('teknik')} className={active === 'teknik' ? "bg-purple text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full" : "bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full"}>Teknik</button>
                            <button onClick={() => onActive('sambung')} className={active === 'sambung' ? "bg-purple text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full" : "bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full"}>Sambung</button>
                        </div>
                        {/* AFTER — stays mounted, just hidden */}
                        <Suspense fallback={<div className="text-white py-4">Loading...</div>}>
                            {active === 'keshan' && <Keshan data={data} />}
                            {active === 'senam' && <Senam data={data} />}
                            {active === 'jurus' && <Jurus data={data} />}
                            {active === 'fisik' && <Fisik data={data} />}
                            {active === 'teknik' && <Teknik data={data} />}
                            {active === 'sambung' && <Sambung data={data} />}
                        </Suspense>
                    </div>
                    {/* akhir konten utama */}

                    {/* footer */}
                    <Footer />
                    {/* akhir footer */}

                </div>
                {/* akhir wrapper konten utama */}
            </div>
        </>
    )
}
export default detail_nilai_ukt_hijau