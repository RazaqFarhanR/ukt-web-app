import React from 'react'

const table = () => {
    return (
        <>
            {/* wrapper table */}
            <div className="bg-navy rounded-md py-2 px-3">
                            
                {/* table */}
                <table className='w-full table-fixed'>
                    <thead>
                        <tr className='text-green'>
                            <th className='py-3 w-[5%]'>No</th>
                            <th className='w-[20%]'>NIW</th>
                            <th>Nama</th>
                            <th className='w-[15%]'>Ranting</th>
                            <th className='w-[15%]'>Username</th>
                            <th className='w-[15%]'>No WA</th>
                            <th className='w-[12%]'>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='text-white text-center'>
                            <td className='border-b-2 py-3 border-gray'>test</td>
                            <td className='border-b-2 border-gray'>test</td>
                            <td className='border-b-2 border-gray'>test</td>
                            <td className='border-b-2 border-gray'>test</td>
                            <td className='border-b-2 border-gray'>test</td>
                            <td className='border-b-2 border-gray'>test</td>
                            <td className='border-b-2 border-gray'>
                                <button className="bg-purple hover:bg-white hover:text-purple py-2 px-3 rounded-md w-32 flex justify-center items-center space-x-2 mx-auto group duration-300">
                                    <svg className='stroke-white group-hover:stroke-purple' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M12 16V12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M12 8H12.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <h1>Detail</h1>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default table