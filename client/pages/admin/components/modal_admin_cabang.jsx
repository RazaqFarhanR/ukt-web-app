import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { globalState } from '@/context/context'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const modal_admin_cabang = () => {

    // state modal
    const {showModalAdminCabang, setShowModalAdminCabang} = useContext (globalState)

    // state
    // const {dataAdminCabang, setDataAdminCabang} = useContext (globalState)
    const {setDataAdminCabang, action, idAdminCabang} = useContext (globalState)
    const {niw, setNiw} = useContext (globalState)
    const {name, setName} = useContext (globalState)
    const {ranting, setRanting} = useContext (globalState)
    const {username, setUsername} = useContext (globalState)
    const {password, setPassword} = useContext (globalState)
    const {noWa, setNoWa} = useContext (globalState)
    const {role, setRole} = useContext (globalState)
    const {foto, setFoto} = useContext (globalState)

    // function get data admin cabang
    const getDataAdminCabang = () => {
        const token = localStorage.getItem ('token')
        axios.get (BASE_URL + `user`, { headers: { Authorization: `Bearer ${token}`}})
        .then (res => {
            setDataAdminCabang (res.data.data)
        })
        .catch (err => {
            console.log(err.message);
        })
    }

    // function handle file photo profile
    const handleFile = (e) => {
        e.preventDefault ()
        setFoto (e.target.files [0])
    }

    // function handle add and edit data
    const handleSave = (e) => {
        e.preventDefault()

        const token = localStorage.getItem ('token')

        let form = new FormData()
        form.append ('niw', niw)
        form.append ('name', name)
        form.append ('id_ranting', ranting)
        form.append ('username', username)
        form.append ('password', password)
        form.append ('no_wa', noWa)
        form.append ('id_role', role)
        form.append ('foto', foto)

        if (action === 'insert') {
            axios.post (BASE_URL + `user`, form, { headers: { Authorization: `Bearer ${token}`}})
            .then (res => {
                getDataAdminCabang ()
                setShowModalAdminCabang (false)
                console.log(res.data.message);
            })
            .catch (err => {
                console.log(err.message);
            })
        } else if (action === 'update') {
            axios.put (BASE_URL + `user/${idAdminCabang}`, form, { headers: { Authorization: `Bearer ${token}`}})
            .then (res => {
                getDataAdminCabang ()
                setShowModalAdminCabang (false)
                console.log(res.data.message);
                console.log('berhasil');
            })
            .catch (err => {
                console.log(err.message);
                console.log('gagal edit');
            })
        }
    }

    return (
        <>
        {showModalAdminCabang ? (
            <>
                {/* Main modal */}
                <div className="fixed flex justify-center top-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0">
                    <div className="relative w-full h-full max-w-2xl md:h-auto">
                        
                        {/* Modal content */}
                        <div className="relative bg-navy text-white rounded-lg shadow">

                            <form action='POST' onSubmit={handleSave}>

                                {/* Modal header */}
                                <div className="flex justify-center p-4">
                                    {(() => {
                                        if (action === 'insert') {
                                            return(
                                                <h1 className="text-2xl font-semibold text-gray-900 text-center">
                                                    Tambah Admin Cabang
                                                </h1>
                                            )
                                        } else if (action === 'update') {
                                            return (
                                                <h1 className="text-2xl font-semibold text-gray-900 text-center">
                                                    Edit Admin Cabang
                                                </h1>
                                            )
                                        }
                                    })()}
                                    <button onClick={() => setShowModalAdminCabang(false)} type="button" className="p-1.5 inline-flex items-center absolute right-5">
                                        <svg className="w-7 h-7 fill-white hover:fill-purple duration-300" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
                                            </path>
                                        </svg>  
                                    </button>
                                </div>

                                {/* Modal body */}
                                <div className="px-6 py-2 space-y-3">

                                    {/* Input niw */}
                                    <div className="flex flex-row space-x-3 w-full">
                                        <div className="w-2/6 flex justify-between">
                                            <span>NIW</span>
                                            <span>:</span>
                                        </div>
                                        <div className="w-4/6">
                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                            type="number"
                                            value={niw}
                                            onChange={(e) => setNiw(e.target.value)}
                                            required
                                            >        
                                            </input>
                                        </div>
                                    </div>

                                    {/* Input nama */}
                                    <div className="flex flex-row space-x-3 w-full">
                                        <div className="w-2/6 flex justify-between">
                                            <span>Nama</span>
                                            <span>:</span>
                                        </div>
                                        <div className="w-4/6">
                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            >        
                                            </input>
                                        </div>
                                    </div>

                                    {/* Input ranting */}
                                    <div className="flex flex-row space-x-3 w-full">
                                        <div className="w-2/6 flex justify-between">
                                            <span>Ranting</span>
                                            <span>:</span>
                                        </div>
                                        <div className="w-4/6">
                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                            type="text"
                                            value={ranting}
                                            onChange={(e) => setRanting(e.target.value)}
                                            required
                                            >        
                                            </input>
                                        </div>
                                    </div>

                                    {/* Input no wa */}
                                    <div className="flex flex-row space-x-3 w-full">
                                        <div className="w-2/6 flex justify-between">
                                            <span>No Wa</span>
                                            <span>:</span>
                                        </div>
                                        <div className="w-4/6">
                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                            type="number"
                                            value={noWa}
                                            onChange={(e) => setNoWa(e.target.value)}
                                            required
                                            >        
                                            </input>
                                        </div>
                                    </div>

                                    {/* Input foto */}
                                    <div className="flex flex-row space-x-3 w-full">
                                        <div className="w-2/6 flex justify-between">
                                            <span>Foto</span>
                                            <span>:</span>
                                        </div>
                                        <div className="w-4/6">
                                            <input className='w-full file:bg-gray file:text-white file:px-5 bg-darkBlue rounded-md focus:outline-none'
                                            type="file"
                                            onChange={(e) => handleFile(e)}
                                            // required
                                            >        
                                            </input>
                                        </div>
                                    </div>

                                    {/* Input username */}
                                    <div className="flex flex-row space-x-3 w-full">
                                        <div className="w-2/6 flex justify-between">
                                            <span>Username</span>
                                            <span>:</span>
                                        </div>
                                        <div className="w-4/6">
                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            >        
                                            </input>
                                        </div>
                                    </div>

                                    {/* Input password */}
                                    <div className="flex flex-row space-x-3 w-full">
                                        <div className="w-2/6 flex justify-between">
                                            <span>Password</span>
                                            <span>:</span>
                                        </div>
                                        <div className="w-4/6">
                                            <input className='w-full bg-darkBlue rounded-md focus:outline-none px-2'
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            >        
                                            </input>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal footer */}
                                <div className="flex items-center justify-end p-6 space-x-2">
                                    <button onClick={() => setShowModalAdminCabang(false)} className="text-red hover:text-white bg-white hover:bg-red duration-300 font-medium rounded-lg px-5 py-2.5 text-center">Cancel</button>
                                    {(() => {
                                        if (action === 'insert') {
                                            return (
                                                <button type='submit' className="text-green hover:text-white bg-white hover:bg-green duration-300 rounded-lg font-medium px-5 py-2.5 focus:z-10">Tambah</button>
                                            )
                                        } else if (action === 'update') {
                                            return (
                                                <button type='submit' className="text-green hover:text-white bg-white hover:bg-green duration-300 rounded-lg font-medium px-5 py-2.5 focus:z-10">Edit</button>
                                            )
                                        }
                                    })()}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="bg-black opacity-70 fixed inset-0 z-40"></div>
            </>

        ): null}
        </>
    )
}

export default modal_admin_cabang