import React, { useState } from 'react'
import axios from 'axios'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// ─── Grade type options per UKT type ────────────────────────────────────────
const GRADE_OPTIONS_UKT = [
    { value: 'keshan', label: 'Keshan' },
    { value: 'senam',  label: 'Senam' },
    { value: 'jurus',  label: 'Jurus' },
    { value: 'fisik',  label: 'Fisik' },
    { value: 'teknik', label: 'Teknik' },
    { value: 'sambung', label: 'Sambung' },
]

const GRADE_OPTIONS_UKCW = [
    { value: 'keshan',     label: 'Keshan' },
    { value: 'senam',      label: 'Senam' },
    { value: 'senam_toya', label: 'Senam Toya' },
    { value: 'jurus',      label: 'Jurus' },
    { value: 'jurus_toya', label: 'Jurus Toya' },
    { value: 'fisik',      label: 'Fisik' },
    { value: 'teknik',     label: 'Teknik' },
    { value: 'belati',     label: 'Belati' },
    { value: 'kripen',     label: 'Kripen' },
    { value: 'sambung',    label: 'Sambung' },
]

/**
 * Props:
 *  show         – boolean, whether modal is visible
 *  onClose      – () => void
 *  idSiswa      – student id
 *  idEvent      – event id
 *  siswaName    – student name (for display)
 *  tipeUkt      – "UKT" | "UKCW" | "UKT Putih" etc.
 *  onSuccess    – () => void  – called after successful reset
 */
