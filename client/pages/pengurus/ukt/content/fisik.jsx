import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const fisik = (props) => {
    const [dataFisik, setDataFisik] = useState([])
    const [event, setEvent] = useState('')

    const getDataFisik = () => {
        const token = localStorage.getItem('token')
        const event = JSON.parse(localStorage.getItem('event'))
        setEvent(event.name)

        axios.get(BASE_URL + `fisik/ukt/${props.data?.tipe_ukt}/${event.id_event}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                console.log(res.data.data);
                setDataFisik(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    useEffect(() => {
        getDataFisik()
    }, [])
    return (
        <div className="min-h-full bg-darkBlue py-6">
            {dataFisik.length > 0
                ? <div className="bg-navy rounded-md py-2 px-3">

                    {/* table */}
                    <table className='w-full table-fixed'>
                        <thead>
                            <>
                                <tr className='text-white'>
                                    <th className='py-3 w-[5%]'>No</th>
                                    <th className='w-[30%]'>Nama</th>
                                    <th>Penguji</th>
                                    <th>MFT</th>
                                    <th>PUSH UP</th>
                                    <th>SPIR PERUT ATAS</th>
                                    <th>SPIR PERUT BAWAH</th>
                                    <th>SPIR DADA</th>
                                    <th>PLANK</th>
                                </tr>
                            </>

                        </thead>
                        <tbody>
                            {dataFisik.map((item, index) => (
                                <>
                                    <tr className='text-green text-center' key={item.id_fisik_detail}>
                                        <td className='border-b-2 text-white py-3 border-gray'>{item.siswa_fisik.nomor_urut}</td>
                                        <td className='border-b-2 text-white border-gray text-left'>{item.siswa_fisik.name}</td>
                                        <td className='border-b-2 text-white border-gray'>{item.penguji_fisik.name}</td>
                                        <td className='border-b-2 text-white border-gray text-lg font-bold'>{(item.mft).toFixed(1)}</td>
                                        <td className='border-b-2 text-white border-gray text-lg font-bold'>{item.push_up}</td>
                                        <td className='border-b-2 text-white border-gray text-lg font-bold'>{item.spir_perut_atas}</td>
                                        <td className='border-b-2 text-white border-gray text-lg font-bold'>{item.spir_perut_bawah}</td>
                                        <td className='border-b-2 text-white border-gray text-lg font-bold'>{item.spir_dada}</td>
                                        <td className='border-b-2 text-white border-gray text-lg font-bold'>{item.plank}</td>
                                    </tr>
                                </>
                            ))}

                        </tbody>

                    </table>
                </div>
                : <div className='text-center text-white'>
                    <h1 className='text-xl font-sans font-bold'> Silahkan masukkan data fisik siswa event: {event.name}</h1>
                </div>
            }
        </div>
    )
}

export default fisik