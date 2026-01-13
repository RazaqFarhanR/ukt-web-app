import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import Sidebar from '../../../components/sidebar'
import Header from '../../../components/header'
import Footer from '../../../components/footer'

// ---- content --- //
import Senam from '../../content/senam'
import Teknik from '../../content/teknik'
import Jurus from '../../content/jurus'
import Fisik from '../../content/fisik'
import Sambung from '../../content/sambung'
import Keshan from '../../content/keshan'
import { useRouter } from 'next/router'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const detail_nilai_ukt_putih = () => {

    // deklarasi router
    const router = useRouter()

    // state set jenis
    const [active, setActive] = useState('keshan')
    const [ranting, setRanting] = useState('')
    const [role, setRole] = useState('')
    const { eventId, idRanting, nameEvent } = router.query;

    // function set jneis
    const onActive = (e) => {
        setActive(e)
    }

    let activeComponent;
    const data = { tipe_ukt: "UKT PUTIH", ranting: idRanting }
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

    // function login checker
    const isLogged = () => {
        if (localStorage.getItem('token') === null || localStorage.getItem('admin') === null) {
            router.push('/admin/login')
        }
    }

    useEffect(() => {
        isLogged()
    }, [])
    useEffect(() => {
        const role = JSON.parse(localStorage.getItem('admin'))
        if (role.id_role === 'admin ranting') {
            setRanting(role.id_ranting)
            setRole('admin ranting')
        }
    }, [])

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
                            <h1 className='text-2xl tracking-wider text-white font-lato font-bold uppercase'>Detail Nilai - {nameEvent} - {ranting}</h1>
                            <div className='ml-auto'>
                                {role == 'admin ranting' ? <></> : <FilterDropdown ranting={ranting} setRanting={setRanting} />}
                            </div>
                        </div>

                        {/* wrapper category */}
                        <div className="flex bg-navy gap-x-2 overflow-x-scroll text-purple mb-3 scrollbar-hide w-full text-2xl">
                            <button onClick={() => onActive('keshan')} className={active === 'keshan' ? "bg-purple text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full" : "bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full"}>KESHAN</button>
                            <button onClick={() => onActive('senam')} className={active === 'senam' ? "bg-purple text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full" : "bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full"}>Senam</button>
                            <button onClick={() => onActive('jurus')} className={active === 'jurus' ? "bg-purple text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full" : "bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full"}>Jurus</button>
                            <button onClick={() => onActive('fisik')} className={active === 'fisik' ? "bg-purple text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full" : "bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full"}>Fisik</button>
                            <button onClick={() => onActive('teknik')} className={active === 'teknik' ? "bg-purple text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full" : "bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full"}>Teknik</button>
                            <button onClick={() => onActive('sambung')} className={active === 'sambung' ? "bg-purple text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full" : "bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md uppercase w-full"}>Sambung</button>
                        </div>
                        {activeComponent}
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
function FilterDropdown({ ranting, setRanting }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <button
                className="bg-purple w-64 h-12 text-white rounded"
                onClick={() => setIsOpen(!isOpen)}
            >
                Pilih Ranting
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-64 bg-navy border border-purple text-white rounded shadow-lg max-h-auto overflow-y-auto">
                    {kecamatanList.map((name) => (
                        <div
                            key={name}
                            className="px-4 py-2 hover:bg-purple-100 cursor-pointer border-purple border"
                            onClick={() => {
                                setRanting(name)
                                setIsOpen(false);
                            }}
                        >
                            {name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default detail_nilai_ukt_putih