import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { globalState } from '@/context/context'
import Sidebar from '../../../components/sidebar'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import Modal_penguji_ranting from '../../../components/modal_penguji_ranting'
import Modal_delete from '../../../components/modal_delete'
import { useRouter } from 'next/router'
import ModalFilterPengujiRanting from '../../../components/modal_filter_penguji_ranting'
import Modal_CSV_Penguji from '../../../components/modal_csv_penguji_ranting'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

const penguji_ranting = () => {

    // state pathname
    const router = useRouter()
    const { web } = router.query

    // state modal
    const [showModalPengujiRanting, setShowModalPengujiRanting] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)
    const [showModalCSV, setShowModalCSV] = useState(false)

    // state
    const [dataPengujiRanting, setDataPengujiRanting] = useState([])
    const [dataRanting, setDataRanting] = useState([])
    const [modalFilter, setModalFilter] = useState(false)
    const [newWeb, setNewWeb] = useState('')
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false);


    const [action, setAction] = useState('')
    const [active, setActive] = useState(0)
    const [idPengujiRanting, setIdPengujiRanting] = useState('')
    const [niw, setNiw] = useState('')
    const [name, setName] = useState('')
    const [ranting, setRanting] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [noWa, setNoWa] = useState('')
    const [adminRole, setAdminRole] = useState('')
    const [role, setRole] = useState('')
    const [foto, setFoto] = useState('')

    // function get data penguji cabang
    const getDataPengujiRanting = async () => {
        const token = localStorage.getItem('token')
        // console.log('webquery')
        // console.log(web)
        // const web1 = web ? web : null
        setNewWeb(web)
        const form = {
            id_ranting: web ? web : newWeb,
            id_role: 'penguji ranting'
        }
        axios.post(BASE_URL + `penguji/pengujiperranting`, form, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setDataPengujiRanting(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    const searchPenguji = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')
        setNewWeb(web)
        const form = {
            id_ranting: web ? web : newWeb,
            name: search,
            id_role: 'penguji ranting'
        }
        axios.post(BASE_URL + `penguji/pengujiperranting`, form, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setDataPengujiRanting(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    };

    const getRole = () => {
        const role = JSON.parse(localStorage.getItem('admin'))
        setAdminRole(role.id_role)
    }

    // function modal add
    const addModal = () => {
        setShowModalPengujiRanting(true)
        setAction('insert')
        setNiw('')
        setName('')
        setRanting(web)
        setUsername('')
        setPassword('')
        setNoWa('')
        setRole('penguji ranting')
        setActive(0)
        setFoto()
    }

    // function modal edit
    const editModal = (selectedItem) => {
        setShowModalPengujiRanting(true)
        setAction('update')
        setIdPengujiRanting(selectedItem.id_penguji)
        setNiw(selectedItem.NIW)
        setName(selectedItem.name)
        setRanting(selectedItem.id_ranting)
        setUsername(selectedItem.username)
        setPassword(selectedItem.password)
        setNoWa(selectedItem.no_wa)
        setRole('penguji ranting')
        setActive(1)
        setFoto(selectedItem.foto)
    }
    const downloadTemplate = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.get(
                BASE_URL + 'penguji/download/template_ranting',
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
            link.setAttribute('download', 'template_penguji.xlsx');

            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {
            console.error('Failed to download template:', error);
        }
    };

    // function modal delete
    const deleteModal = (selectedId) => {
        setShowModalDelete(true)
        setAction('deletePengujiRanting')
        setIdPengujiRanting(selectedId)
    }
    const deleteTrashModal = (selectedId) => {
        setShowModalDelete(true)
        setAction('deletePengujiRantingNull')
        setIdPengujiRanting(selectedId)
    }
    const deleteRantingModal = () => {
        setShowModalDelete(true)
        setAction('deletePengujiRantingTipeRanting')
        setIdPengujiRanting(newWeb)
    }

    // function login checker
    const isLogged = () => {
        if (localStorage.getItem('token') === null || localStorage.getItem('admin') === null) {
            router.push('/admin/login')
        }
    }
    const handleVerification = (e) => {
        const token = localStorage.getItem('token')

        axios.patch(BASE_URL + `penguji/verification/${e.id_penguji}`, {}, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setShowModalPengujiRanting(false)
                getDataPengujiRanting()
                // console.log(res.data.data.message);
            })
            .catch(err => {
                console.log(err.message);
            })
    }
    useEffect(() => {
        setNewWeb(web)
        getDataPengujiRanting()
        isLogged()
        getRole()
    }, [router.isReady, web])

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

                            {/* page name and button back */}
                            <div className="flex justify-center items-center gap-x-3">
                                {adminRole != "admin ranting" &&
                                    <Link href={'./penguji_ranting'} className="bg-purple hover:bg-white rounded-md w-9 h-9 flex justify-center items-center group duration-300">
                                        <svg className='-translate-x-0.5 fill-white group-hover:fill-purple' width="13" height="22" viewBox="0 0 14 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.2258 26.4657L0.354838 14.4974C0.225806 14.3549 0.134623 14.2005 0.08129 14.0343C0.0270964 13.8681 0 13.69 0 13.5C0 13.31 0.0270964 13.1319 0.08129 12.9657C0.134623 12.7995 0.225806 12.6451 0.354838 12.5026L11.2258 0.498681C11.5269 0.166227 11.9032 0 12.3548 0C12.8065 0 13.1935 0.1781 13.5161 0.534301C13.8387 0.890501 14 1.30607 14 1.781C14 2.25594 13.8387 2.6715 13.5161 3.0277L4.03226 13.5L13.5161 23.9723C13.8172 24.3048 13.9677 24.7141 13.9677 25.2005C13.9677 25.6878 13.8065 26.1095 13.4839 26.4657C13.1613 26.8219 12.7849 27 12.3548 27C11.9247 27 11.5484 26.8219 11.2258 26.4657Z" />
                                        </svg>
                                    </Link>
                                }
                                <h1 className='text-2xl tracking-wider uppercase font-bold'>Penguji Ranting</h1>

                            </div>

                            {/* search and button add data */}
                            <div className="flex gap-x-3">
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
                                <div className="bg-navy rounded-md px-5 py-2 flex items-center gap-x-2 w-72 
                border border-transparent focus-within:border-purple">
                                    <svg className='z-50' width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.625 16.625C13.491 16.625 16.625 13.491 16.625 9.625C16.625 5.75901 13.491 2.625 9.625 2.625C5.75901 2.625 2.625 5.75901 2.625 9.625C2.625 13.491 5.75901 16.625 9.625 16.625Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M18.3746 18.3751L14.5684 14.5688" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>

                                    <form onSubmit={searchPenguji} className="w-full">
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search"
                                            className="bg-transparent text-white placeholder:text-white 
                       placeholder:tracking-wider placeholder:text-sm 
                       w-full focus:outline-none"
                                        />
                                    </form>
                                </div>

                                <button onClick={() => addModal()} className="bg-navy hover:text-purple duration-300 rounded-md px-5 py-2 flex items-center gap-x-2">
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFTUlEQVR4nO2ZS1BTdxTGM1q7cFdoV9pu2m7qpjOtTrty2ZnWGUoVFRAULCgCUqjK00anVpiW8EogL0AQFU0AFZCidMRHi0AJkBAIr/AGCyQgSiEJ0K9zMlMXCfFy7w1pO8OZufvf98//nPP9vwgEG7VRG8W7VFBtltmaPs1bbkzKszWWS2wNnTmWhpnsxce2zIVHtozFhzOihQf69Pn68vT5+0lpc/WfCCHcJPi3qxDNb8tXmtPkS81j0uUm5C01QmJ7ArG1ATmWX5G1+BiZi4+QsfAQ6X8+wE/z9fjxxX2kvfgFF+fujV6Yu5sqNNVs9zh4AVrfUq5o5PLlZqt8uRls4VOf1+GHuXu48Owuvp+ptZ6brZEKn1e+6RF4JVoDFCsas2Lld/CGn63F+dmfcW6mBkJTtSllqurguoHL0bIlHxql8i8N3A5vrsZZUxVSpiuRNHlbFg75FnfDb82Hpma94ZOnbiNx6hbi/6i4Ixyv3OrOk/cYfMLkTRKA0xPqOqFe9TpvAZ64NsmO8E/LcGpCjbhxlZQnfFsgF/i02ToIx27h7FAZkgfVSB4ux3lTDTv4CRVix28gZqz0ACf4YjR5K1c001xOnuA/SPwS3kG77N+OBB8kDKlZw38zdh3Ro9fMceNX2Y9YmvNcr03KYNlLePsXuBNn+kpZw58cLUX0yFVEDl3JZQWvgHY7nyWVPKB2EnC69xon+KjhKzgxfNkabix+Z80C7PaAR8MmGVVOAr7tucoRvgQRQ5dxbKAodU3wQmCTbKl5lM+0Sey/4SQgrvsKZ/jjg8UIM14a84NqM6MAcpV8R2V8/3UnAbGGEs7w4QNFJABHjcpdjALslpjnnKeGdRQQY7jME74AIUZlAqOAXNuTCr5LihrWUcDJrmJe8KH9+TjSp1QzChDbGvRsllTSgAqJRhXijTdwpv86TveVIrarxElAVEchojovIUpfiBP6AkR05OO4TolwrQJh7TKE6eSIGCh2CR/Sp0Rwr0LHLMDym5nNkuL1HdoFr8CP4eX/Ed6N+QyhWqlL+MO9CgT3yKcZBeQsPrayWlJuEvDGvg9xRCN5FTwOdcssjAKyFh5ZWS0pNwoI1ohdwgf1yBBokDILyFx8aH5Vw5Ix25Hosy5X6HCrxDV8txQBXRLmK2RPD14xbchVkjGjUUnThjYsLSma8zQqadpE6gqdmji8VYawdjm+bpPiaGseQlrzcESTa782dPIEH9qrdA1vyMXBTglzE6fP11fw9fORemcBBL+WURniAt6/S4L9nWLmMUq5Dd/HSGRHgZMAOnk+8Ac6xfDTZ8czCqDQie9Lima8owC6Nnzg9+tz4NuRtZNRACVmqXN1I5yfgRMq+4JyFEB3ng/83o7s4TWneZSYcYUne3BMq3ASQA3LFX6fPht7O7Iurgne/iuYarZTYsYFnrwNNayzAAl3eF2mxa9NtE3Apiju4wJPxowa1lEA45Lqdnny8NVmiFnB23+FZ7Ve35mqp7k8A8mYvX/mi5cC3jv1OfOSMqwO/5VWZNrTks4tN6WsksszkFwlGTM2S8p/NXhdBnx1Ij8Bn6Kskv9LisPJ6zLg0y6SCPgWvUPjJytuehxeK6reXS98TeCOoqD11FP1HQ/CV+1pkbsn3P2nKPKmrNIT12a3u05+taKsMnqkdNrd8L460RTvhl1rRY4Ve1PcFzFcYuENr8u00Jz304u8BJ6uYyNF2ygxCxsoGmHtbfTZI2QPWG/Y9SgyWRQ6UW5D0QelB0E9MnNQj9Qa2J1nDTBIzP6dYi35ebLE5Cr/E3+zbtRGCf7/9Tey8YxC/2MGnQAAAABJRU5ErkJggg==" alt="plus"></img>
                                </button>
                                <button onClick={() => deleteRantingModal()} className="bg-red hover:bg-white hover:text-purple duration-300 rounded-md px-5 py-2 flex items-center gap-x-2">
                                    <h1>Non Aktifkan Semua</h1>
                                </button>
                            </div>
                        </div>

                        {/* wrapper table */}
                        <div className="bg-navy rounded-md py-2 px-3">

                            {/* table */}
                            <table className='w-full table-fixed'>
                                <thead>
                                    <tr className='text-green'>
                                        <th className='py-3 w-[3%]'>No</th>
                                        <th className='w-[13%]'>NIW</th>
                                        <th>Nama</th>
                                        <th className='w-[13%]'>Ranting</th>
                                        <th className='w-[13%]'>Username</th>
                                        <th className='w-[13%]'>No WA</th>
                                        <th className='w-[13%]'>Foto</th>
                                        <th className='w-[20%]'>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataPengujiRanting.filter(a => a.id_role === 'penguji ranting').map((item, index) => (
                                        <tr key={index + 1} className={`text-center ${item.active ? 'text-white' : 'text-red'}`}>
                                            <td className='border-b-2 py-3 border-gray'>{index + 1}</td>
                                            <td className='border-b-2 border-gray'>{item.NIW}</td>
                                            <td className='border-b-2 border-gray'>{item.name}</td>
                                            <td className='border-b-2 border-gray'>{item.id_ranting}</td>
                                            <td className='border-b-2 border-gray'>{item.username}</td>
                                            <td className='border-b-2 border-gray'>{item.no_wa}</td>
                                            <td className='border-b-2 border-gray p-3'>
                                                <img className='rounded-lg object-cover h-28 w-28' src={IMAGE_URL + item?.foto} alt="" />
                                            </td>
                                            <td className='border-b-2 border-gray'>
                                                <div className="flex gap-x-2">
                                                    <button onClick={() => handleVerification(item)} className={`${item.active ? 'bg-green hover:bg-green' : 'bg-gray hover:bg-gray'} text-white hover:text-green py-2 rounded-md w-28 flex justify-center items-center space-x-1 mx-auto group duration-300`}>
                                                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADfElEQVR4nO2Zy0tUURzHVUro3UIiEKI2Rdki3IUtpEXhQvCNmmPagynfNhON9vJRVqZpOTVpSRjtQqKHaYq9FpFBLfqHPnHiGwxuPHfm3rkTzIHDGa/3nvv5/n6/c87vnJuVlSmZkilJF2AdUASEgEfALDAPLKl9BUwD/UAAKABy0gF8DzAIfAI+C/Q58Bi4D4wCI2rHgCgwBTzT7wYgzw/wnQL4AbwDngIPBG1A7wn8LjAM3AZuAUPADYk2f5t7J+SVLamCbwK+KzQmBeAUfgDoA66rHVJ4FXoJngvEZPUZ4KEL8NeAK8Bl4KpElMaPD2Af0KXxtTdR+M3AS+CLrO42fC8QiauVwHrggO7pVx+RRC1v4JflAa/gLwEXgbBqt+77B2/6601EQEyWTxV8SH2YMfYiDt5cO+gUvlkxP5li+PfAgtaRKV1zNsCBHZptZnyC/yABi8Bhh4HzV0BUbvQLflHVvOO4U/jdCp0pn+GHgPO6Z5sTAYNaYf2GPwcEgU7gqC18DvAxwfTAC/izatuBbBsBRUrM0gX+DHBaz+XbCAgpq0wn+GagAzhiIyCmlDid4Jt0vdpGwKzy+XSCbwROmf/bCJhX/K8F/wT4CazIa4nC37SAN/uFkyY/shGwpB3UWpY38L+BXxIR9RC+ATgB9Nh6YMQibFYEbxa8b0r4xj2Cr1ftsR0DoxYxH5MIA/9V6faCPOc2fJ08ELYRMK0ZyGbARmX5ZQGa1futRCQzYAOr4Gt1rcVGwIDAbGebcUG+U51T65bla4Ea3VdnIyCg/N/JVDksy8+pzrto+Roz/wNtQLGNgAKd2zid5+/I8l7AV+ldu2yTuQmNASeLVHfcVtBt+DrggvVpnjobcwjfpbTXhN5r4I28mCx8BdAKlFjBS0CevNDnEL5dsdqqjYgb8FVi2G4tQCICcr+f8OXqs8wRfNxhVr9OzPyCr9e7NzkWIBGFEhHxAb5Snj+UEHyciFIJSCV8ud5VnhS8BGSrw3AK4Tv1nDsfQXTQWqG52OuwCem5XFfgVy1wx/SCDo8GbK9+e/f5Cdgv63dKQLLw1eovkvSAdSBigznuiwupYILpQasWqTJgY0rgVwnZak7MBBJWaAW1AW/UJqRebUDX27SmmFAscbzCeiTEzFT55txGFg4KsEdxbcS1yOrFJqtMi8+smZIpWf9/+QM+sSdlUbAfaAAAAABJRU5ErkJggg==" alt="checked"></img>
                                                    </button>
                                                    <button onClick={() => editModal(item)} className="bg-yellow hover:bg-yellow text-white hover:text-green py-2 rounded-md w-28 flex justify-center items-center space-x-1 mx-auto group duration-300">
                                                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB4ElEQVR4nO3ZzYtOYRjH8dMsLC3Ewo7FeImd2EjJoOzsLOS9CMN4K4NQLIiiZEMmhRXlGRRmmqQoWdgQGxsSmb/io5vr0ZNmYjI9z32a+1tXd53O4nufc12nc36nqgqFQmHKgmnYidt4jIe4FsdmVzmDbjzFMAZwCedxDhdiXV7lCFbiJe7iMi6G8Fmcxgn04wiWVjmBVfiOd7gyjvxRHMaBWGdWmcl/xgc8j3YZS74Pe7Ef63KUf4s3MQdnxpHfFQO9O1f513iB+zg+hvwObE0b66R8z1/kn2EId3DoD/kt2JyGOXf5R3iAm9jTIr8R21N1Qn71BOUHowZiA0l+Q7TVsrrIN6KuxwbSAPeiq53yazH6H/KNqFs4hhl1uvKNqCdx3sKcHpUTkR/G4rrKD7X7yvfUWX5NkfdTPr0PLSjy/0KR91s+VdvlRydRfn6Rnwryc/ANn2onn8A9fJ0k+XlVu8F7fKyrfBe+RH5Tn7ZpgiXR+/WTb/k4eVVL+QQ24WpkNvWST0QumdLik5HZ5DuwYxFZ5amI+1JKfKM28okIXPtb4r7e+PnQlB6MuzISa3eVE35lMk35fbGBvvibMhIf3qm1DmJ6lRuYFYOc4u1tWI8VWIS5nfYrFAqFKgt+AMagAfFIkss7AAAAAElFTkSuQmCC" alt="pencil"></img>
                                                    </button>
                                                    <button onClick={() => deleteModal(item.id_penguji)} className="bg-blue hover:bg-blue text-white hover:text-red py-2 rounded-md w-28 flex justify-center items-center space-x-[1px] mx-auto group duration-300">
                                                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADaUlEQVR4nO2YyUuVURiHL9iiRYXRura1i4ZVpPt2DTaaA82TmZaZZUplkxkVtTCorBYRhSGlDc5pmKUNVprZQFFkG/FPeOLQ78JN1Ljvp/f7iHvg5X5evec8v3e8nlAovv6jBcwHyoHXwGegH/gB9AAtQAkwKxS0BcwBHgMDwE/gC/ABeAe8kb0F3gN9wG1gZigICyiMAP8I9MrjDrgLeAV0As+BdqANeCFb5Tf8FWAQ+CrP9kqE+/m7zD1/UjQ6lErNilgHkOun5weVLn0Cd1HoBsqAZGAqkAgsAIoF/0oC6oBG4BmwNNbwc5U2Yc+HC/YkkDDK5yY4jyudnIh6oAloBabHUkCrvB32vINPi+Lzi1QPTUCD9js9vtR/t8qBiIJ1Qk4Y9skCnkqAS6UnMYmC+vzPiILtHi1tRtknAbinVGpQfWwcH+q/D36pwu1RDZR52CtL4I0ScnFsaYc/NDyk3qpNLvSw12ylTqPqoXJsaYc/tF9p0yUB0zzsNWWIgLqxpf1zyESFulKH/YqYsN+AWuABUA1U6e9uATeA60AFcEm1cwE4qznhWu5RdaAmmUujnUCqWnWCV/gZQI2GzjXgvADOuLYnkFNAqetEwHHgmL60HQEOA4c0xIqAg8ABYD9QAOwD9gJ5wB7NiByZe84AJnnxvIO/I/BzMYLfBWQr6u450w1Ai4Ased4v+B3Adr0/zyKgUmnjJ/xWPadbBLRGFJ1f8FtkORYBbQGA3wxscp+zRiAI8BuAfIuA5oDAr3d7WATUBwR+nTUCtR7gSzRD2vVl7aZ+b4HPtEbggQf4TlmbUvGRBmK+AT7DRdMioNqYNjXDwN+VXTbAp7u9LQKqjDnfPgJ8tV6jhU+zCqg0FmzLCPD39R9YtPCpVgG3jN3m5gjwD4GrBvg17grHIuCGsVUeVMEOha9RG40WfrU7zyLguoc+n6+CDYu46gF+pTUCFTEaUpn/gF/hzrYIuBQQ+OWOwSKgPCDwKc6RFgEXAgK/1CqgVDfQfsOnWLtQjlLIT/glwFq3n0VAsrqQn/CLdV6SRYC7y9+mCPgFv0kXXdFfq0jEZEE4AbtjBL9MaZMr+EQT/JBr8Dk6NFuRCFtehO2NsHylXvi1QM0gbIXqboXqdEWaOcV6zzkjyez5+Iqv+IqvUKzWbwPQurDpMa60AAAAAElFTkSuQmCC" alt="lock"></img>
                                                    </button>
                                                    <button onClick={() => deleteTrashModal(item.id_penguji)} className="bg-red hover:bg-red text-white hover:text-red py-2 rounded-md w-28 flex justify-center items-center space-x-[1px] mx-auto group duration-300">
                                                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADZElEQVR4nO2XaUuUURTHB+pt0AeI3vUFpFeBHyGitKJssQ3TNm3RdBydJqwsNxDMiCAIlBLHrRrLBVssCdGijbIkooUw6yP84sJ54DLM8/gs13leNBcOs93nzu9/7rnnnBuJ5EZu5EagAZQBn4HvwDfgK/BFvpsDPgDvgTfAK2AGmAZGgI2RsIeAvgNeanAvgCngGfAUeAxMAGMC/lDeP1huuDyBWgT+An+A38AC8Av4KZ73Cm/ZpMx5IvMeydxxIAW0AOuCwCvYH8A88FELh7fAawkJv/DpNmJjQ8AaPwJmxMOfQoQfFWv2I2AxZM+PapbyI2BBvB82/JhfAVOSEsOEH5W1WvwI2CB5fT5k+PvAWs8CtEw0J9DZhk8BXb7hNRETko+bgSbgMtAIXAIuAheABuA8kADOAXGgHqgDaoEoUANUA2eBKqASOA2cAk4CFUA5cAI4BhxVvweCFwHjIcEfAc6YEDASEnyZKQHDIcGXqvkmBNwLCf6wKQGDDvDXgVnJTJ0e4NVaSaBXxGeCLzEloM/B87NakVPvO1zAK2fclSatH+i2gT9kSkCvQ9hMC7xVI1R9aPcAnxQBmeAPqjVMCLjjEPOd4nm9wKni1uYSPinnJhP8AeUIEwK6ljiwHQKu7LlcUlRlbnUBn3CA329KwC0X2aZdPD8pt6sJaQeuBIDfZ0rATZepsk27Elo9UcoGPu4CvtiUgBse8nyz1pwNSyfpx/PFwB61vgkB1zwWqUbxfFD43aYEXPVYYTPFfJ8mwC38LvVfJgS0G4Dvk8/9cp7cwBep/zQhoDUAvGX9mikxMRfwO5XjTAhoCgCfkASg78CAvKqwdILfYWoHGgPAWwe2XkQMpFnMAX67qR1oWKKrdJvnY5qIQXlmQNbNBL9NPWNCQMKhn096LFJRmTuk2W0b+K0qzEwIqHO4jPT6qLBR8byCV7vXYwNfaEpA1OEmFZd2uHuJrjI921SJ53vUvdcGvkCdHRMCKj1eA90WKbuwseC3KAeZEHA8JPhCU5W4SARkE36zzCs1ISBPQiib8JvEafkmBKwA9soOZAu+REJ3ZWABImKViKiQXShbBvgCLVwV/Goj8Gk7sV6gyiU7WVYl1Vq3arEaScW12mtM0m6dtBlx+U05Jd+Y53MjN/6D8Q9nxItKXMPZsQAAAABJRU5ErkJggg==" alt="delete-forever"></img>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* akhir konten utama */}

                    {/* footer */}
                    <Footer />
                    {/* akhir footer */}

                </div>
                {/* akhir wrapper konten utama */}
            </div>

            {/*memanggil modal  */}
            <globalState.Provider value={{ showModalPengujiRanting, setShowModalPengujiRanting, dataPengujiRanting, setDataPengujiRanting, action, setAction, idPengujiRanting, setIdPengujiRanting, niw, setNiw, name, setName, ranting, setRanting, username, setUsername, password, setPassword, noWa, setNoWa, role, setRole, foto, setFoto, newWeb, setNewWeb }}>
                <Modal_penguji_ranting />
            </globalState.Provider>

            <globalState.Provider value={{ modalFilter, setModalFilter, dataRanting, setDataRanting }}>
                <ModalFilterPengujiRanting />
            </globalState.Provider>

            <globalState.Provider value={{ showModalDelete, setShowModalDelete, dataPengujiRanting, setDataPengujiRanting, action, setAction, idPengujiRanting }}>
                <Modal_delete />
            </globalState.Provider>
            <globalState.Provider value={{ showModalCSV, setShowModalCSV }}>
                <Modal_CSV_Penguji />
            </globalState.Provider>
        </>
    )
}

export default penguji_ranting