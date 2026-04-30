import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import Sidebar from '../../../components/sidebar'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import { globalState } from '@/context/context'
import Modal_Filter from '../../../components/modal_filter';
import Image from 'next/image';
import { useRouter } from 'next/router'
import { getSocket } from '../../../../../lib/socket';
import Select from 'react-select';
import toast from 'react-hot-toast';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const customStyles = {
    control: (provided) => ({
        ...provided,
        background: 'white',
        colors: 'black',
    }),
    menu: (provided) => ({
        ...provided,
        background: 'white',
        color: 'grey',
        width: '8rem'
    }),
    valueContainer: (provided) => ({
        ...provided,
        maxHeight: '80px',
        overflowY: 'auto',
    }),

    multiValue: (provided, state) => {
        const values = state.selectProps.value || [];
        const index = values.findIndex(
            (v) => v.value === state.data.value
        );

        const color = ['#E57373', '#64B5F6', '#81C784', '#FFD54F', '#BA68C8', '#4DB6AC'][index % 6];

        return {
            ...provided,
            backgroundColor: color,
            borderRadius: '6px',
        };
    },

    multiValueLabel: (provided) => ({
        ...provided,
        color: 'white',
        fontWeight: 500,
    }),

    multiValueRemove: (provided) => ({
        ...provided,
        color: 'white',
        ':hover': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            color: 'white',
        },
    }),
};

