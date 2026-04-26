import React, { useEffect, useState, useRef, startTransition } from 'react'
import axios from 'axios'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Keshan = (props) => {
    const [dataUjian, setDataUjian] = useState([])
    const [loading, setLoading] = useState(false);

    const getDataUjian = async () => {
        if (!props.data?.ranting) return;
        setLoading(true);
        const event = JSON.parse(localStorage.getItem('event'));
        const token = localStorage.getItem('token');

        try {
            const dataRes = await axios.get(`${BASE_URL}session/ukt/${event.id_event}/${props.data?.ranting}/1/9999`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setDataUjian(dataRes.data.data);
        } catch (err) {
            console.log(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getDataUjian();
    }, [props.data?.ranting]);


    function ThComponent({ items }) {
        let banding = 1;
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
                                    {(() => {
                                        const studentWithAnswers = dataUjian?.find(item => item.lembar_jawaban && item.lembar_jawaban.length > 0);
                                        return studentWithAnswers ? (
                                            <ThComponent items={studentWithAnswers.lembar_jawaban} key="header" />
                                        ) : null;
                                    })()}
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    const studentWithAnswers = dataUjian?.find(item => item.lembar_jawaban && item.lembar_jawaban.length > 0);
                                    const questionCount = studentWithAnswers?.lembar_jawaban?.length || 0;

                                    return dataUjian?.map((item, index) => (
                                        <tr className='text-green text-center h-fit' key={item.id_siswa}>
                                            <td className='border-b-2 text-white py-3 border-gray'>{item.keshan_siswa?.nomor_urut}</td>
                                            <td className='border-b-2 text-white border-gray text-center text-lg whitespace-nowrap px-4'>{item.keshan_siswa?.name}</td>
                                            {item.lembar_jawaban && item.lembar_jawaban.length > 0 ? (
                                                <TdComponent items={item.lembar_jawaban} key={index + 1} />
                                            ) : (
                                                Array.from({ length: questionCount }).map((_, i) => (
                                                    <td key={i} className='border-b-2 text-white/20 py-3 border-gray text-[10px] italic bg-navy/50'>BELUM UJIAN</td>
                                                ))
                                            )}
                                        </tr>
                                    ));
                                })()}
                            </tbody>
                        </table>
                    )}
                </div>


            </div>

        </div>
    )
}

export default Keshan