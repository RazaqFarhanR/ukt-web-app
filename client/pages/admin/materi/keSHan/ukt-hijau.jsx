import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { globalState } from '@/context/context'
import Sidebar from '../../components/sidebar'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Modal_soal_keSHan from '../../components/modal_soal_keSHan'
import Modal_soal_delete from '../../components/modal_soal_delete'
import axios from 'axios'
import KeSHanList from '../../components/KeSHanList'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const ukt_hijau = () => {

    const router = useRouter()

    // state modal
    const [showModalSoalKeSHan, setShowModalSoalKeSHan] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)

    //state soal
    const [active, setActive] = useState([])
    const [action, setAction] = useState("")
    const [soal, setSoal] = useState([])
    const [kunciSoal, setKunciSoal] = useState([])
    const [jumlah, setJumlah] = useState(0)
    const [tipe_ukt, setTipe_ukt] = useState("ukt hijau")
    const [idLembar, setIdLembar] = useState("")
    const [idSoal, setIdSoal] = useState("")
    const [pertanyaan, setPertanyaan] = useState("")
    const [opsi1, setOpsi1] = useState("")
    const [opsi2, setOpsi2] = useState("")
    const [opsi3, setOpsi3] = useState("")
    const [opsi4, setOpsi4] = useState("")
    const [opsi, setOpsi] = useState("")

    // state checkbox answer
    const [showAnswer, setShowAnswer] = useState(false)

    // config header auth
    const headerConfig = () => {
        const token = localStorage.getItem("token")
        let header = {
            headers: { Authorization: `Bearer ${token}` }
        }
        return header
    }

    // function modal add
    const addModal = () => {
        setShowModalSoalKeSHan(true)
        setAction('insert')
        setPertanyaan("")
        setOpsi("")
        setOpsi1("")
        setOpsi2("")
        setOpsi3("")
        setOpsi4("")
    }

    // funtion modal edit
    const handleEdit = (selectedItem) => {
        setShowModalSoalKeSHan(true)
        setAction('update')
        setIdSoal(selectedItem.id_soal)
        setPertanyaan(selectedItem.pertanyaan)
        setOpsi(selectedItem?.kunci_soal?.opsi)
        setOpsi1(selectedItem.opsi1)
        setOpsi2(selectedItem.opsi2)
        setOpsi3(selectedItem.opsi3)
        setOpsi4(selectedItem.opsi4)
    }

    const handleSave = async (e) => {
        e.preventDefault()

        let data = {
            id_lembar_soal: idLembar,
            pertanyaan: pertanyaan,
            opsi1: opsi1,
            opsi2: opsi2,
            opsi3: opsi3,
            opsi4: opsi4,
            opsi: opsi
        }

        console.log(data)

        if (action === 'insert') {
            await axios.post(BASE_URL + 'soal', data, headerConfig())
                .then(res => {
                    console.log(res);
                    setShowModalSoalKeSHan(false)
                    getSoal()
                    getKunciSoal()
                })
                .catch(err => {
                    console.log(err.message);
                })
        } else if (action === 'update') {
            await axios.put(BASE_URL + 'soal/' + idSoal, data, headerConfig())
                .then(res => {
                    setShowModalSoalKeSHan(false)
                    getSoal()
                    getKunciSoal()
                })
                .catch(err => {
                    console.log(err.message);
                })
        }
    }

    // function modal delete
    const deleteModal = (id) => {
        setShowModalDelete(true)
        setIdSoal(id)
    }

    const handleDelete = async () => {
        await axios.delete(BASE_URL + 'soal/' + idSoal, headerConfig())
            .then(res => {
                setShowModalDelete(false)
                getSoal()
            }).catch(err => {
                console.log(err.message);
            })
    }

    // function handle answer
    const handleAnswer = () => {
        if (showAnswer == true) {
            setShowAnswer(false)
            setActive(soal)
        } else if (showAnswer == false) {
            setShowAnswer(true)
            setActive(kunciSoal)
        }
    }

    const getSoal = async () => {
        let id_lembar
        //get id soal
        await axios.post(BASE_URL + 'lembar_soal/ukt/UKT Hijau', { data: '' }, headerConfig())
            .then(res => {
                console.log(res)
                setIdLembar(res.data.data?.id_lembar_soal)
                id_lembar = res.data.data?.id_lembar_soal
            })
            .catch(err => {
                console.log(err.message);
            })

        await axios.get(BASE_URL + 'soal/tipe/' + tipe_ukt, headerConfig())
            .then(res => {
                setJumlah(res.data.count)
                setSoal(res.data.data)
                setActive(res.data.data)
                setShowAnswer(false)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    const getKunciSoal = async () => {
        await axios.get(BASE_URL + 'kunci_soal/tipe/' + tipe_ukt, headerConfig())
            .then(res => {
                setKunciSoal(res.data.data)
                setShowAnswer(false)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    // function login checker
    const isLogged = () => {
        if (localStorage.getItem('token') === null || localStorage.getItem('admin') === null) {
            router.push('/admin/login')
        }
    }

    useEffect(() => {
        getSoal()
        getKunciSoal()
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

                            {/* page name and button back */}
                            <div className="flex justify-center items-center gap-x-3">
                                <button onClick={() => router.back()} className="bg-purple hover:bg-white rounded-md w-9 h-9 flex justify-center items-center group duration-300">
                                    <svg className='-translate-x-0.5 fill-white group-hover:fill-purple' width="13" height="22" viewBox="0 0 14 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.2258 26.4657L0.354838 14.4974C0.225806 14.3549 0.134623 14.2005 0.08129 14.0343C0.0270964 13.8681 0 13.69 0 13.5C0 13.31 0.0270964 13.1319 0.08129 12.9657C0.134623 12.7995 0.225806 12.6451 0.354838 12.5026L11.2258 0.498681C11.5269 0.166227 11.9032 0 12.3548 0C12.8065 0 13.1935 0.1781 13.5161 0.534301C13.8387 0.890501 14 1.30607 14 1.781C14 2.25594 13.8387 2.6715 13.5161 3.0277L4.03226 13.5L13.5161 23.9723C13.8172 24.3048 13.9677 24.7141 13.9677 25.2005C13.9677 25.6878 13.8065 26.1095 13.4839 26.4657C13.1613 26.8219 12.7849 27 12.3548 27C11.9247 27 11.5484 26.8219 11.2258 26.4657Z" />
                                    </svg>
                                </button>
                                <h1 className='text-2xl tracking-wider'>KESHAN - UKT Hijau</h1>
                            </div>

                            {/* search and button add data */}
                            <div className="flex gap-x-3">
                                <div className="bg-purple rounded-md px-5 py-2 flex items-center gap-x-2 w-72">
                                    <svg className='z-50' width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.625 16.625C13.491 16.625 16.625 13.491 16.625 9.625C16.625 5.75901 13.491 2.625 9.625 2.625C5.75901 2.625 2.625 5.75901 2.625 9.625C2.625 13.491 5.75901 16.625 9.625 16.625Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M18.3746 18.3751L14.5684 14.5688" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <input className='bg-transparent placeholder:text-white placeholder:tracking-wider placeholder:text-sm w-full focus:outline-none' placeholder='Search' type="text" />
                                </div>

                                <button onClick={() => addModal()} className="bg-purple hover:bg-white hover:text-purple duration-300 rounded-md px-5 py-2 flex items-center gap-x-2">
                                    <h1>Tambah Soal</h1>
                                </button>
                            </div>
                        </div>

                        {/* wrapper total question and show answer */}
                        <div className="grid grid-cols-2 gap-x-5 text-white mb-5">

                            {/* total question */}
                            <div className="bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5">
                                <div className="bg-navy rounded-md px-5 py-2 text-center">
                                    <h1 className='font-semibold tracking-wider'>Total : {jumlah}</h1>
                                </div>
                            </div>

                            {/* show answer */}
                            <button onClick={() => handleAnswer()} className="bg-gradient-to-l from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5">
                                <div className="flex justify-center items-center gap-x-3 bg-navy rounded-md px-5 py-2 text-center">

                                    {(() => {
                                        if (showAnswer === false) {
                                            return (
                                                <svg className='-translate-y-0.5' fill="white" width="23" height="23" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.112,18.784l-2.153,2.156c-0.585,0.586 -0.585,1.536 0.001,2.121c0.586,0.585 1.536,0.585 2.121,-0.001l2.666,-2.668c1.898,0.983 4.19,1.806 6.773,2.041l0,3.567c0,0.828 0.672,1.5 1.5,1.5c0.828,-0 1.5,-0.672 1.5,-1.5l0,-3.571c2.147,-0.201 4.091,-0.806 5.774,-1.571l3.199,3.202c0.585,0.586 1.535,0.586 2.121,0.001c0.586,-0.585 0.586,-1.535 0.001,-2.121l-2.579,-2.581c2.59,-1.665 4.091,-3.369 4.091,-3.369c0.546,-0.622 0.485,-1.57 -0.137,-2.117c-0.622,-0.546 -1.57,-0.485 -2.117,0.137c0,-0 -4.814,5.49 -11.873,5.49c-7.059,0 -11.873,-5.49 -11.873,-5.49c-0.547,-0.622 -1.495,-0.683 -2.117,-0.137c-0.622,0.547 -0.683,1.495 -0.137,2.117c0,0 1.175,1.334 3.239,2.794Z" />
                                                </svg>
                                            )
                                        } else if (showAnswer === true) {
                                            return (
                                                <svg width="30" height="19" viewBox="0 0 34 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17 6.9C18.2296 6.9 19.4089 7.38464 20.2784 8.24731C21.1479 9.10998 21.6364 10.28 21.6364 11.5C21.6364 12.72 21.1479 13.89 20.2784 14.7527C19.4089 15.6154 18.2296 16.1 17 16.1C15.7704 16.1 14.5911 15.6154 13.7216 14.7527C12.8521 13.89 12.3636 12.72 12.3636 11.5C12.3636 10.28 12.8521 9.10998 13.7216 8.24731C14.5911 7.38464 15.7704 6.9 17 6.9ZM17 0C24.7273 0 31.3264 4.76867 34 11.5C31.3264 18.2313 24.7273 23 17 23C9.27273 23 2.67364 18.2313 0 11.5C2.67364 4.76867 9.27273 0 17 0ZM3.36909 11.5C4.61821 14.0305 6.55784 16.1625 8.96747 17.6537C11.3771 19.1448 14.1601 19.9354 17 19.9354C19.8399 19.9354 22.6229 19.1448 25.0325 17.6537C27.4422 16.1625 29.3818 14.0305 30.6309 11.5C29.3818 8.96953 27.4422 6.83752 25.0325 5.34634C22.6229 3.85517 19.8399 3.06464 17 3.06464C14.1601 3.06464 11.3771 3.85517 8.96747 5.34634C6.55784 6.83752 4.61821 8.96953 3.36909 11.5Z" fill="white" />
                                                </svg>
                                            )
                                        }
                                    })()}
                                    <h1 className='font-semibold tracking-wider'>Tampilkan Jawaban</h1>
                                </div>
                            </button>
                        </div>

                        {/* wrapper question list */}
                        {soal.map((item, index) => (
                            <KeSHanList
                                key={index}
                                id_soal={item.id_soal}
                                pertanyaan={item.pertanyaan}
                                opsi1={item.opsi1}
                                opsi2={item.opsi2}
                                opsi3={item.opsi3}
                                opsi4={item.opsi4}
                                kunciSoal={kunciSoal}
                                showAnswer={showAnswer}
                                onEdit={() => handleEdit(item)}
                                onDelete={() => deleteModal(item.id_soal)}
                            />
                        ))}

                    </div>
                    {/* akhir konten utama */}

                    {/* footer */}
                    <Footer />
                    {/* akhir footer */}

                </div>
                {/* akhir wrapper konten utama */}
            </div>

            {/* memanggil header */}
            <globalState.Provider value={{ showModalSoalKeSHan, setShowModalSoalKeSHan }}>
                <Modal_soal_keSHan
                    tipe="UKT Hijau"
                    action={action}
                    pertanyaan={pertanyaan}
                    setPertanyaan={setPertanyaan}
                    opsi={opsi}
                    setOpsi={setOpsi}
                    opsi1={opsi1}
                    setOpsi1={setOpsi1}
                    opsi2={opsi2}
                    setOpsi2={setOpsi2}
                    opsi3={opsi3}
                    setOpsi3={setOpsi3}
                    opsi4={opsi4}
                    setOpsi4={setOpsi4}
                    onSave={(e) => handleSave(e)}
                />
            </globalState.Provider>

            <globalState.Provider value={{ showModalDelete, setShowModalDelete }}>
                <Modal_soal_delete
                    onDelete={() => handleDelete()}
                />
            </globalState.Provider>
        </>
    )
}

export default ukt_hijau