const rekap_nilai_ukt_jambon = () => {

    // deklarasi router
    const router = useRouter()
    const eventId = router.query.eventId;
    const idRanting = router.query.idRanting;

    const [dataUkt, setDataUkt] = useState([])

    // state modal
    const [dataEvent, setDataEvent] = useState([])
    const [dataEventSelect, setDataEventSelect] = useState([])
    const [eventSelect, setEventSelect] = useState([])
    const [dataRanting, setDataRanting] = useState(null)
    const [modalFilter, setModalFilter] = useState(false)
    const [name, setName] = useState(null);
    const [loading, setLoading] = useState(false);
    const [jenis, setJenis] = useState('all')
    const [updown, setUpDown] = useState('upToDown')
    const [rantingDropdown, setRantingDropdown] = useState(false)
    const [columnType, setColumnType] = useState('ranting') // 'ranting' or 'rayon'
    const [resyncLoading, setResyncLoading] = useState(false);
    const [adminRole, setAdminRole] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModalResync, setShowModalResync] = useState(false);

    const executeResync = async () => {
        const token = localStorage.getItem('token');
        const event = JSON.parse(localStorage.getItem('event'));
        const selectedEvent =
            eventSelect.length > 0
                ? eventSelect.map(item => item.value)
                : [eventId];

        setResyncLoading(true);
        
        try {
            const res = await axios.post(BASE_URL + 'session/resync_event', 
                { id_event: selectedEvent },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (res.data.status) {
                toast.success('Berhasil melakukan resync nilai KeSHAN!');
                getDataUktFiltered(); // Refresh the table
            } else {
                toast.error("Gagal melakukan resync: " + res.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Terjadi kesalahan saat melakukan resync.");
        } finally {
            setResyncLoading(false);
        }
    }

    const getDataUktFiltered = async () => {
        const token = localStorage.getItem('token')
        const event = JSON.parse(localStorage.getItem('event'));
        const selectedEvent =
            eventSelect.length > 0
                ? eventSelect.map(item => item.value)
                : [eventId];
        const selectedRanting = [idRanting]
        let form = {
            event: selectedEvent,
            tipeUkt: event.tipe_ukt,
            jenis,
            updown,
            id_ranting: selectedRanting
        };
        
        // Include search name if provided
        if (name && name.trim() !== '') {
            form.name = name.trim();
        }
        
        setLoading(true);

        await axios.post(BASE_URL + `ukt_siswa/ukt/ranting`, form, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setDataUkt(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
                console.log(err.response.data);
            })
            .finally(() => {
                setLoading(false);
            });
    }
    function formatNumber(number) {
        return number
    }

    // function login checker
    const isLogged = () => {
        if (localStorage.getItem('token') === null || localStorage.getItem('admin') === null) {
            router.push('/admin/login')
        }
    }
    useEffect(() => {
        localStorage.removeItem('filterRanting')
        isLogged()
        const adminData = JSON.parse(localStorage.getItem('admin'));
        if (adminData) {
            setAdminRole(adminData.id_role);
        }
    }, [])
    // get data event select
    const getDataEventSelect = async () => {
        const event = JSON.parse(localStorage.getItem('event'));
        const token = localStorage.getItem('token')
        await
            axios.get(BASE_URL + `event/select/tipe/UKT JAMBON/all`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    setDataEventSelect(res.data.data)
                    if (eventSelect.length == 0) {
                        handleChangeEvent([{ value: event.id_event, label: event.name }])
                    }
                })
                .catch(err => {
                    console.log(err.message);
                    console.log(err.response.data);
                })
    }
    useEffect(() => {
        if (!router.isReady) return;
        getDataEventSelect();
    }, [router.isReady]);
    const handleChangeEvent = (option) => {
        setEventSelect(option)
    };

    // Debounce timer for search
    let searchTimeoutId = null;

    useEffect(() => {
        if (!router.isReady) return;
        if (eventSelect.length === 0) return;

        const event = JSON.parse(localStorage.getItem('event'));
        setDataEvent(event);

        // Debounce the API call when name changes
        if (searchTimeoutId) {
            clearTimeout(searchTimeoutId);
        }

        searchTimeoutId = setTimeout(() => {
            getDataUktFiltered();
        }, 500);

        const socket = getSocket();

        if (!socket.connected) {
            socket.connect();
            socket.emit('join_event', {
                role: 'pengurus',
                event_id: event.id_event,
            });
        }

        const handleUpdate = () => {
            getDataUktFiltered();
        };

        socket.on('update_rekap', handleUpdate);

        return () => {
            if (searchTimeoutId) {
                clearTimeout(searchTimeoutId);
            }
            socket.off('update_rekap', handleUpdate);
            socket.disconnect();
        };
    }, [dataRanting, jenis, updown, router.isReady, eventSelect, name]);

    // useEffect(() => {
    //     socket.on('refreshRekap', () => {
    //         getDataUktFiltered()
    //     })

    // }, [])

    // useEffect(() => {
    //     setInterval(() => {
    //         socket.emit('pushRekap')
    //     }, 3000)
    // }, [])



    return (
        <>
            {loading
                ?
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className='flex flex-col justify-center items-center bg-navy rounded-md p-5'>
                        <Image src="/svg/spinner.svg" className="rounded-md" width={78} height={78} alt="Your SVG" />
                        <h1 className='text-white text-center'>
                            Please Wait Data Is Processed
                        </h1>
                    </div>
                </div>
                : null}
            <div className="flex font-lato">
                <Sidebar />
                {/* akhir sidebar */}

                {/* awal wrapper konten utama */}
                {/* supaya konten header dapat di scroll dan tidak mempengaruhi sidebar */}
                <div className="w-full overflow-hidden min-h-screen h-screen scrollbar-hide">

                    {/* overlap untuk device sm */}
                    {/* <div className="absolute hidden lg:hidden inset-0 bg-slate-400 opacity-50 z-10">
                    </div> */}

                    {/* header */}
                    <Header />
                    {/* akhir header */}

                    {/* konten utama */}
                    <div className="h-full bg-darkBlue p-6">

                        {/* wrapper page name and search */}
                        <div className="flex justify-between items-center text-white mb-7">

                            {/* page name and button back */}
                            <div className="flex justify-center items-center gap-x-3">
                                <Link href={'../?ranting=' + idRanting + '&ukt=UKT+JAMBON&tipe=ukt_jambon'} className="bg-purple hover:bg-white rounded-md w-9 h-9 flex justify-center items-center group duration-300">
                                    <svg className='-translate-x-0.5 fill-white group-hover:fill-purple' width="13" height="22" viewBox="0 0 14 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.2258 26.4657L0.354838 14.4974C0.225806 14.3549 0.134623 14.2005 0.08129 14.0343C0.0270964 13.8681 0 13.69 0 13.5C0 13.31 0.0270964 13.1319 0.08129 12.9657C0.134623 12.7995 0.225806 12.6451 0.354838 12.5026L11.2258 0.498681C11.5269 0.166227 11.9032 0 12.3548 0C12.8065 0 13.1935 0.1781 13.5161 0.534301C13.8387 0.890501 14 1.30607 14 1.781C14 2.25594 13.8387 2.6715 13.5161 3.0277L4.03226 13.5L13.5161 23.9723C13.8172 24.3048 13.9677 24.7141 13.9677 25.2005C13.9677 25.6878 13.8065 26.1095 13.4839 26.4657C13.1613 26.8219 12.7849 27 12.3548 27C11.9247 27 11.5484 26.8219 11.2258 26.4657Z" />
                                    </svg>
                                </Link>
                                <h1 className='text-2xl tracking-wider uppercase font-bold'>Rekap Nilai - {dataEvent?.tipe_ukt} - {dataEvent?.name}</h1>
                            </div>

                            {/* wrapper search and filter */}
                            <div className="flex flex-col md:flex-row gap-3 w-full items-start md:items-center justify-end">

                                {/* Select Container - Full width on mobile, 72 on desktop */}
                                <div className='w-full md:w-72 text-black'>
                                    <Select
                                        styles={customStyles}
                                        isMulti
                                        name='colors'
                                        value={eventSelect}
                                        placeholder="Select Event..."
                                        onChange={handleChangeEvent}
                                        options={dataEventSelect}
                                    />
                                </div>

                                {/* Search and Filter Group - Stays side-by-side or stacks depending on width */}
                                <div className="flex flex-row gap-2 w-full md:w-auto">

                                    {/* Search Input */}
                                    <div className="bg-purple rounded-md px-4 py-2 flex items-center gap-x-2 flex-grow md:w-72">
                                        <svg className="shrink-0" width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.625 16.625C13.491 16.625 16.625 13.491 16.625 9.625C16.625 5.75901 13.491 2.625 9.625 2.625C5.75901 2.625 2.625 5.75901 2.625 9.625C2.625 13.491 5.75901 16.625 9.625 16.625Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M18.3746 18.3751L14.5684 14.5688" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <input
                                            onChange={(e) => setName(e.target.value)}
                                            className='bg-transparent placeholder:text-white/80 placeholder:tracking-wider placeholder:text-sm w-full focus:outline-none text-white'
                                            placeholder='Search...'
                                            type="text"
                                        />
                                    </div>
                                </div>

                                {/* actions dropdown */}
                                {(adminRole === 'admin cabang' || adminRole === 'super admin') && (
                                    <div className="relative">
                                        <button 
                                            onClick={() => setShowDropdown(!showDropdown)} 
                                            className="bg-purple hover:bg-white text-white hover:text-purple transition-all duration-300 rounded-md px-2 py-2 flex items-center justify-center h-full"
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                        
                                        {showDropdown && (
                                            <div className="absolute right-0 mt-2 w-56 bg-navy rounded-md shadow-lg z-50 overflow-hidden border border-gray-700">
                                                <div className="py-1">
                                                    <button 
                                                        onClick={() => {
                                                            setShowDropdown(false);
                                                            setShowModalResync(true);
                                                        }} 
                                                        disabled={resyncLoading} 
                                                        className="w-full text-left px-4 py-3 text-sm text-white hover:bg-purple transition-all duration-300 flex items-center gap-x-3"
                                                    >
                                                        <svg className={resyncLoading ? "animate-spin text-yellow-500" : "text-yellow-500"} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                        <span className="font-semibold tracking-wider">{resyncLoading ? 'SYNCING...' : 'RESYNC KESHAN'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}


                            </div>
                        </div>

                        {/* wrapper table */}
                        <div className="bg-navy rounded-md py-2 pl-3 uppercase h-[75%]">

                            <div className='overflow-x-auto overflow-y-auto h-full bg-navy'>
                                {/* table */}
                                <table className='w-full table-fixed min-w-[800px]'>
                                    <thead className='bg-purple sticky top-0 z-10'>
                                        <tr className='text-white text-center bg-purple'>
                                            <th className='py-0.5 w-[3%] border font-oswald text-xs'>RANK</th>
                                            <th className='w-[20%] border font-oswald text-xs' >NAMA</th>
                                            <th className='w-[8%] border font-oswald text-xs relative'>
                                                <button
                                                    className='flex items-center gap-1 w-full justify-center'
                                                    onClick={() => setRantingDropdown(!rantingDropdown)}
                                                >
                                                    {columnType === 'ranting' ? 'RANTING' : 'RAYON'}
                                                    <svg className={`w-3 h-3 transition-transform ${rantingDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                                {rantingDropdown && (
                                                    <div className='absolute top-full left-0 bg-purple text-white text-xs py-1 px-2 rounded shadow-lg z-30'>
                                                        {columnType === 'ranting' ? (
                                                            <button
                                                                className='hover:bg-white/20 px-2 py-1 block w-full text-left'
                                                                onClick={() => {
                                                                    setColumnType('rayon');
                                                                    setRantingDropdown(false);
                                                                }}
                                                            >
                                                                RAYON
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className='hover:bg-white/20 px-2 py-1 block w-full text-left'
                                                                onClick={() => {
                                                                    setColumnType('ranting');
                                                                    setRantingDropdown(false);
                                                                }}
                                                            >
                                                                RANTING
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </th>
                                            <th className='text-xs w-[5%] border font-oswald'>KESHAN {jenis == 'keshan' && updown == 'upToDown'
                                                ? <button className='rounded-md bg-gray p-0.5' onClick={() => {
                                                    setJenis('keshan');
                                                    setUpDown('downToUp');
                                                }}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" /></svg></button>
                                                : <button className='rounded-md bg-gray p-0.5' onClick={() => {
                                                    setJenis('keshan');
                                                    setUpDown('upToDown');
                                                }}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 15l7-7 7 7" /></svg></button>}</th>
                                            <th className='text-xs w-[5%] border font-oswald'>Senam {jenis == 'senam' && updown == 'upToDown'
                                                ? <button className='rounded-md bg-gray p-0.5' onClick={() => {
                                                    setJenis('senam');
                                                    setUpDown('downToUp');

                                                }}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" /></svg></button>
                                                : <button className='rounded-md bg-gray p-0.5' onClick={() => {
                                                    setJenis('senam');
                                                    setUpDown('upToDown');

                                                }}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 15l7-7 7 7" /></svg></button>}</th>
                                            <th className='text-xs w-[5%] border font-oswald'>Jurus {jenis == 'jurus' && updown == 'upToDown'
                                                ? <button className='rounded-md bg-gray p-0.5' onClick={() => {
                                                    setJenis('jurus');
                                                    setUpDown('downToUp');

                                                }}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" /></svg></button>
                                                : <button className='rounded-md bg-gray p-0.5' onClick={() => {
                                                    setJenis('jurus');
                                                    setUpDown('upToDown');

                                                }}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 15l7-7 7 7" /></svg></button>}</th>
                                            <th className='text-xs w-[5%] border font-oswald'>Teknik {jenis == 'teknik' && updown == 'upToDown'
                                                ? <button className='rounded-md bg-gray p-0.5' onClick={() => {
                                                    setJenis('teknik');
                                                    setUpDown('downToUp');

                                                }}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" /></svg></button>
                                                : <button className='rounded-md bg-gray p-0.5' onClick={() => {
                                                    setJenis('teknik');
                                                    setUpDown('upToDown');

                                                }}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 15l7-7 7 7" /></svg></button>}</th>
                                            <th className='text-xs w-[5%] border font-oswald'>Fisik {jenis == 'fisik' && updown == 'upToDown'
                                                ? <button className='rounded-md bg-gray p-0.5' onClick={() => {
                                                    setJenis('fisik');
                                                    setUpDown('downToUp');

                                                }}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" /></svg></button>
                                                : <button className='rounded-md bg-gray p-0.5' onClick={() => {
                                                    setJenis('fisik');
                                                    setUpDown('upToDown');

                                                }}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 15l7-7 7 7" /></svg></button>}</th>
                                            <th className='text-xs w-[5%] border font-oswald'>Sambung {jenis == 'sambung' && updown == 'upToDown'
                                                ? <button className='rounded-md bg-gray p-0.5' onClick={() => {
                                                    setJenis('sambung');
                                                    setUpDown('downToUp');

                                                }}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" /></svg></button>
                                                : <button className='rounded-md bg-gray p-0.5' onClick={() => {
                                                    setJenis('sambung');
                                                    setUpDown('upToDown');
                                                }}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 15l7-7 7 7" /></svg></button>}</th>
                                            <th className='text-xs w-[6%] border font-oswald bg-purple sticky right-0 z-20'>Rata-rata {jenis == 'all' && updown == 'upToDown'
                                                ? <button className='rounded-md bg-gray p-0.5' onClick={() => {
                                                    setJenis('all');
                                                    setUpDown('downToUp');

                                                }}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" /></svg></button>
                                                : <button className='rounded-md bg-gray p-0.5' onClick={() => {
                                                    setJenis('all');
                                                    setUpDown('upToDown');

                                                }}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 15l7-7 7 7" /></svg></button>}</th>
                                        </tr>
                                    </thead>
                                    <tbody className=''>
                                        {
                                            dataUkt?.map((item, index) => (
                                                <tr key={index + 1} className={'text-white text-center even:bg-darkBlue border-t border-gray-100 border font-bold text-xs'}>
                                                    <td className='border-b-2 py-0.5 border-gray text-purple font-bold border'>{index + 1}</td>
                                                    <td className='border-b-2 border-gray text-left border px-1 text-xs'>{item?.name} [{item?.nomor_urut}]</td>
                                                    <td className='border-b-2 border-gray border text-xs'>{columnType === 'ranting' ? item?.ranting : item?.rayon}</td>
                                                    <td className={`border-b-2 border-gray border text-xs ${item?.keshan < 50 && 'text-[#ca3030]'} ${item?.keshan > 89.99 && 'text-[#7dff5d]'}`}>{(item?.keshan)}</td>
                                                    <td className={`border-b-2 border-gray border text-xs ${item?.senam < 50 && 'text-[#ca3030]'} ${item?.senam > 89.99 && 'text-[#7dff5d]'}`}>{formatNumber(item?.senam)}</td>
                                                    <td className={`border-b-2 border-gray border text-xs ${item?.jurus < 50 && 'text-[#ca3030]'} ${item?.jurus > 89.99 && 'text-[#7dff5d]'}`}>{formatNumber(item?.jurus)}</td>
                                                    <td className={`border-b-2 border-gray border text-xs ${item?.teknik < 50 && 'text-[#ca3030]'} ${item?.teknik > 89.99 && 'text-[#7dff5d]'}`}>{formatNumber(item?.teknik)}</td>
                                                    <td className={`border-b-2 border-gray border text-xs ${item?.fisik < 50 && 'text-[#ca3030]'} ${item?.fisik > 89.99 && 'text-[#7dff5d]'}`}>{formatNumber(item?.fisik)}</td>
                                                    <td className={`border-b-2 border-gray border text-xs ${item?.sambung < 50 && 'text-[#ca3030]'} ${item?.sambung > 89.99 && 'text-[#7dff5d]'}`}>{formatNumber(item?.sambung)}</td>
                                                    <td
                                                        className={`border-b-2 border-gray border font-bold text-xs sticky right-0 z-10
                                                            ${item?.total < 50
                                                                ? 'bg-[#371b1b]'
                                                                : item?.total > 89.99
                                                                    ? 'bg-[#1f371b]'
                                                                    : (index % 2 !== 0 ? 'bg-darkBlue' : 'bg-navy')
                                                            }`}
                                                    >
                                                        {item?.total}
                                                    </td>
                                                </tr>
                                            )
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <globalState.Provider value={{ modalFilter, setModalFilter, jenis, setJenis, updown, setUpDown, dataRanting, setDataRanting }}>
                            <Modal_Filter />
                        </globalState.Provider>

                        {/* Modal Confirmation Resync */}
                        {showModalResync && (
                            <>
                                <div className="fixed flex justify-center items-center top-0 left-0 z-50 w-full h-full p-4 overflow-x-hidden overflow-y-auto">
                                    <div className="relative w-full h-full max-w-md md:h-auto flex items-center justify-center mt-20">
                                        <div className="relative bg-navy text-white rounded-lg shadow w-full border border-gray-600">
                                            <div className="flex justify-center px-4 pt-7 pb-4">
                                                <h1 className="text-2xl font-bold text-center">
                                                    Konfirmasi Resync
                                                </h1>
                                                <button onClick={() => setShowModalResync(false)} type="button" className="p-1.5 inline-flex items-center absolute right-5 top-5">
                                                    <svg className="w-6 h-6 fill-white hover:fill-purple duration-300" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="px-6 py-2 space-y-3">
                                                <h1 className='text-lg font-medium text-gray-200 text-center'>Apakah Anda yakin ingin melakukan sinkronisasi ulang (resync) semua nilai KeSHAN untuk event ini?</h1>
                                            </div>
                                            <div className="flex items-center justify-center p-6 space-x-4">
                                                <button onClick={() => setShowModalResync(false)} className="w-1/2 text-white hover:text-red bg-red hover:bg-white duration-300 font-medium rounded-lg px-5 py-2.5 text-center">Batal</button>
                                                <button onClick={() => { setShowModalResync(false); executeResync(); }} className="w-1/2 text-white hover:text-green bg-green hover:bg-white duration-300 rounded-lg font-medium px-5 py-2.5 focus:z-10">Ya, Sinkronkan</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-black opacity-70 fixed inset-0 z-40"></div>
                            </>
                        )}

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

export default rekap_nilai_ukt_jambon