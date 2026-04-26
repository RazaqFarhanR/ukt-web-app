import React, { useEffect, useState, useRef, startTransition } from 'react'
import Link from 'next/link'
import axios from 'axios'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const teknik = (props) => {
    const [listJurus, setListJurus] = useState([])
    const [dataTeknik, setDataTeknik] = useState([])
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [itemsPerPage] = useState(25);
    const cache = useRef({});

    const getDataListJurus = async () => {
        const token = localStorage.getItem('token')
        try {
            const res = await axios.get(BASE_URL + `jurus_toya_detail/list`, {
                headers:
                    { Authorization: `Bearer ${token}` }
            })
            setListJurus(res.data.data)
        } catch (err) {
            console.log(err.message);
        }
    }

    const getDataTeknik = async () => {
        const cacheKey = `${props.data?.ranting}-${page}`;
        if (cache.current[cacheKey]) {
            const cached = cache.current[cacheKey];
            startTransition(() => {
                setDataTeknik(cached.data);
                setTotalPages(cached.totalPages);
            });
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token')
        const event = JSON.parse(localStorage.getItem('event'))

        try {
            const res = await axios.get(BASE_URL + `teknik_detail/event/${event.id_event}/${props.data?.ranting}`, { headers: { Authorization: `Bearer ${token}` } })
            const allData = res.data.data;
            setDataTeknik(allData);
        } catch (err) {
            console.log(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getDataListJurus()
    }, [])
    useEffect(() => {
        getDataTeknik()
    }, [page, props.data?.ranting])

    // Reset to page 1 when ranting changes
    useEffect(() => {
        setPage(1);
    }, [props.data?.ranting]);

    const renderPageNumbers = () => {
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || i === page) {
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
        return items.map((item) => (
            <th key={item.id_teknik} className='px-3 '>
                <div className={"font-semibold text-white py-1.5 px-12 uppercase"}>{item.name}</div></th>
        ));;
    }

    function TdComponent({ items }) {
        return items.map((item) => (
            <td key={item.id_teknik} className='px-3 border-b-2 border-gray'>
                <div className={"font-semibold bg-purple rounded-md text-white py-1.5 px-12"}>{item.predikat}</div></td>
        ));
    }

    return (
        <div className="min-h-screen bg-darkBlue py-6 h-screen">
            {loading && (
                <div className="text-white text-center py-4">Loading...</div>
            )}
            <div className="bg-navy rounded-md py-2 h-[70%]">

                {/* table */}
                <div className='overflow-x-scroll h-full bg-navy relative'>
                    {loading && (
                        <div className="absolute inset-0 bg-navy bg-opacity-70 flex justify-center items-center z-10">
                            <svg className="animate-spin h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                        </div>
                    )}
                    <table className='w-max'>
                        <thead className='sticky top-0 bg-black'>
                            <>
                                <tr className='text-white'>
                                    <th className='py-3 w-5 px-5'>No</th>
                                    <th className='w-30 px-20'>Nama</th>
                                    <th className='w-30 px-20'>Penguji</th>
                                    {listJurus?.slice(0, 1).map((item, index) => (
                                        <ThComponent items={listJurus} key={index + 1} />
                                    ))}
                                </tr>
                            </>

                        </thead>
                        <tbody>
                            {dataTeknik.map((item, index) => (
                                <>
                                    <tr className='text-green text-center' key={item.id_teknik_detail}>
                                        <td className='border-b-2 text-white py-3 border-gray'>{index + 1}</td>
                                        <td className='border-b-2 text-white border-gray '>{item?.siswa?.nama}</td>
                                        <td className='border-b-2 text-white border-gray '>{item?.penguji}</td>
                                        <TdComponent items={(item?.detail)} key={index + 1} />
                                    </tr>
                                </>
                            ))}

                        </tbody>

                    </table>
                </div>

                {/* <div className="flex justify-center mt-5">
                    {renderPageNumbers()}
                </div> */}
            </div>
        </div>
    )
}

export default teknik
