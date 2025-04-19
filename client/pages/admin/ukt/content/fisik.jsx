import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const fisik = (props) => {
    const [dataFisik, setDataFisik] = useState([])
    const [event, setEvent] = useState('')
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState();

    const renderPageNumbers = () => {
        const pages = [];

        // Generate page numbers based on the total number of pages
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || i === page) {
                // Show the first, last, and current page numbers
                pages.push(
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`mx-1 p-2 rounded ${i === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-white'
                            }`}
                    >
                        {i}
                    </button>
                );
            } else if (
                i >= page - 5 &&
                i <= page + 5 &&
                (i % 10 !== 0 || Math.abs(page - i) <= 10)
            ) {
                // Show the page numbers within a range of 10 from the current page
                pages.push(
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`mx-1 p-2 rounded ${i === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-white'
                            }`}
                    >
                        {i}
                    </button>
                );
            } else if (
                (i === page - 10 && page > 15) ||
                (i === page + 10 && page < totalPages - 15)
            ) {
                // Show a dot for every 10 numbers before or after the current page
                pages.push(
                    <span key={i} className="mx-1 p-2">
                        ...
                    </span>
                );
            }
        }

        return pages;
    };

    const getDataFisik = () => {
        const token = localStorage.getItem('token')
        const event = JSON.parse(localStorage.getItem('event'))
        setEvent(event.name)
        axios.get(BASE_URL + `fisik/pages/${event.id_event}/50`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setTotalPages(res.data.totalPages);
            })
            .catch(err => {
                console.log(err.message);
            })

        axios.get(BASE_URL + `fisik/event/${event.id_event}/${page}/50`, { headers: { Authorization: `Bearer ${token}` } })
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
    }, [page])
    return (
        <div className="min-h-screen bg-darkBlue py-6 h-screen">
            {dataFisik.length > 0
                ? <div className="bg-navy rounded-md py-2 h-[65%]">

                    {/* table */}
                    <div className='overflow-x-scroll h-full bg-navy'>
                        <table className='w-full table-fixed'>
                            <thead className='sticky top-0 bg-black'>
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
                                        <th>SPIR PAHA</th>
                                        <th>PLANK</th>
                                    </tr>
                                </>

                            </thead>
                            <tbody>
                                {dataFisik.map((item, index) => (
                                    <>
                                        <tr className='text-green text-center' key={item.id_fisik_detail}>
                                            <td className='border-b-2 text-white py-3 border-gray'>{((page - 1) * 50) + index + 1}</td>
                                            <td className='border-b-2 text-white border-gray text-left'>{item.siswa_fisik.name}</td>
                                            <td className='border-b-2 text-white border-gray'>{item.penguji_fisik.name}</td>
                                            <td className='border-b-2 text-white border-gray text-lg font-bold'>{(item.mft).toFixed(1)}</td>
                                            <td className='border-b-2 text-white border-gray text-lg font-bold'>{item.push_up}</td>
                                            <td className='border-b-2 text-white border-gray text-lg font-bold'>{item.spir_perut_atas}</td>
                                            <td className='border-b-2 text-white border-gray text-lg font-bold'>{item.spir_perut_bawah}</td>
                                            <td className='border-b-2 text-white border-gray text-lg font-bold'>{item.spir_dada}</td>
                                            <td className='border-b-2 text-white border-gray text-lg font-bold'>{item.spir_paha}</td>
                                            <td className='border-b-2 text-white border-gray text-lg font-bold'>{item.plank}</td>
                                        </tr>
                                    </>
                                ))}

                            </tbody>

                        </table>
                    </div>

                </div>
                : <div className='text-center text-white'>
                    <h1 className='text-xl font-sans font-bold'> Silahkan masukkan data fisik siswa event: {event.name}</h1>
                </div>
            }
            <div className="flex justify-center mt-5">
                {renderPageNumbers()}
            </div>
        </div>
    )
}

export default fisik