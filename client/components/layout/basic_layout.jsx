export default function BasicLayout({ children }) {
    return (
        <>
            <div className="w-full overflow-y-auto h-screen">

                {/* header */}
                <div className="sticky top-0 z-10 header border-b bg-black w-full px-2 py-3 font-lato">

                    <div className="flex justify-center items-center px-4">
                        {/* button sidebar */}
                        {/* Title */}
                        <h1 className='text-white font-semibold text-xl uppercase'>UKT Cabang Trenggalek</h1>
                        <img></img>
                    </div>

                </div>
                {/* konten utama */}
                <div className="bg-darkBlue min-h-full py-4 md:py-10 px-1 justify-center flex items-start">
                    {children}
                </div>
                {/* footer */}
                <footer className="flex flex-col bg-[#2C2F48] text-white text-center justify-center p-5 font-lato">
                    <span className='first-letter:uppercase'>
                        © Copyright UKT CABANG TRENGGALEK.
                        <br></br>
                        2023
                    </span>
                </footer>
            </div>
        </>
    )
}