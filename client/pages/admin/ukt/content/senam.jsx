import React, { useEffect, useState } from 'react'
import axios from 'axios'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const senam = (props) => {
    const [dataSenam, setDataSenam] = useState([])
    const getDataSenam = () => {
        const event = JSON.parse(localStorage.getItem('event'))
        const token = localStorage.getItem('token')
        axios.get(BASE_URL + `senam_detail/ukt/${event.id_event}/${props.data?.ranting}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setDataSenam(res.data.data)
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    function ThComponent({ items }) {
        let limit = items.length + 1
        let banding = 1;
        banding < limit;
        return items.map((item) => (
            <th key={banding}>{banding++}</th>
        ));
    }

    function TdComponent({ items }) {
        return items.map((item, index) => (
            <td key={index + 1} className='px-3 border-b-2 border-gray uppercase'>{item.siswa_senam.name}
                {item.predikat === true && (
                    <div className="font-semibold bg-purple rounded-md text-white py-1.5 px-12 uppercase">
                        benar
                    </div>
                )}
                {item.predikat === false && (
                    <div className="font-semibold bg-red rounded-md text-white py-1.5 px-12 uppercase">
                        salah
                    </div>
                )}
                {item.predikat === 2 && (
                    <div className="border-gray rounded-md p-0.5 col-span-4">
                        <div className="font-semibold bg-green rounded-md text-white py-1 px-10 uppercase">
                            +
                        </div>
                    </div>
                )}
                {item.predikat === null && (
                    <div className="bg-purple rounded-md p-0.5 col-span-4">
                        <div className="font-semibold bg-navy rounded-md text-white py-1 px-10 uppercase">
                                
                        </div>
                    </div>
                )}
            </td>
        ));
    }
    useEffect(() => {
        getDataSenam()
    }, [props])

    return (
        <div className="min-h-screen bg-darkBlue h-screen">
            <div className="bg-navy rounded-md py-2 h-[70%]">

                {/* table */}
                <div className='overflow-x-auto h-full bg-navy'>
                    <table className='w-max'>
                        <thead className='sticky top-0 bg-black'>
                            <tr className='text-white'>
                                <th className='py-3 w-20 px-5'>No</th>
                                <th className='w-30 px-20'>Nama</th>
                                <th className='w-30 px-20'>Penguji</th>
                                {dataSenam?.slice(0, 1).map((item, index) => (
                                    <ThComponent items={item.siswa_senam_detail} key={index + 1} />
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dataSenam?.map((item, index) => (
                                <tr className='text-green text-center' key={item.id_senam_detail}>
                                    <td className='border-b-2 text-white py-3 border-gray'>{item.senam_siswa.nomor_urut}</td>
                                    <td className='border-b-2 text-white border-gray text-left'>{item.senam_siswa.name}</td>
                                    <td className='border-b-2 text-white border-gray'>{item.penguji_senam.name}</td>
                                    <TdComponent items={item.siswa_senam_detail} key={index + 1} />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default senam