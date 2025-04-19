import { globalState } from '@/context/context'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Modal_Password = () => {

    //  state Modal  // 
    const { showModalPassword, setShowModalPassword } = useContext(globalState);

    // state 
    const [niw, setNiw] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [idPenguji, setIdPenguji] = useState(0)
    const [alertPassword, setAlertPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmitNiw = async (e) => {
        e.preventDefault()

        const token = localStorage.getItem('tokenPenguji')

        await axios.get(BASE_URL + `penguji/NIW/${niw}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                if (res.data.data.length > 0) {
                    console.log(res.data.data[0])
                    const data = res.data.data[0]

                    setIdPenguji(data.id_penguji)
                } else {
                    window.alert(res.data.message)
                }
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    const handleSubmitPassword = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('tokenPenguji')

        if(!alertPassword){
            if(password){
                await axios.put(BASE_URL + `penguji/${idPenguji}`, {
                    password: password
                }, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    window.alert('password berhasil diganti')
                    console.log(res)
                    setShowModalPassword(false)
                })
                .catch(err => {
                    console.log(err.message);
                })
            }
        }        
    }

    useEffect(() => {
        password === password2 ? setAlertPassword(false) : setAlertPassword(true)
    }, [password, password2])

    return (
        <>
            {showModalPassword ? (
                <>
                    {/* Main modal */}
                    <div className="fixed flex justify-center top-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0">
                        <div className="relative w-full h-full max-w-2xl md:h-auto">
                            {/* Modal content */}
                            <div className="relative bg-navy text-white rounded-lg shadow">

                                {/* Modal header */}
                                <div className="flex justify-center p-4">
                                    <div className="bg-navy rounded-md p-3 text-white mb-3 shadow shadow-slate-700 hover:shadow-purple hover:scale-105 transition ease-in-out duration-300">
                                        <h1 className='text-xl font-semibold'>
                                            Lupa Password
                                        </h1>
                                    </div>
                                    <button onClick={() => setShowModalPassword(false)} type="button" className="p-1.5 inline-flex items-center absolute right-5">
                                        <svg className="w-7 h-7 fill-white hover:fill-purple duration-300" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
                                            </path>
                                        </svg>
                                    </button>
                                </div>

                                {/* Modal body */}
                                <div className="px-6 py-2 space-y-3">

                                    {idPenguji > 0
                                        ? <>
                                            {/* Masukkan NIW */}
                                            <h1 className='text-lg tracking-wide text-green mb-5'>Masukkan Password</h1>

                                            <form action="POST" onSubmit={handleSubmitPassword}>

                                                {/* wrapper password */}
                                                <h1> Masukkan Password Baru</h1>
                                                <div className="hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5 w-full mb-4">
                                                    <div className="bg-darkBlue rounded-md p-2 flex items-center gap-x-3">
                                                        <svg width="23" height="23" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M23.75 13.75H6.25C4.86929 13.75 3.75 14.8693 3.75 16.25V25C3.75 26.3807 4.86929 27.5 6.25 27.5H23.75C25.1307 27.5 26.25 26.3807 26.25 25V16.25C26.25 14.8693 25.1307 13.75 23.75 13.75Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M8.75 13.75V8.75C8.75 7.0924 9.40848 5.50269 10.5806 4.33058C11.7527 3.15848 13.3424 2.5 15 2.5C16.6576 2.5 18.2473 3.15848 19.4194 4.33058C20.5915 5.50269 21.25 7.0924 21.25 8.75V13.75" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <input
                                                            className="w-full px-2 bg-darkBlue focus:outline-none border-b-2 border-gray focus:border-purple transition ease-in-out duration-300"
                                                            placeholder="Password"
                                                            type={showPassword ? "text" : "password"}
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                        />
                                                        <button className="show-password-button" onClick={toggleShowPassword}>
                                                            {showPassword ? "Hide" : "Show"}
                                                        </button>
                                                    </div>
                                                </div>
                                                {/* wrapper password */}
                                                <h1>Ulangi Password Baru</h1>
                                                <div className="hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5 w-full mb-4">
                                                    <div className="bg-darkBlue rounded-md p-2 flex items-center gap-x-3">
                                                        <svg width="23" height="23" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M23.75 13.75H6.25C4.86929 13.75 3.75 14.8693 3.75 16.25V25C3.75 26.3807 4.86929 27.5 6.25 27.5H23.75C25.1307 27.5 26.25 26.3807 26.25 25V16.25C26.25 14.8693 25.1307 13.75 23.75 13.75Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M8.75 13.75V8.75C8.75 7.0924 9.40848 5.50269 10.5806 4.33058C11.7527 3.15848 13.3424 2.5 15 2.5C16.6576 2.5 18.2473 3.15848 19.4194 4.33058C20.5915 5.50269 21.25 7.0924 21.25 8.75V13.75" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <input className='w-full px-2 bg-darkBlue focus:outline-none border-b-2 border-gray focus:border-purple transition ease-in-out duration-300' placeholder='Password' type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                                                    </div>
                                                </div>

                                                {alertPassword ? <h1 className='italic text-red'>password tidak sama</h1> : ""}
                                            </form>

                                            <form className='w-full' action="POST" onSubmit={handleSubmitPassword}>

                                                {/* button submit */}
                                                <button type='submit' className='bg-purple py-1.5 w-full lg:w-1/4 rounded-md text-lg font-semibold hover:scale-105 transition ease-in-out duration-300'>Submit</button>
                                            </form>
                                        </>
                                        : <>
                                            {/* Masukkan NIW */}
                                            <h1 className='text-lg tracking-wide text-green mb-5'>Masukkan NIW</h1>

                                            <form action="POST" onSubmit={handleSubmitNiw}>

                                                {/* wrapper NIW */}
                                                <div className="hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5 w-full mb-4">
                                                    <div className="bg-darkBlue rounded-md p-2 flex items-center gap-x-3">
                                                        <svg width="23" height="23" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M25 26.25V23.75C25 22.4239 24.4732 21.1521 23.5355 20.2145C22.5979 19.2768 21.3261 18.75 20 18.75H10C8.67392 18.75 7.40215 19.2768 6.46447 20.2145C5.52678 21.1521 5 22.4239 5 23.75V26.25" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M15 13.75C17.7614 13.75 20 11.5114 20 8.75C20 5.98858 17.7614 3.75 15 3.75C12.2386 3.75 10 5.98858 10 8.75C10 11.5114 12.2386 13.75 15 13.75Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <input className='w-full px-2 bg-darkBlue focus:outline-none border-b-2 border-gray focus:border-purple transition ease-in-out duration-300' placeholder='Niw' type="text" value={niw} onChange={(e) => setNiw(e.target.value)} />
                                                    </div>
                                                </div>
                                            </form>

                                            <form className='w-full' action="POST" onSubmit={handleSubmitNiw}>

                                                {/* button submit */}
                                                <button type='submit' className='bg-purple py-1.5 w-full lg:w-1/4 rounded-md text-lg font-semibold hover:scale-105 transition ease-in-out duration-300'>Submit</button>
                                            </form>
                                        </>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-black opacity-70 fixed inset-0 z-40"></div>
                </>

            ) : null}
        </>
    )
}

export default Modal_Password