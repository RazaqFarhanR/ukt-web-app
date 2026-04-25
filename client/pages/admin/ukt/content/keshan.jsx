import React, { useEffect, useState, useRef, startTransition } from 'react'
import axios from 'axios'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Keshan = (props) => {
    const [dataUjian, setDataUjian] = useState([])
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const cache = useRef({});

    const getDataUjian = async () => {
        const cacheKey = `${props.data?.ranting}-${page}`;
        if (cache.current[cacheKey]) {
            const cached = cache.current[cacheKey];
            startTransition(() => {
                setDataUjian(cached.data);
                setTotalPages(cached.totalPages);
            });
            return;
        }

        setLoading(true);
        const event = JSON.parse(localStorage.getItem('event'));
        const token = localStorage.getItem('token');

        try {
            // Run both calls in parallel
            const [pagesRes, dataRes] = await Promise.all([
                axios.get(`${BASE_URL}session/pages/${event.id_event}/${props.data?.ranting}/25`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${BASE_URL}session/ukt/${event.id_event}/${props.data?.ranting}/${page}/25`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const result = { data: dataRes.data.data, totalPages: pagesRes.data.totalPages };
            cache.current[cacheKey] = result; // cache it
            startTransition(() => {
                setDataUjian(result.data);
                setTotalPages(result.totalPages);
            });
        } catch (err) {
            console.log(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Only re-fetch when ranting or page actually changes — not on every parent render
    useEffect(() => {
        getDataUjian();
    }, [page, props.data?.ranting]);

    // Reset to page 1 when ranting changes
    useEffect(() => {
        setPage(1);
    }, [props.data?.ranting]);

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
                        className={`mx-1 p-2 rounded ${i === page ? 'bg-blue text-white' : 'bg-gray text-white'
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
                        className={`mx-1 p-2 rounded ${i === page ? 'bg-blue text-white' : 'bg-gray text-white'
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
            <td key={index + 1} className='px-3 border-b-2 border-gray uppercase text-left w-[30rem]'>
                {item?.soal_ujian?.pertanyaan}
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

    return (
        <div className="min-h-screen bg-darkBlue h-screen">
            {loading && (
                <div className="text-white text-center py-4">Loading...</div>
            )}
            <div className="bg-navy rounded-md py-2 px-3 h-[65%]">

                {/* table */}
                <div className='overflow-x-scroll h-full relative'>
                    {loading && (
                        <div className="absolute inset-0 bg-navy bg-opacity-70 flex justify-center items-center z-10">
                            <svg className="animate-spin h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                        </div>
                    )}

                    {!props.data?.ranting ? (
                        <div className="flex flex-col items-center justify-center h-64 text-white">
                            <svg className="w-20 h-20 mb-4 opacity-40" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            <p className="text-2xl font-semibold tracking-wide">Silakan pilih ranting terlebih dahulu untuk menampilkan data.</p>
                        </div>
                    ) : dataUjian?.length === 0 && !loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-white">
                            <svg className="w-20 h-20 mb-4 opacity-40" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            <p className="text-2xl font-semibold tracking-wide">Tidak ada data nilai KeSHAN yang ditemukan untuk ranting ini.</p>
                        </div>
                    ) : (
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
                    )}
                </div>


            </div>

        </div>
    )
}

export default Keshan