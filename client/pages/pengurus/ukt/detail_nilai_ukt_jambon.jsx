import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import Sidebar from '../components/sidebar'
import Header from '../components/header'
import Footer from '../components/footer'


// ---- content --- //
import Senam from './content/senam'
import Teknik from './content/teknik'
import Jurus from './content/jurus'
import Fisik from './content/fisik'
import Sambung from './content/sambung'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const detail_nilai_ukt_jambon = () => {

    // state set jenis
    const [active, setActive] = useState('senam')
    // function set jneis
    const onActive = (e) => {
        setActive(e)
    }

    let activeComponent;
    const data = {tipe_ukt: 'UKT Jambon'}
    if (active === 'senam') {
        activeComponent = <Senam data={data}/>;
    } else if (active === 'jurus'){
        activeComponent = <Jurus data={data}/>;
    } else if (active === 'fisik'){
        activeComponent = <Fisik data={data}/>;
    } else if (active === 'teknik'){
        activeComponent = <Teknik data={data}/>;
    } else if (active === 'sambung'){
        activeComponent = <Sambung data={data}/>;
    }
    


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
                        <div className="flex bg-navy gap-x-2 overflow-x-scroll text-purple mb-3 scrollbar-hide">
                            <button onClick={() => onActive('senam')} className={active === 'senam' ? "bg-purple text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md" : "bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md"}>Senam</button>
                            <button onClick={() => onActive('jurus')} className={active === 'jurus' ? "bg-purple text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md" : "bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md"}>Jurus</button>
                            <button onClick={() => onActive('fisik')} className={active === 'fisik' ? "bg-purple text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md" : "bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md"}>Fisik</button>
                            <button onClick={() => onActive('teknik')} className={active === 'teknik' ? "bg-purple text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md" : "bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md"}>Teknik</button>
                            <button onClick={() => onActive('sambung')} className={active === 'sambung' ? "bg-purple text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md" : "bg-white hover:bg-purple hover:text-white transition ease-in-out duration-300 py-1.5 px-4 rounded-md"}>Sambung</button>
                        </div>
                    { activeComponent }
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

export default detail_nilai_ukt_jambon
