import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const sambung = (props) => {
    const [dataSambung, setDatasambung] = useState([])
    console.log(props.data?.tipe_ukt);
    const getDataSambung = () => {
        const token = localStorage.getItem('token')
        const event = JSON.parse(localStorage.getItem('event'))

        axios.get(BASE_URL + `sambung/ukt/${props.data?.tipe_ukt}/${event.id_event}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                console.log(res.data.data);
                setDatasambung(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }
    function TdComponent({ items }) {
        return items.map((item, index) => (
            <td key={item.id_senam} className='border-b-2 border-gray w-[40%]'>
                <div className="flex flex-row">
                    <div className="font-semibold w-3/4 bg-navy border-2 border-purple rounded-md rounded-br-none rounded-tr-none text-white py-1.5 px-2">
                    {item.sambung_siswa.nomor_urut} - {item.sambung_siswa.name}
                    </div>
                    <div className="flex items-center justify-center text-bold font-semibold w-[15%] bg-purple rounded-md rounded-l-none text-white py-1.5 px-2">
                            {item.nilai}
                    </div>
                </div>
            </td>
        ));
    }

    useEffect(() => {
        getDataSambung()
    }, [])

    return (
        <div className="min-h-screen bg-darkBlue h-screen">
            <div className="bg-navy rounded-md py-2 px-3 h-[70%]">

                {/* table */}
                <div className='h-full overflow-y-auto'>
                    <table className='w-full'>
                        <thead>
                            <tr className='text-white'>
                                <th className='py-3 w-[5%]'>No</th>
                                <th>Penguji</th>
                                <th>SISWA 1</th>
                                <th>SISWA 2</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataSambung.map((item, index) => (
                                <>
                                    <tr className='text-green text-center' key={item.id_sambung}>
                                        <td className='border-b-2 text-white py-3 border-gray'>{index + 1}</td>
                                        <td className='border-b-2 text-white border-gray '>{item.penguji_sambung.name}</td>
                                        <TdComponent items={(item.detail_sambung)} />
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

export default sambung