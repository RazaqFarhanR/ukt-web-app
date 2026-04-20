export const exportGrades = async (data, eventName, rantingName, tipeUkt, format) => {
    const isSpecialTipe = tipeUkt === 'UKCW' || tipeUkt === 'UKT Putih';
    
    const headers = isSpecialTipe ? 
        ['No Urut', 'Nama', 'Rayon', 'Keshan', 'Senam', 'Senam Toya', 'Jurus', 'Jurus Toya', 'Teknik', 'Fisik', 'Sambung', 'Belati', 'Kripen', 'Rata-rata'] :
        ['No Urut', 'Nama', 'Rayon', 'Keshan', 'Senam', 'Jurus', 'Teknik', 'Fisik', 'Sambung', 'Rata-rata'];

    const rows = data.map((item, index) => {
        if (isSpecialTipe) {
            return [
                item.nomor_urut || '-',
                item.name || '-',
                item.rayon || '-',
                item.keshan ?? 0,
                item.senam ?? 0,
                item.senam_toya ?? 0,
                item.jurus ?? 0,
                item.jurus_toya ?? 0,
                item.teknik ?? 0,
                item.fisik ?? 0,
                item.sambung ?? 0,
                item.belati ?? 0,
                item.kripen ?? 0,
                item.total ?? 0
            ];
        } else {
            return [
                item.nomor_urut || '-',
                item.name || '-',
                item.rayon || '-',
                item.keshan ?? 0,
                item.senam ?? 0,
                item.jurus ?? 0,
                item.teknik ?? 0,
                item.fisik ?? 0,
                item.sambung ?? 0,
                item.total ?? 0
            ];
        }
    });

    const exportFileName = `Nilai_${eventName}_${rantingName || 'Semua Ranting'}`;

    if (format === 'excel') {
        const XLSX = await import('xlsx');
        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Card');
        XLSX.writeFile(workbook, `${exportFileName}.xlsx`);
    } else if (format === 'pdf') {
        const jsPDFModule = await import('jspdf');
        const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
        const autoTableModule = await import('jspdf-autotable');
        const autoTable = autoTableModule.default;

        const doc = new jsPDF({ orientation: 'landscape' });
        doc.text(`Laporan Nilai UKT - ${eventName} - ${rantingName || 'Semua Ranting'}`, 14, 15);
        
        autoTable(doc, {
            head: [headers],
            body: rows,
            startY: 20,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185] }
        });
        
        doc.save(`${exportFileName}.pdf`);
    }
};
