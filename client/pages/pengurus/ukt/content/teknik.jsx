import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const teknik = (props) => {
    const [dataTeknik, setDataTeknik] = useState([])
    console.log(props.data?.tipe_ukt);
    const getDataTeknik = () => {
        const token = localStorage.getItem('token')
        const event = JSON.parse(localStorage.getItem('event'))

        axios.get(BASE_URL + `teknik_detail/ukt/${props.data?.tipe_ukt}/${event.id_event}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                console.log(res.data.data[0].siswa_teknik_detail.length);
                setDataTeknik(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    function ThComponent({ items }) {
        return items.map((item) => (
            <th key={item.id_teknik} className='px-3 '>
            <div className={"font-semibold text-white py-1.5 px-12 uppercase"}>{item.siswa_teknik.name}</div></th>
        ));;
    }

    function TdComponent({ items }) {
        return items.map((item) => (
            <td key={item.id_teknik} className='px-3 border-b-2 border-gray'>
            <div className={"font-semibold bg-purple rounded-md text-white py-1.5 px-12"}>{item.predikat}</div></td>
        ));
    }
    useEffect(() => {
        getDataTeknik()
    }, [])

    return (
        <div className="min-h-full bg-darkBlue py-6">

            <div className="bg-navy rounded-md py-2 px-3">

                {/* table */}
                <div className='overflow-x-scroll'>
                <table className='w-max'>
                    <thead>
                        <>
                            <tr className='text-white'>
                                <th className='py-3 w-5 px-5'>No</th>
                                <th className='w-30 px-20'>Nama</th>
                                <th className='w-30 px-20'>Penguji</th>
                                {dataTeknik.slice(0, 1).map((item, index) => (     
                                <ThComponent items={(item.siswa_teknik_detail) } key={index + 1}/>
                                ))}
                            </tr>
                        </>

                    </thead>
                    <tbody>
                        {dataTeknik.map((item, index) => (
                            <>
                                <tr className='text-green text-center' key={item.id_teknik_detail}>
                                    <td className='border-b-2 text-white py-3 border-gray'>{index + 1}</td>
                                    <td className='border-b-2 text-white border-gray '>{item.teknik_siswa.name}</td>
                                    <td className='border-b-2 text-white border-gray '>{item.penguji_teknik.name}</td>
                                    <TdComponent items={(item.siswa_teknik_detail)} key={index + 1}/>
                                </tr>
                            </>
                        ))}

                    </tbody>

                </table>
                </div>
            </div>
        </div>
    )
}

export default teknik