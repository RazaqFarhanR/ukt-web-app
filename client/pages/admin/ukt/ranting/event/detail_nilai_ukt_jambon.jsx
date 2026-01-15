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

const detail_nilai_ukt_jambon = () => {

    // deklarasi router
    const router = useRouter()
    const { eventId, idRanting, nameEvent } = router.query;
    // state set jenis
    const [active, setActive] = useState('keshan')
    const [ranting, setRanting] = useState('')
    const [role, setRole] = useState('')
    // function set jneis
    const onActive = (e) => {
        setActive(e)
    }

    let activeComponent;
    const data = { tipe_ukt: "UKT HIJAU", ranting: idRanting}
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
    }, [idRanting])
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
export default detail_nilai_ukt_jambon
