import React, { useEffect, useState, Component, Fragment } from 'react'
import Sidebar from './components/sidebar'
import Header from './components/header'
import Footer from './components/footer'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import axios from 'axios'
import EditorQuill from './components/editor_quill'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


const index = () => {
    const [data, setData] = useState([])
    const [dataTable, setDataTable] = useState([])
    const [dataCabang, setDataCabang] = useState([]);
    const [dataRanting, setDataRanting] = useState([]);
    const [ranting, setRanting] = useState();
    const [cabang, setCabang] = useState();
    const [event, setEvent] = useState();
    const [tipeUkt, setTipeUkt] = useState(null);
    const [dataEvent, setDataEvent] = useState();
    const [search, setSearch] = useState();

    const [go, setGo] = useState(false);
    const [type, setType] = useState('cabang');

    // const handlerGetData = () => {
    //     const token = localStorage.getItem('token')
    //     const admin = JSON.parse(localStorage.getItem('admin'))
    //     admin.id_role === 'admin ranting'
    //         ? axios.get(BASE_URL + 'ukt_siswa/statistic/ranting/' + admin.id_ranting, { headers: { Authorization: `Bearer ${token}` } })
    //             .then(result => {
    //                 setData(result.data.data.series)
    //                 setDataTable(result.data.tables.series)
    //             })
    //             .catch(error => {
    //                 console.log(error.message);
    //             })
    //         : axios.get(BASE_URL + 'ukt_siswa/statistic/cabang/jatim', { headers: { Authorization: `Bearer ${token}` } })
    //             .then(result => {
    //                 setData(result.data.data.series)
    //                 setDataTable(result.data.tables.series)
    //             })
    //             .catch(error => {
    //                 console.log(error.message);
    //             })

    // }
    const handlerClick = () => {
        const token = localStorage.getItem('token')
        type !== 'cabang'
            ? axios.get(BASE_URL + 'ukt_siswa/statistic/event/' + event + '/' + ranting, { headers: { Authorization: `Bearer ${token}` } })
                .then(result => {
                    console.log(result.data.tables.series)
                    setData(result.data.data.series)
                    setDataTable(result.data.tables.series)
                })
                .catch(error => {
                    console.log(error.message);
                })
            : axios.get(BASE_URL + 'ukt_siswa/statistic/event/' + event, { headers: { Authorization: `Bearer ${token}` } })
                .then(result => {
                    console.log(result.data.tables.series)
                    setData(result.data.data.series)
                    setDataTable(result.data.tables.series)
                })
                .catch(error => {
                    console.log(error.message);
                })
    }
    const handlerGetEvent = () => {
        const token = localStorage.getItem('token')
        console.log(tipeUkt)

        axios.get(BASE_URL + 'event/search/' + tipeUkt, { headers: { Authorization: `Bearer ${token}` } })
            .then(result => {
                console.log(result)
                setDataEvent(result.data.data)
            })
            .catch(error => {
                console.log(error.message);
            })
    }

    useEffect(() => {
        handlerGetEvent()
    }, [tipeUkt])

    useEffect(() => {
        if (cabang && type === 'cabang') {
            handlerClick(cabang, 'cabang');
        } else if (ranting && type === 'ranting') {
            handlerClick(ranting, 'ranting');
        }
    }, [cabang])


    const handlerGetDataCabang = () => {
        const token = localStorage.getItem('token')
        axios.get(BASE_URL + 'cabang', { headers: { Authorization: `Bearer ${token}` } })
            .then(result => {
                setDataCabang(result.data.data)
            })
            .catch(error => {
                console.log(error.message);
            })
    }
    const handlerGetDataRanting = () => {
        const token = localStorage.getItem('token')

        axios.get(BASE_URL + 'ranting', { headers: { Authorization: `Bearer ${token}` } })
            .then(result => {
                setDataRanting(result.data.data)
            })
            .catch(error => {
                console.log(error.message);
            })
    }
    useEffect(() => {
        handlerGetDataCabang();
        handlerGetDataRanting();
    }, [])

    // deklarasi router
    const router = useRouter()

    // function login checker
    const isLogged = () => {
        if (localStorage.getItem('token') === null || localStorage.getItem('admin') === null) {
            router.push('/admin/login')
        }
    }


    const thTables = (props) => {
        const name = ['KESHAN', 'SENAM', 'JURUS', 'FISIK', 'TEKNIK', 'SAMBUNG', 'RATA - RATA']
        {
            return (
                props.map((item, index) => (
                    <Fragment>
                        <tr className='p-1.5'>
                            <th className='border-2 border-navy text-white'>{name[index]}</th>
                            <th className='border-2 border-navy' style={{ color: '#FF6A81' }}>{item.data[0]}%</th>
                            <th className='border-2 border-navy' style={{ color: '#6CE1AE' }}>{item.data[1]}%</th>
                            <th className='border-2 border-navy' style={{ color: '#48B8F1' }}>{item.data[2]}%</th>
                            <th className='border-2 border-navy' style={{ color: '#BC5EF6' }}>{item.data[3]}%</th>
                            <th className='border-2 border-navy text-orange-500' style={{ color: '#FB934E' }}>{item.data[4]}%</th>
                            <th className='border-2 border-navy text-yellow' style={{ color: '#E9E059' }}>{item.data[5]}%</th>
                        </tr>
                    </Fragment>
                ))
            )
        }
    }
    useEffect(() => {
        isLogged()
    }, [])

    const handleChange = (option) => {
        setSearch(option);
        setEvent(option.value)
        console.log(`Option selected:`, option);
    };

    useEffect(() => {
        handlerClick();
    }, [event, ranting])

    return (
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

                    {/* wrapper page name and download data */}
                    <div className="flex justify-between items-center text-white mb-7">

                        {/* page name */}
                        <h1 className='text-2xl tracking-wider uppercase font-bold'>Dashboard</h1>

                        {/* download button */}
                        <div className="bg-purple rounded-md px-5 py-2 flex items-center gap-x-2">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.75 11.25V14.25C15.75 14.6478 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V11.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M5.25 7.5L9 11.25L12.75 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 11.25V2.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <h1>Download Data</h1>
                        </div>
                    </div>


                    {/* wrapper chart bar description and data set dropdown */}
                    <div className="flex justify-between mb-7">
                        {/* wrapper chart bar description */}
                        <div id='animationElement' className="grid grid-cols-3 gap-x-8 text-white opacity-0">
                            <div className="inline-flex items-center gap-x-2">
                                <div className="bg-red h-5 w-5">
                                </div>
                                <h1 className='text-lg font-semibold'>Kurang</h1>
                            </div>
                            <div className="inline-flex items-center gap-x-2">
                                <div className="bg-yellow h-5 w-5">
                                </div>
                                <h1 className='text-lg font-semibold'>Baik</h1>
                            </div>
                            <div className="inline-flex items-center gap-x-2">
                                <div className="bg-green h-5 w-5">
                                </div>
                                <h1 className='text-lg font-semibold'>Cukup</h1>
                            </div>
                        </div>
                        {/* wrapper data set */}
                        <div className="inline-flex space-x-2">
                            <h1 className='px-3 text-white text-lg font-semibold tracking-wider uppercase'>Event</h1>

                            {tipeUkt && <button
                                onClick={() => setTipeUkt(null)}
                                className='bg-navy p-3 rounded-md'><div className='bg-red p-2 rounded-md'></div></button>}

                            {tipeUkt
                                ? <>
                                    <div className='w-full '>
                                        <Select
                                            value={search}
                                            onChange={handleChange}
                                            options={dataEvent}
                                        />
                                    </div>
                                </>
                                : <div className=' flex gap-x-2'>
                                    <button
                                        onClick={() => setTipeUkt('UKT Jambon')}
                                        className='flex items-center justify-center bg-navy rounded-md p-1 px-2 text-md text-white hover:scale-105'>
                                        <div className='bg-purple p-1.5 px-3 rounded-md'></div>
                                        <p>Jambon</p>
                                    </button>
                                    <button
                                        onClick={() => setTipeUkt('UKT Hijau')}
                                        className='flex items-center justify-center bg-navy rounded-md p-1 px-2 text-md text-white hover:scale-105'>
                                        <div className='bg-green p-1.5 px-3 rounded-md'></div>
                                        <p>Hijau</p>
                                    </button>
                                    <button
                                        onClick={() => setTipeUkt('UKT Putih')}
                                        className='flex items-center justify-center bg-navy rounded-md p-1 px-2 text-md text-white hover:scale-105'>
                                        <div className='bg-white p-1.5 px-3 rounded-md'></div>
                                        Putih</button>
                                    <button
                                        onClick={() => setTipeUkt('UKCW')}
                                        className='flex items-center justify-center bg-navy rounded-md p-1 px-2 text-md text-white hover:scale-105'>
                                        <div className='b border-white border-2 p-1.5 px-3 rounded-md'></div>
                                        UKCW</button>
                                </div>
                            }
                            <h1 className='px-3 text-white text-lg font-semibold tracking-wider uppercase'>{go ? 'ranting ' : 'cabang '}</h1>
                            {/* download button */}
                            {/* data set dropdown */}
                            <div className="relative w-full">


                                {go
                                    ? <div className='w-48 flex'>
                                        <select
                                            className="w-full px-1 rounded-l-md bg-white focus:outline-none"
                                            onChange={(e) => {
                                                handlerClick(e.target.value, "ranting");
                                                setRanting(e.target.value)
                                                setType('ranting');
                                            }}
                                        >
                                            <option value="" disabled selected>Select an option</option>
                                            {dataRanting.map((item, index) => (
                                                <option key={index}>{item.id_ranting}</option>
                                            ))}
                                        </select>
                                        <button className="bg-green px-1 rounded-r-md" onClick={() => {
                                            setType('cabang');
                                            setCabang(null);
                                            setGo(false)
                                        }
                                        }>&#10148;</button>
                                    </div>

                                    : <div className='w-48 flex'>
                                        <select
                                            className="w-full px-1 rounded-l-md bg-white focus:outline-none"
                                            value={cabang || ""}
                                            onChange={(e) => {
                                                setCabang(e.target.value);
                                                setType('cabang');
                                                setGo(true);
                                            }}
                                        >
                                            <option value="" disabled>Select an option</option>
                                            {dataCabang.map((item, index) => (
                                                <option key={index} value={item.id_cabang}>{item.name}</option>
                                            ))}
                                        </select>
                                        <button className="bg-green px-1 rounded-r-md">&#10148;</button>
                                    </div>

                                }


                            </div>
                        </div>
                    </div>

                    {/* wrapper chart bar */}
                    <div className="bg-navy p-7 rounded-lg space-y-8 mb-8">
                        <div className='overflow-scroll'>
                            {/* <h3 className='text-center mt-b3'>Bar Chart In ReactJS</h3> */}
                            <Chart
                                type='bar'
                                width={1280}
                                height={720}
                                series={data}
                                options={{
                                    title: {
                                        text: `${type === 'cabang' ? 'STATISTIK CABANG' : 'STATISTIK RANTING ' + ranting}`,
                                        align: 'center',
                                        style: { fontSize: 30 },
                                    },
                                    chart: {
                                        background: '#1B2537'
                                    },
                                    theme: { mode: 'dark' },
                                    xaxis: {
                                        categories: [
                                            'Keshan',
                                            'Senam',
                                            'Jurus',
                                            'Fisik',
                                            'Teknik',
                                            'Sambung',
                                            'Rata - rata',
                                        ],
                                    },
                                    yaxis: {
                                        min: 0,
                                        max: 100,
                                        labels: {
                                            formatter: (val) => {
                                                return `${val}%`;
                                            },
                                            style: {
                                                fontSize: '15',
                                                colors: ['#FFFFFF'],
                                            },
                                        },
                                    },
                                    legend: {
                                        show: true,
                                        position: 'bottom',
                                        horizontalAlign: 'left',
                                    },
                                    dataLabels: {
                                        formatter: (val) => {
                                            return ``;
                                        },
                                    },
                                }}
                            />

                        </div>

                        <div className="grid grid-cols-4">

                            {/* statistic color description */}
                            <div className="flex justify-center items-center">
                                <div>
                                    <div className="flex items-center gap-x-2">
                                        <div className="bg-yellow w-5 h-5 rounded-md" style={{ backgroundColor: '#E9E059' }}></div>
                                        <span className='text-lg text-white'  >91 - 100 : Sangat Memuaskan</span>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <div className="bg-orange-500 w-5 h-5 rounded-md" style={{ backgroundColor: '#FB934E' }}></div>
                                        <span className='text-lg text-white'>81 - 90 : Memuaskan</span>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <div className="bg-purple w-5 h-5 rounded-md" style={{ backgroundColor: '#BC5EF6' }}></div>
                                        <span className='text-lg text-white'>71 - 80 : Baik</span>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <div className="bg-blue-400 w-5 h-5 rounded-md" style={{ backgroundColor: '#48B8F1' }}></div>
                                        <span className='text-lg text-white'>61 - 70 : Cukup Baik</span>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <div className="bg-green w-5 h-5 rounded-md" style={{ backgroundColor: '#6CE1AE' }}></div>
                                        <span className='text-lg text-white'>51 - 60 : Sedang</span>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <div className="bg-red w-5 h-5 rounded-md" style={{ backgroundColor: '#FF6A81' }}></div>
                                        <span className='text-lg text-white'> {"< 50"} : Kurang</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-3 bg-green">
                                <table className='w-full table-fixed bg-darkBlue'>
                                    <thead>
                                        {thTables(dataTable)}
                                    </thead>
                                </table>
                            </div>
                        </div>

                    </div>

                    {/* wrapper catatan */}
                    <div className="bg-navy p-7 rounded-lg space-y-4">
                        <h1 className='text-center text-white text-3xl font-semibold tracking-wider'>{type === 'cabang' ? 'CATATAN CABANG' : 'CATATAN RANTING ' + ranting}</h1>

                        <div className='w-full rounded-md p-2 text-xl bg-white'>
                            <EditorQuill type={type} cabang={cabang} ranting={ranting} />
                        </div>
                    </div>
                </div>
                {/* akhir konten utama */}

                {/* footer */}
                <Footer />
                {/* akhir footer */}

            </div>
            {/* akhir wrapper konten utama */}
        </div >
    )
}

export default index