import React, { Suspense, useEffect, useState } from 'react'
import Sidebar from '../../components/sidebar'
import Header from '../../components/header'
import Footer from '../../components/footer'
import { useRouter } from 'next/router'
import DropdownRantingDetail from '../../components/dropdownRantingDetail'

const Senam = React.lazy(() => import('../content/senam'))
const Teknik = React.lazy(() => import('../content/teknik'))
const Jurus = React.lazy(() => import('../content/jurus'))
const Fisik = React.lazy(() => import('../content/fisik'))
const Sambung = React.lazy(() => import('../content/sambung'))
const Keshan = React.lazy(() => import('../content/keshan'))

const SenamToya = React.lazy(() => import('../content/senamToya'))
const JurusToya = React.lazy(() => import('../content/jurusToya'))
const Kripen = React.lazy(() => import('../content/kripen'))
const Belati = React.lazy(() => import('../content/belati'))

const detail_nilai_ukt_ukcw = () => {


    const router = useRouter()
    const { idRanting } = router.query
    const { eventId } = router.query

    // state set jenis
    const [dataEvent, setDataEvent] = useState([])
    const [dataAdmin, setDataAdmin] = useState()
    const [active, setActive] = useState('keshan')
    const [ranting, setRanting] = useState('TRENGGALEK')
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
        console.log(role)
        setDataEvent(event)
        setDataAdmin(role)

        if (role?.id_role === 'admin ranting') {
            setRanting(role.id_ranting)
        }

        setMounted(true)
    }, [router.isReady])

    let activeComponent;
    const data = { tipe_ukt: 'UKCW', ranting: ranting }
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
    } else if (active === 'senamToya') {
        activeComponent = <SenamToya data={data} />;
    } else if (active === 'jurusToya') {
        activeComponent = <JurusToya data={data} />;
    } else if (active === 'kripen') {
        activeComponent = <Kripen data={data} />;
    } else if (active === 'belati') {
        activeComponent = <Belati data={data} />;
    }
    useEffect(() => {
        const role = JSON.parse(localStorage.getItem('admin'))
        if (role?.id_role === 'admin ranting') {
            setRanting(role.id_ranting)
        } else if (idRanting) {
            setRanting(idRanting)
        } else if (!ranting) {
            setRanting('TRENGGALEK') // default for super admin
        }
    }, [idRanting, eventId]) // ← single effect, runs once on mount

    if (!mounted) return null
    return (
        <>
            <div className="flex font-lato">

                {/* sidebar */}
                <Sidebar />
                {/* akhir sidebar */}

                {/* awal wrapper konten utama */}
                {/* supaya konten header dapat di scroll dan tidak mempengaruhi sidebar */}
                <div className="w-full overflow-y-auto h-screen lg:overflow-y-hidden">

                    {/* overlap untuk device sm */}
                    {/* <div className="absolute hidden lg:hidden inset-0 bg-slate-400 opacity-50 z-10">
                    </div> */}

                    {/* header */}
                    <Header />
                    {/* akhir header */}

                    {/* konten utama */}
                    <div className="min-h-full bg-darkBlue px-10 py-8 w-full ">

                        <div className="flex justify-start items-center gap-x-3 pb-5">
                            <button onClick={() => router.back()} className="bg-purple hover:bg-white rounded-md w-9 h-9 flex justify-center items-center group duration-300">
                                <svg className='-translate-x-0.5 fill-white group-hover:fill-purple' width="13" height="22" viewBox="0 0 14 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.2258 26.4657L0.354838 14.4974C0.225806 14.3549 0.134623 14.2005 0.08129 14.0343C0.0270964 13.8681 0 13.69 0 13.5C0 13.31 0.0270964 13.1319 0.08129 12.9657C0.134623 12.7995 0.225806 12.6451 0.354838 12.5026L11.2258 0.498681C11.5269 0.166227 11.9032 0 12.3548 0C12.8065 0 13.1935 0.1781 13.5161 0.534301C13.8387 0.890501 14 1.30607 14 1.781C14 2.25594 13.8387 2.6715 13.5161 3.0277L4.03226 13.5L13.5161 23.9723C13.8172 24.3048 13.9677 24.7141 13.9677 25.2005C13.9677 25.6878 13.8065 26.1095 13.4839 26.4657C13.1613 26.8219 12.7849 27 12.3548 27C11.9247 27 11.5484 26.8219 11.2258 26.4657Z" />
                                </svg>
                            </button>
                            <h1 className='text-2xl tracking-wider text-white font-lato font-bold uppercase'>Detail Nilai - {dataEvent.name} {ranting}</h1>
                            {dataAdmin.id_role !== 'admin ranting' && <div className='ml-auto'>
                                <DropdownRantingDetail ranting={ranting} setRanting={setRanting} eventId={eventId} />
                            </div>}
                        </div>

                        {/* wrapper category */}
                        <div className="flex bg-navy gap-x-1.5 overflow-x-auto text-purple mb-3 scrollbar-hide w-full py-1 px-2 rounded-md">
                            {[
                                { key: 'keshan', label: 'Keshan' },
                                { key: 'senam', label: 'Senam' },
                                { key: 'jurus', label: 'Jurus' },
                                { key: 'fisik', label: 'Fisik' },
                                { key: 'teknik', label: 'Teknik' },
                                { key: 'sambung', label: 'Sambung' },
                                { key: 'senamToya', label: 'Senam Toya' },
                                { key: 'jurusToya', label: 'Jurus Toya' },
                                { key: 'kripen', label: 'Kripen' },
                                { key: 'belati', label: 'Belati' },
                            ].map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => onActive(key)}
                                    className={`
                whitespace-nowrap flex-shrink-0 xl:flex-shrink
                py-1.5 px-2 sm:px-3 lg:px-4
                text-[10px] sm:text-xs lg:text-sm xl:text-base
                rounded-md uppercase transition ease-in-out duration-300 w-full
                ${active === key
                                            ? 'bg-purple text-white'
                                            : 'bg-white hover:bg-purple hover:text-white'}
            `}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        {/* AFTER — stays mounted, just hidden */}
                        <Suspense fallback={<div className="text-white py-4">Loading...</div>}>
                            {active === 'keshan' && <Keshan data={data} />}
                            {active === 'senam' && <Senam data={data} />}
                            {active === 'jurus' && <Jurus data={data} />}
                            {active === 'fisik' && <Fisik data={data} />}
                            {active === 'teknik' && <Teknik data={data} />}
                            {active === 'sambung' && <Sambung data={data} />}
                            {active === 'senamToya' && <SenamToya data={data} />}
                            {active === 'jurusToya' && <JurusToya data={data} />}
                            {active === 'kripen' && <Kripen data={data} />}
                            {active === 'belati' && <Belati data={data} />}
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
const kecamatanList = [
    'Bendungan', 'Dongko', 'Durenan', 'Gandusari', 'Kampak', 'Karangan',
    'Munjungan', 'Panggul', 'Pogalan', 'Pule', 'Suruh', 'Trenggalek', 'Tugu', 'Watulimo'
];
export default detail_nilai_ukt_ukcw