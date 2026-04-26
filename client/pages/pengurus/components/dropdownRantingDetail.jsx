const { useEffect, useState } = require("react");
const axios = require("axios");
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function DropdownRantingDetail({ ranting, setRanting, eventId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [rantingList, setRantingList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!eventId) return;

        const token = localStorage.getItem('token');

        const fetchRanting = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BASE_URL}ukt_siswa/dropdown/${eventId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const json = await res.json();
                setRantingList(json.data || []);
            } catch (err) {
                console.error('Failed to fetch ranting:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRanting();
    }, [eventId]);

    return (
        <div className="relative inline-block text-left">
            <button
                className="bg-purple w-64 h-12 text-white rounded"
                onClick={() => setIsOpen(!isOpen)}
            >
                {ranting || 'Pilih Ranting'}
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-64 bg-navy border border-purple text-white rounded shadow-lg max-h-60 overflow-y-auto">
                    {loading ? (
                        <div className="px-4 py-2 text-center">Loading...</div>
                    ) : rantingList.length === 0 ? (
                        <div className="px-4 py-2 text-center">Tidak ada data</div>
                    ) : (
                        rantingList.map((item) => (
                            <div
                                key={item.id_ranting}
                                className="px-4 py-2 hover:bg-purple cursor-pointer border-purple border flex justify-between items-center"
                                onClick={() => {
                                    setRanting(item.id_ranting);
                                    setIsOpen(false);
                                }}
                            >
                                <span>{item.id_ranting}</span>
                                <span className="text-sm opacity-70">{item.countSiswa} siswa</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default DropdownRantingDetail;