const ModalResetGrade = ({ show, onClose, idSiswa, idEvent, siswaName, tipeUkt, onSuccess }) => {
    const [selectedGrade, setSelectedGrade] = useState('')
    const [loading, setLoading]             = useState(false)
    const [error, setError]                 = useState('')
    const [success, setSuccess]             = useState('')
    const [showConfirm, setShowConfirm]     = useState(false)

    if (!show) return null

    const isUkcw = tipeUkt === 'UKCW' || tipeUkt === 'UKT Putih'
    const gradeOptions = isUkcw ? GRADE_OPTIONS_UKCW : GRADE_OPTIONS_UKT

    const handlePreReset = () => {
        if (!selectedGrade) {
            setError('Pilih tipe test terlebih dahulu.')
            return
        }
        setError('')
        setShowConfirm(true)
    }

    const handleConfirmReset = () => {
        setError('')
        setLoading(true)

        const token = localStorage.getItem('token')
        axios.patch(
            BASE_URL + 'ukt_siswa/reset',
            { id_siswa: idSiswa, id_event: idEvent, tipe_test: selectedGrade },
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(res => {
                setSuccess(`Nilai ${gradeOptions.find(o => o.value === selectedGrade)?.label} berhasil direset. Siswa dapat mengulang ujian.`)
                setLoading(false)
                if (onSuccess) onSuccess()
            })
            .catch(err => {
                setError(err.response?.data?.message || err.message)
                setLoading(false)
            })
    }

    const handleClose = () => {
        setSelectedGrade('')
        setError('')
        setSuccess('')
        setShowConfirm(false)
        onClose()
    }

    return (
        <>
            {/* Backdrop */}
            <div className="bg-black opacity-70 fixed inset-0 z-40" onClick={handleClose}></div>

            {/* Modal */}
            <div className="fixed flex justify-center items-center top-0 left-0 z-50 w-full h-full p-4">
                <div className="relative w-full max-w-lg">
                    <div className="relative bg-navy text-white rounded-xl shadow-2xl">

                        {/* Header */}
                        <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray border-opacity-30">
                            <div className="flex items-center gap-x-3">
                                {/* Reset icon */}
                                <div className="bg-blue bg-opacity-20 rounded-lg p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                                        fill="none" stroke="#48B8F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                        <path d="M3 3v5h5"/>
                                        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                                        <path d="M16 16h5v5"/>
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold tracking-wide">Reset Nilai Siswa</h2>
                                    <p className="text-sm text-gray opacity-70 mt-0.5">
                                        {siswaName || 'Siswa'}
                                    </p>
                                </div>
                            </div>

                            <button onClick={handleClose} type="button"
                                className="p-1.5 rounded-full hover:bg-white hover:bg-opacity-10 duration-200">
                                <svg className="w-6 h-6 fill-white hover:fill-red duration-300" viewBox="0 0 20 20">
                                    <path fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"/>
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 space-y-5">

                            {!showConfirm ? (
                                <>
                                    {/* Info banner */}
                                    <div className="bg-yellow bg-opacity-10 border border-yellow border-opacity-30 rounded-lg px-4 py-3 flex gap-x-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                            fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                            className="flex-shrink-0 mt-0.5">
                                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                                            <path d="M12 9v4"/><path d="M12 17h.01"/>
                                        </svg>
                                        <p className="text-sm text-yellow">
                                            Nilai yang direset akan dikosongkan sehingga siswa dapat mengulang ujian pada tipe test tersebut.
                                        </p>
                                    </div>

                                    {/* Grade type select */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-white tracking-wide">
                                            Pilih Tipe Test yang Direset
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {gradeOptions.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => { setSelectedGrade(opt.value); setError(''); setSuccess(''); setShowConfirm(false) }}
                                                    className={`
                                                        flex items-center gap-x-2 px-4 py-3 rounded-lg border text-sm font-medium
                                                        duration-200 transition-all
                                                        ${selectedGrade === opt.value
                                                            ? 'border-blue bg-blue bg-opacity-20 text-white'
                                                            : 'border-gray border-opacity-30 bg-white bg-opacity-5 text-gray hover:border-blue hover:border-opacity-60 hover:bg-opacity-10'
                                                        }
                                                    `}
                                                >
                                                    {/* Radio indicator */}
                                                    <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                                                        ${selectedGrade === opt.value ? 'border-blue' : 'border-gray border-opacity-50'}`}>
                                                        {selectedGrade === opt.value && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-blue block"/>
                                                        )}
                                                    </span>
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-red bg-opacity-10 border border-red border-opacity-30 rounded-lg px-4 py-6 text-center">
                                    <svg className="w-14 h-14 text-red mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <h3 className="text-xl font-bold text-white mb-2">Konfirmasi Reset Nilai</h3>
                                    <p className="text-sm text-gray opacity-90 leading-relaxed mb-4">
                                        Anda akan mereset nilai <strong className="text-white text-base">{gradeOptions.find(o => o.value === selectedGrade)?.label}</strong> untuk siswa <strong className="text-white text-base">{siswaName}</strong>.
                                    </p>
                                    <p className="text-xs text-red mt-2 px-4 py-2 bg-red bg-opacity-20 rounded-md inline-block font-medium tracking-wide">
                                        Tindakan ini akan menghapus data pengujian dan ujian harus diulang kembali.
                                    </p>
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="bg-red bg-opacity-10 border border-red border-opacity-30 rounded-lg px-4 py-3">
                                    <p className="text-red text-sm">{error}</p>
                                </div>
                            )}

                            {/* Success */}
                            {success && (
                                <div className="bg-green bg-opacity-10 border border-green border-opacity-30 rounded-lg px-4 py-3">
                                    <p className="text-green text-sm">{success}</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-x-3 px-6 py-4 border-t border-gray border-opacity-20">
                            {!showConfirm ? (
                                <>
                                    <button
                                        onClick={handleClose}
                                        className="px-5 py-2.5 rounded-lg text-sm font-medium border border-gray border-opacity-30
                                            hover:bg-white hover:bg-opacity-10 duration-200 text-gray"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handlePreReset}
                                        disabled={!selectedGrade || !!success}
                                        className={`
                                            px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-x-2
                                            duration-200 transition-all
                                            ${!selectedGrade || !!success
                                                ? 'bg-gray bg-opacity-30 text-gray cursor-not-allowed'
                                                : 'bg-blue hover:bg-white hover:text-blue text-white'
                                            }
                                        `}
                                    >
                                        Selanjutnya
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        disabled={loading || !!success}
                                        className="px-5 py-2.5 rounded-lg text-sm font-medium border border-gray border-opacity-30
                                            hover:bg-white hover:bg-opacity-10 duration-200 text-gray disabled:opacity-50"
                                    >
                                        Kembali
                                    </button>
                                    <button
                                        onClick={handleConfirmReset}
                                        disabled={loading || !!success}
                                        className={`
                                            px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-x-2
                                            duration-200 transition-all
                                            ${loading || !!success
                                                ? 'bg-gray bg-opacity-30 text-gray cursor-not-allowed'
                                                : 'bg-red hover:bg-opacity-80 text-white'
                                            }
                                        `}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                    <path className="opacity-75" fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                                </svg>
                                                Mereset...
                                            </>
                                        ) : 'Ya, Reset Nilai'}
                                    </button>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalResetGrade
