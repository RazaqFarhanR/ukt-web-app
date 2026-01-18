import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import Select from 'react-select';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


export default function DaftarPenguji() {
    const router = useRouter();
    const [dataRanting, setDataRanting] = useState([]);
    const [formData, setFormData] = useState({
        niw: '',
        name: '',
        id_ranting: '',
        username: '',
        password: '',
        no_wa: ''
    })
    const [usernameStatus, setUsernameStatus] = useState(null);
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const handleSelectInput = (e) => {
        console.log(formData)
        console.log(e.value)
        setFormData(prev => ({
            ...prev,
            ['id_ranting']: e.value
        }))
    }

    const handlerGetDataRanting = () => {

        axios.get(BASE_URL + 'ranting/select')
            .then(result => {
                setDataRanting(result.data.data)
            })
            .catch(error => {
                console.log(error.message);
            })
    }


    const handleSave = async (e) => {
        e.preventDefault()

        const token = localStorage.getItem('token')
        axios.post(BASE_URL + `penguji/daftar`, formData, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                localStorage.setItem('pending_penguji', JSON.stringify(res.data.data))
                toast.success('Berhasil daftar penguji')
                router.push('/profile_picture?id=' + res.data.data.id_penguji + '&tipe=penguji')
            })
            .catch(err => {
                console.log(err.message);
            })

    }

    // check username availability
    const checkUsername = async (username) => {
        if (!username || username.trim() === "") {
            return { exists: false };
        }

        try {
            const res = await axios.get(
                BASE_URL + `penguji/cek_username/${username}`
            );

            return res.data; // { exists: true/false, message }
        } catch (error) {
            console.error(error);
            return { exists: false, error: true };
        }
    };
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (!formData.username || formData.username.trim() === "") {
                setUsernameStatus(null);
                return;
            }

            const result = await checkUsername(formData.username);

            if (result.exists) {
                setUsernameStatus("taken");
            } else {
                setUsernameStatus("available");
            }
        }, 500); // debounce 500ms

        return () => clearTimeout(delayDebounce);
    }, [formData.username]);

    useEffect(() => {
        handlerGetDataRanting()
    }, []);

    const classForm = "flex flex-row space-x-1 w-full"
    const classInput = 'w-full bg-darkBlue h-8 rounded-md focus:outline-none px-2'
    return (
        <>
            <div className="w-full overflow-y-auto h-screen">

                {/* header */}
                <div className="sticky top-0 z-10 header border-b bg-black w-full px-2 py-3 font-lato">

                    <div className="flex justify-center items-center px-4">
                        {/* button sidebar */}
                        {/* Title */}
                        <h1 className='text-white font-semibold text-xl uppercase'>ukt cabang Trenggalek</h1>
                        <img></img>
                    </div>

                </div>
                {/* konten utama */}
                <div className="bg-darkBlue min-h-full py-4 md:py-10 px-1 justify-center flex items-start">
                    {/* Modal body */}
                    <div className="bg-navy w-full md:w-1/2 flex flex-col items-center py-2  rounded-md text-white font-lato">
                        {/* psht icon */}
                        <div className='flex flex-row items-center space-x-4 mt-4 mx-4'>
                            <img className='w-16 md:w-24 mb-4' src="/images/psht-icon.png" alt="" />
                            <div className="text-xl font-bold mb-4 uppercase">
                                <span>Form Penguji Ranting</span>
                                <span className="block">Uji Kenaikan Tingkat</span>
                                <span className="block">Cabang Trenggalek</span>
                            </div>
                        </div>
                        <form className='w-full space-y-3 px-4' onSubmit={(e) => handleSave(e)}>
                            {/* Input niw */}
                            <div className={classForm}>
                                <div className="w-2/6 flex justify-between">
                                    <span>NIW</span>
                                    <span>:</span>
                                </div>
                                <div className="w-4/6">
                                    <input
                                        className={classInput}
                                        type="number"
                                        name="niw"
                                        value={formData.niw}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>
                            </div>

                            {/* Input nama */}
                            <div className={classForm}>
                                <div className="w-2/6 flex justify-between">
                                    <span>Nama</span>
                                    <span>:</span>
                                </div>
                                <div className="w-4/6">
                                    <input
                                        className={classInput}
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>
                            </div>

                            {/* Input ranting */}
                            <div className={classForm}>
                                <div className="w-2/6 flex justify-between">
                                    <span>Ranting</span>
                                    <span>:</span>
                                </div>
                                <div className="w-4/6">
                                    <div className='w-full '>
                                        <Select
                                            value={dataRanting.find(
                                                option => option.value === formData.id_ranting
                                            )}
                                            onChange={handleSelectInput}
                                            options={dataRanting}
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    backgroundColor: "#0f172a",
                                                    color: "white",
                                                    borderColor: "#475569",
                                                }),
                                                singleValue: (base) => ({
                                                    ...base,
                                                    color: "white",
                                                }),
                                                input: (base) => ({
                                                    ...base,
                                                    color: "white",
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    backgroundColor: "#0f172a",
                                                }),
                                                option: (base, state) => ({
                                                    ...base,
                                                    backgroundColor: state.isFocused
                                                        ? "#2563eb"
                                                        : "#0f172a",
                                                    color: "white",
                                                }),
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Input no wa */}
                            <div className={classForm}>
                                <div className="w-2/6 flex justify-between">
                                    <span>Whatsapp</span>
                                    <span>:</span>
                                </div>
                                <div className="w-4/6">
                                    <input
                                        className={classInput}
                                        type="text"
                                        name="no_wa"
                                        value={formData.no_wa}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>
                            </div>

                            {/* Input username */}
                            <div className={classForm}>
                                <div className="w-2/6 flex justify-between">
                                    <span>Username</span>
                                    <span>:</span>
                                </div>
                                <div className="w-4/6">
                                    <input
                                        className={classInput}
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />


                                    {usernameStatus === "taken" && (
                                        <p className="text-red text-sm">Username sudah digunakan</p>
                                    )}

                                    {usernameStatus === "available" && (
                                        <p className="text-green text-sm">Username tersedia</p>
                                    )}
                                </div>
                            </div>

                            {/* Input password */}
                            <div className={classForm}>
                                <div className="w-2/6 flex justify-between">
                                    <span>Password</span>
                                    <span>:</span>
                                </div>
                                <div className="w-4/6">
                                    <input
                                        className={classInput}
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>
                            </div>
                            {/* submit button */}
                            <div className="w-full p-6 pt-16 space-x-2">
                                <button
                                    type="submit"
                                    disabled={usernameStatus === "taken"}
                                    className={`w-full rounded-lg font-medium px-5 py-2.5 focus:z-10 duration-300
                                    ${usernameStatus === "taken"
                                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                            : "bg-green text-white hover:bg-green"
                                        }
                                    `}
                                >
                                    {usernameStatus === "taken" ? "Username sudah digunakan" : "Submit"}
                                </button>

                            </div>

                        </form>
                    </div>
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
    );
}