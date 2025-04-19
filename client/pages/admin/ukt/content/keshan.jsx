import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const keshan = (props) => {
    const [dataUjian, setDataUjian] = useState([])
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState();

    const getDataUjian = () => {
        const event = JSON.parse(localStorage.getItem('event'))
        const token = localStorage.getItem('token')

        console.log(event);
        axios.get(BASE_URL + `session/pages/${event.id_event}/25`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setTotalPages(res.data.totalPages);
                console.log(res);
            })
            .catch(err => {
                // console.log(err.response.data);
                console.log(err.message);
            })
        axios.get(BASE_URL + `session/ukt/${event.id_event}/${page}/25`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setDataUjian(res.data.data)
                console.log(res);
            })
            .catch(err => {
                // console.log(err.response.data);
                console.log(err.message);
            })
    }
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
            <td key={index + 1} className='px-3 border-b-2 border-gray uppercase text-left w-[30rem]'>{item.soal_ujian.pertanyaan}
                {item.answer === 'benar' && (
                    <div className="font-semibold bg-purple rounded-md text-white py-1.5 px-12 uppercase flex justify-center my-2">
                        benar
                    </div>
                )}
                {item.answer === 'salah' && (
                    <div className="font-semibold bg-red rounded-md text-white py-1.5 px-12 uppercase flex justify-center my-2">
                        salah
                    </div>
                )}
                {item.answer === 'kosong' && (
                    <div className="bg-purple rounded-md p-0.5 col-span-4 my-2">
                        <div className="font-semibold bg-navy rounded-md text-white py-1 px-10 uppercase">

                        </div>
                    </div>
                )}
            </td>
        ));
    }
    useEffect(() => {
        getDataUjian()
    }, [page])

    return (
        <div className="min-h-screen bg-darkBlue h-screen">
            <div className="bg-navy rounded-md py-2 px-3 h-[65%]">

                {/* table */}
                <div className='overflow-x-scroll h-full'>
                    <table className='w-max'>
                        <thead className='sticky top-0 bg-black'>
                            <tr className='text-white'>
                                <th className='py-3 w-20'>No</th>
                                <th className='w-[26rem] px-5'>Nama</th>
                                {dataUjian?.slice(0, 1).map((item, index) => (
                                    <ThComponent items={item.lembar_jawaban} key={index + 1} />
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dataUjian?.map((item, index) => (
                                <tr className='text-green text-center h-fit' key={item.keshan_siswa.nomor_uru}>
                                    <td className='border-b-2 text-white py-3 border-gray'>{item.keshan_siswa.nomor_urut}</td>
                                    <td className='border-b-2 text-white border-gray text-center text-lg'>{item.keshan_siswa.name}</td>
                                    <TdComponent items={item.lembar_jawaban} key={index + 1} />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center mt-5">
                    {renderPageNumbers()}
                </div>
            </div>

        </div>
    )
}

export default keshan