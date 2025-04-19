import React from 'react'
import Header from '../admin/components/header'

const main_layout_hp = () => {
    return (
        <>
            <div className="font-lato">

                {/* awal wrapper konten utama */}
                <div className="w-full h-screen">

                    {/* header */}
                    <Header />
                    {/* akhir header */}

                    {/* konten utama */}
                    <div className="min-h-full bg-darkBlue px-10 py-8">
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default main_layout_hp