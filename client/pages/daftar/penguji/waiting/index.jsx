import BasicLayout from "@/components/layout/basic_layout";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { data } from "autoprefixer";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;
export default function WaitingPenguji() {
    const [dataPenguji, setDataPenguji] = useState(null);
    const [foto, setFoto] = useState('');
    const checkDataPenguji = () => {
        const pengujiData = JSON.parse(localStorage.getItem('pending_penguji'));
        axios.get(BASE_URL + `penguji/cek_verification/${pengujiData?.id_penguji}`)
            .then(res => {
                setFoto(res.data.data.foto);
                if (res.data.data.active) {
                    alert('Akun penguji Anda telah disetujui oleh admin. Silakan login.');
                    localStorage.removeItem('pending_penguji');
                    window.location.href = '/penguji/login';
                } else {
                    alert('Akun penguji Anda masih menunggu persetujuan admin.');
                }
            });
    }

    useEffect(() => {
        const pengujiData = localStorage.getItem('pending_penguji');
        if (pengujiData) {
            setDataPenguji(JSON.parse(pengujiData));
        }
        checkDataPenguji();
    }, []);
    const classForm = "flex flex-row space-x-1 w-full"
    return (
        <BasicLayout>
            <div className="bg-navy w-full md:w-1/2 flex flex-col text-white uppercase p-6 rounded-md items-center space-y-4">
                <div className="flex">
                    <h1 className="text-white text-xl font-bold">Menunggu Persetujuan Admin 🔴</h1>
                    {/* psht icon */}
                </div>
                <div className={`block h-fit rounded-full bg-gradient-to-r from-[#16D4FC] to-[#9A4BE9] p-0.5 mb-3`}>

                {foto && (
                    <img
                    src={`${IMAGE_URL + foto}`}
                    alt="foto"
                    className="object-cover rounded-full w-28 h-28"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/fallback.png';
                        console.error('Image failed to load:', foto);
                    }}
                    />
                )}
                </div>
                <div className={classForm}>
                    <div className="w-2/6 flex justify-between">
                        <span>nama</span><span>:</span>
                    </div>
                    <div className="w-4/6 pl-2">
                        <p>{dataPenguji?.name}</p>
                    </div>
                </div>
                <div className={classForm}>
                    <div className="w-2/6 flex justify-between">
                        <span>ranting</span><span>:</span>
                    </div>
                    <div className="w-4/6 pl-2">
                        <p>{dataPenguji?.id_ranting}</p>
                    </div>
                </div>
                <button
                    onClick={checkDataPenguji}
                    className="px-4 py-2 w-full bg-blue text-white rounded">
                    Cek Status Verifikasi
                </button>
            </div>
        </BasicLayout>
    )
}