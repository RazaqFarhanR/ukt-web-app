import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { globalState } from '@/context/context'
import Modal_Password from './components/modal_password';
import { toast } from "react-hot-toast";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const loginPage = () => {
    
    // deklarasi router
    const router = useRouter()

    // state modal
    const [showModalPassword, setShowModalPassword] = useState(false);

    // state
    const [username, setUsername] = useState ('')
    const [password, setPassword] = useState ('')

    const login = async (e) => {
        e.preventDefault()

        let form = {
            username : username,
            password : password
        }

        const toastId = toast.loading("Sedang masuk...");

        try {
            const res = await axios.post(`${BASE_URL}penguji/auth`, form);
        
            if (res.data.logged) {
              const { data, token } = res.data;
        
              localStorage.setItem("penguji", JSON.stringify(data));
              localStorage.setItem("tokenPenguji", token);
        
              toast.success("Login berhasil!", { id: toastId });
              router.push("/penguji");
            } else {
              toast.error(res.data.message || "Login gagal", { id: toastId });
            }
          } catch (err) {
            toast.error(err.response.data.message, { id: toastId });
            // console.error(err);
          }
    }
    
    return (
        <>
            <div className="font-lato">

                {/* awal wrapper konten utama */}
                <div className="w-full h-screen">

                    {/* konten utama */}
                    <div className="min-h-full bg-darkBlue px-10 py-20">
                        <div className="text-white flex flex-col justify-center items-center text-center">

                            {/* psht icon */}
                            <img className='w-32 mb-4' src="/images/psht-icon.png" alt="" />

                            {/* title */}
                            <h1 className='text-xl font-semibold mb-12'>Uji Kenaikan Tingkat Cabang Trenggalek</h1>

                            <h1 className='text-lg tracking-wide text-green mb-5'>Login Penguji</h1>

                            <form action="POST" onSubmit={login}>

                                {/* wrapper username */}
                                <div className="hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5 w-full mb-4">
                                    <div className="bg-darkBlue rounded-md p-2 flex items-center gap-x-3">
                                        <svg width="23" height="23" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M25 26.25V23.75C25 22.4239 24.4732 21.1521 23.5355 20.2145C22.5979 19.2768 21.3261 18.75 20 18.75H10C8.67392 18.75 7.40215 19.2768 6.46447 20.2145C5.52678 21.1521 5 22.4239 5 23.75V26.25" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M15 13.75C17.7614 13.75 20 11.5114 20 8.75C20 5.98858 17.7614 3.75 15 3.75C12.2386 3.75 10 5.98858 10 8.75C10 11.5114 12.2386 13.75 15 13.75Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <input className='w-full px-2 bg-darkBlue focus:outline-none border-b-2 border-gray focus:border-purple transition ease-in-out duration-300' placeholder='Username' type="text" value={username} onChange={(e) => setUsername (e.target.value)} />
                                    </div>
                                </div>

                                {/* wrapper password */}
                                <div className="hover:bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] rounded-md p-0.5 w-full mb-4">
                                    <div className="bg-darkBlue rounded-md p-2 flex items-center gap-x-3">
                                        <svg width="23" height="23" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M23.75 13.75H6.25C4.86929 13.75 3.75 14.8693 3.75 16.25V25C3.75 26.3807 4.86929 27.5 6.25 27.5H23.75C25.1307 27.5 26.25 26.3807 26.25 25V16.25C26.25 14.8693 25.1307 13.75 23.75 13.75Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8.75 13.75V8.75C8.75 7.0924 9.40848 5.50269 10.5806 4.33058C11.7527 3.15848 13.3424 2.5 15 2.5C16.6576 2.5 18.2473 3.15848 19.4194 4.33058C20.5915 5.50269 21.25 7.0924 21.25 8.75V13.75" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <input className='w-full px-2 bg-darkBlue focus:outline-none border-b-2 border-gray focus:border-purple transition ease-in-out duration-300' placeholder='Password' type="password" value={password} onChange={(e) => setPassword (e.target.value)} />
                                    </div>
                                </div>
                            </form>

                            {/* forget password */}
                            <button onClick={() => setShowModalPassword(true)}
                            className='text-[15px] tracking-wider text-gray hover:text-white duration-300 transition ease-in-out mb-5'>Forget Password?</button>
                            
                            <form className='w-full' action="POST" onSubmit={login}>

                                {/* button submit */}
                                <button type='submit' className='bg-purple py-1.5 w-full lg:w-1/4 rounded-md text-lg font-semibold hover:scale-105 transition ease-in-out duration-300'>Login</button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>

            <globalState.Provider value={{ showModalPassword, setShowModalPassword}}>
                <Modal_Password />
            </globalState.Provider>
        </>
    )
}

export default loginPage