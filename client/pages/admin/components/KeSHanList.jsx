import React, { useState } from 'react'

const keSHanList = (props) => {

    return (
        <div className="bg-navy rounded-md py-3 px-8 space-y-4 my-4 text-white">

            {/* wrapper question */}
            <div className="flex justify-between items-center">

                {/* question */}
                <h1 className='text-lg'>{props.pertanyaan}</h1>
                
                {/* wrapper action button */}
                <div className="space-x-4">

                    {/* button edit */}
                    <button onClick={props.onEdit}>
                        <svg className='stroke-white hover:stroke-green hover:scale-125 duration-300' width="30" height="30" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 31.6667H33.25" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M26.125 5.54166C26.7549 4.91177 27.6092 4.55791 28.5 4.55791C28.9411 4.55791 29.3778 4.64478 29.7853 4.81358C30.1928 4.98237 30.5631 5.22977 30.875 5.54166C31.1869 5.85355 31.4343 6.22382 31.6031 6.63132C31.7719 7.03883 31.8588 7.47559 31.8588 7.91666C31.8588 8.35774 31.7719 8.7945 31.6031 9.202C31.4343 9.60951 31.1869 9.97977 30.875 10.2917L11.0833 30.0833L4.75 31.6667L6.33333 25.3333L26.125 5.54166Z" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>

                    {/* button delete */}
                    <button onClick={props.onDelete}>
                        <svg className='stroke-white hover:stroke-purple hover:scale-125 duration-300' width="28" height="28" viewBox="0 0 29 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.1543 5.76929L5.64468 29.6154C5.71547 30.9933 6.71776 32.0001 8.0293 32.0001H21.7408C23.0576 32.0001 24.0412 30.9933 24.1255 29.6154L25.6158 5.76929" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M1.76953 5.76929H28.0003H1.76953Z" fill="black"/>
                            <path d="M1.76953 5.76929H28.0003" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M10.1157 5.76924V2.78847C10.115 2.55341 10.1608 2.32054 10.2504 2.10324C10.3401 1.88594 10.4718 1.68851 10.638 1.5223C10.8042 1.35609 11.0016 1.22438 11.2189 1.13474C11.4362 1.04511 11.6691 0.999319 11.9041 1.00001H17.8657C18.1007 0.999319 18.3336 1.04511 18.5509 1.13474C18.7682 1.22438 18.9656 1.35609 19.1319 1.5223C19.2981 1.68851 19.4298 1.88594 19.5194 2.10324C19.609 2.32054 19.6548 2.55341 19.6541 2.78847V5.76924M14.8849 10.5385V27.2308M9.51953 10.5385L10.1157 27.2308M20.2503 10.5385L19.6541 27.2308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* wrapper answer */}
            <div className="space-y-3">
                <div className="flex items-center gap-x-3">
                    <input 
                        className='w-6 h-6 pointer-events-none' 
                        type="radio" 
                        name={props.id_soal} 
                        value={"opsi1"}
                        checked={
                            props.showAnswer === true ? 
                            (
                                props.id_soal === (props.kunciSoal?.find(kunci => {
                                    return kunci.id_soal === props.id_soal
                                })?.id_soal) 
                                &&
                                (props.kunciSoal)?.find(kunci => {
                                    return kunci.id_soal === props.id_soal
                                })?.opsi === "opsi1"
                            ) 
                            : null}
                        />
                    <label htmlFor="radio">{props.opsi1}</label>
                </div>
            </div>

            {/* wrapper answer */}
            <div className="space-y-3">
                <div className="flex items-center gap-x-3">
                    <input 
                        className='w-6 h-6 pointer-events-none' 
                        type="radio" 
                        name={props.id_soal} 
                        value={"opsi2"}
                        checked={
                            props.showAnswer === true ? 
                            (
                                props.id_soal === (props.kunciSoal?.find(kunci => {
                                    return kunci.id_soal === props.id_soal
                                })?.id_soal) 
                                &&
                                (props.kunciSoal)?.find(kunci => {
                                    return kunci.id_soal === props.id_soal
                                })?.opsi === "opsi2"
                            ) 
                            : null}
                        />
                    <label htmlFor="radio">{props.opsi2}</label>
                </div>
            </div>

            {/* wrapper answer */}
            <div className="space-y-3">
                <div className="flex items-center gap-x-3">
                    <input 
                        className='w-6 h-6 pointer-events-none' 
                        type="radio" 
                        name={props.id_soal} 
                        value={"opsi3"}
                        checked={
                            props.showAnswer === true ? 
                            (
                                props.id_soal === (props.kunciSoal?.find(kunci => {
                                    return kunci.id_soal === props.id_soal
                                })?.id_soal) 
                                &&
                                (props.kunciSoal)?.find(kunci => {
                                    return kunci.id_soal === props.id_soal
                                })?.opsi === "opsi3"
                            ) 
                            : null}
                        />
                    <label htmlFor="radio">{props.opsi3}</label>
                </div>
            </div>

            {/* wrapper answer */}
            <div className="space-y-3">
                <div className="flex items-center gap-x-3">
                    <input 
                        className='w-6 h-6 pointer-events-none' 
                        type="radio" 
                        name={props.id_soal} 
                        value={"opsi4"}
                        checked={
                            props.showAnswer === true ? 
                            (
                                props.id_soal === (props.kunciSoal?.find(kunci => {
                                    return kunci.id_soal === props.id_soal
                                })?.id_soal) 
                                &&
                                (props.kunciSoal)?.find(kunci => {
                                    return kunci.id_soal === props.id_soal
                                })?.opsi === "opsi4"
                            ) 
                            : null}
                        />
                    <label htmlFor="radio">{props.opsi4}</label>
                </div>
            </div>
        </div>
  )
}

export default keSHanList