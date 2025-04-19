import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const Pagination = (props) => {
    const page = props.page
    const router = useRouter()

    const {tipe, event, ranting} = router.query

    const prevPage = () => {
        router.push({query: {tipe: tipe, ranting: ranting, event: event, page:(Number(page) - 1)}})
    }

    const movePage = (selected) => {
        router.push({query: {tipe: tipe, ranting: ranting, event: event, page:selected}})
    }

    const pageList = []
    for (let i = 1; i <= 20; i++) {
        pageList.push(i)
    }
    const answeredNumber = props.answered
    

    return (
        <div className='w-full my-6 min-h-[20%] flex justify-between space-x-4'>
            {/* prev button */}
            <button className='lg:w-[15%] w-[12%] min-h-full bg-green rounded-md flex justify-center items-center p-8' onClick={() => prevPage()} disabled={page == 1}>
                <img className='lg:w-16 w-48 h-auto' src="/images/btn_prevnext.webp" alt='prev'/>
            </button>

            {/* pagination */}
            <div className='lg:w-[70%] w-[75%] min-h-full grid grid-cols-10 gap-2'>
                {pageList.map((item, index) => (
                    <button key={index+1} className={`bg-gradient-to-r from-[#9A4BE9] to-[#16D4FC] rounded-md p-0.5 flex justify-center`} onClick={() => movePage(item)}>
                        <div className={`w-full h-full rounded-md flex justify-center items-center ${item == answeredNumber?.find(nomor => {return nomor.nomor == item})?.nomor ? 'bg-purple' : 'bg-darkBlue'}`}>
                            <h1 className='lg:text-2xl text-md font-lato text-white font-bold'>{item}</h1>
                        </div>
                    </button>
                ))}
            </div>

            {/* next & finish button */}
            { page == 20 ? (
                <button className='lg:w-[15%] w-[12%] min-h-full bg-purple rounded-md flex justify-center items-center p-8' onClick={props.handleSave}>
                    <h1 className='text-2xl text-white font-bold font-lato tracking-wide uppercase'>Simpan</h1>
                </button>
            ):
            (
                <button className='lg:w-[15%] w-[12%] min-h-full bg-green rounded-md flex justify-center items-center p-8' onClick={props.next}>
                    <img className='lg:w-16 w-48 h-auto rotate-180' src="/images/btn_prevnext.webp" alt='prev'/>
                </button>
            )}

        </div>
    )
}

export default Pagination