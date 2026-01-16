import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { globalState } from '@/context/context'
import { useRouter } from 'next/router'
import Sidebar from '../../components/sidebar'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Modal_CSV from '../../components/modal_csv'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const siswa = () => {

    // deklarasi router
    const router = useRouter()

    // state
    const [showModalCSV, setShowModalCSV] = useState(false);

    const [tipe, setTipe] = useState('')
    const [dataEvent, setDataEvent] = useState([])

    const dataTipe = [
        { name: 'UKT Jambon', tipe: 'ukt_jambon', color: 'bg-purple' },
        { name: 'UKT Hijau', tipe: 'ukt_hijau', color: 'bg-green' },
        { name: 'UKT Putih', tipe: 'ukt_putih', color: 'bg-white' },
        { name: 'UKCW', tipe: 'ukcw' },
    ]

    const getDataEventByTipe = () => {
        const admin = JSON.parse(localStorage.getItem('admin'))
        const token = localStorage.getItem('token')

        if (tipe) {
            if (admin.id_role === "admin ranting" && tipe !== "ukcw") {
                axios.get(BASE_URL + `event/ukt/${tipe}/${admin.id_ranting}`, { headers: { Authorization: `Bearer ${token}` } })
                    .then(res => {
                        setDataEvent(res.data.data)
                    })
                    .catch(err => {
                        console.log(err.message);
                    })
            } else {
                axios.get(BASE_URL + `event/ukt/${tipe}`, { headers: { Authorization: `Bearer ${token}` } })
                    .then(res => {
                        setDataEvent(res.data.data)
                    })
                    .catch(err => {
                        console.log(err.message);
                    })
            }
        }
    }
    const downloadTemplate = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.get(
                BASE_URL + 'siswa/download/template',
                {
                    responseType: 'blob', // IMPORTANT
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Create downloadable link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'template_siswa.xlsx');

            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {
            console.error('Failed to download template:', error);
        }
    };
    useEffect(() => {
        getDataEventByTipe()
    }, [tipe])

    // function go to detail siswa
    const goToRantingSiswa = (item) => {
        router.push({
            pathname: `./siswa/ranting`,
            query: { tipe: item }
        });
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
                            <div className='flex justify-center items-center gap-x-3'>
                                <h1 className='text-2xl tracking-wider uppercase font-bold'>Data Siswa</h1>
                                {tipe && <button
                                    onClick={() => setTipe(null)}
                                    className='p-2 bg-red rounded-md'>Back</button>
                                }
                            </div>

                            {/* search */}
                            <div className='flex flex-row space-x-4'>
                                <button
                                    type='button'
                                    onClick={downloadTemplate}
                                    className="bg-navy text-white hover:bg-indigo-600 rounded-md px-5 py-2 flex items-center gap-x-2 w-auto">
                                    TEMPLATE
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAfElEQVR4nO3OwQ2AIAyF4c5g54I9mMCjLsVgsgDGCwdjqECLMXkv6bX/R4TdF0M2PXERgPAxAMOEcfK5dmQ9BiAB4AHIAPAMAAuh1vsjwK1a8SX5rRmgheiOayCG4yMItXgPQj3egjCLv0GYx2uIaXF6QEyPF8Th9utGnpzRVtZPBHL9hAAAAABJRU5ErkJggg==" alt="download"></img>
                                </button>
                                <button
                                    onClick={() => setShowModalCSV(true)}
                                    className="bg-navy hover:bg-indigo-600 rounded-md px-5 py-2 flex items-center gap-x-2 w-auto">
                                    IMPORT
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC2klEQVR4nGNgGAWjYBSMgmEJODtdpHjbPXy5210bOFtcNnM0OT1jGJSg3p5FcEqwttAkvzjBCb4TBfp9dvP3eL3h7fb8z9Pp8Z+73e0/V6vLf85m5/8D7VQG4TlJvJILI20k54anic0Jmyg2M+SIyPSg78JTA/8LTQ74LzjR779Av+9//l7v/wPuAbmlmYKyqxJtZJcn5MssjVskvST2qtSiqL+SCyL/S8yL+C8+J+y/2KzQ/6Izgv8PSg8orEn+L78q6b/cioT/ssvi/sssif0vtSj6PyUeMDziThY2OOJ2eEh7wPCIO+mxN+qB7lEP/B90HkAGMIfhA6MekEfyQO3pRSiGZ+2fhOIB1dlx/z/+/AqXrzkwd3B5QH5p/P/r7x/BDb/1/sl/idlhcA9MO78RLnf9zcP/Qr2+gy8PhO5qRQmhuJ1dYA8YLEr7/+PPL7i4z6rKwZuJtz44BXfouVe3wR5YcWM/XGzl9f2DMw/IQD1gviYPJbRTdvf+//PvL5gNygNqs+IGfynUf2Ed3JL3P77A2RUHZg3eUkgGyQNKi+L/P/vyBsWyy6/v/xeZFDA0KjLVxYn/n319i+KBR59e/ZeaGjo0PLDoxh64w198fQdnd59aOfiTUMD2xv///v8DW/D998//sTs64BaCMrfpgozB6wGFpfH/b75/Ardg4vn14GJ078PzcLEjjy//F+j1GZwe6L+4Hm74h59f/qstTAR7wG5l4f+//yCxAgJJWzoHXx5w2FT2/ydS+d94cglKW2j97SNwuRdf3v2XmRQyeDwgvzz+/6lXt+AOfP713X+FBbEoHjBZnPn/998/cDUzzm4cfElIaig3p2VGPeA8eCoyiVEPuI96YEh5wOCw2yGGETe4i3N4fUGUscTcsLhBP7xOzgSHwAS/Dv4+n82DdoKDaPCfgZGv102Fp8sjlLvdrY2z1WUbR7Pzc+INGAWjYBSMAoYhAgBEtnuV0kUiSgAAAABJRU5ErkJggg==" alt="ms-excel"></img>
                                </button>
                            </div>
                        </div>
                        {/* PILIH TIPE UKT $$$ */}
                        <div className="grid grid-cols-4 gap-x-5 gap-y-3">

                            {/* card ranting */}
                            {dataTipe.map((item, index) => (
                                <button onClick={() => goToRantingSiswa(item.name)} key={index + 1} className={item.color + " hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5"}>

                                    {/* inner bg */}
                                    <div className="bg-navy p-5 rounded-md space-y-5">

                                        {/* ranting name */}
                                        <h1 className='text-green text-lg'>{item.name}</h1>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* akhir konten utama */}

                    {/* footer */}
                    <Footer />
                    {/* akhir footer */}

                </div>
                {/* akhir wrapper konten utama */}
            </div>
            <globalState.Provider value={{ showModalCSV, setShowModalCSV }}>
                <Modal_CSV />
            </globalState.Provider>
        </>
    )
}

export default siswa