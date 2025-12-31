const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');
const setupSockets = require('./src/sockets');

const io = new Server(server, {
    cors: {
      origin: "*",
    }
});

app.use(cors());
app.use(express.static(__dirname))

//web socket
setupSockets(io);

app.get('/image/:filename', (req, res) => {
  const filename = req.params.filename;

  if (!filename || filename === 'undefined' || filename === 'null') {
    return res.status(400).json({ message: 'Nama file tidak valid' });
  }

  const imagePath = path.join(__dirname, 'src', 'image', filename);

  fs.stat(imagePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).json({ message: 'File tidak ditemukan' });
    }

    res.sendFile(imagePath);
  });
});

app.use('/image', express.static(path.join(__dirname, './src/image')));

//import end-point diletakkan disini

// endpoint role
const role = require('./src/api/role/role.router');
app.use("/ukt/role", role)

// endpoint cabang
const cabang = require('./src/api/cabang/cabang.router');
app.use("/ukt/cabang", cabang)

// endpoint cabang
const catatan = require('./src/api/catatan/catatan.router');
app.use("/ukt/catatan", catatan)

// endpoint cabang
const ranting = require('./src/api/ranting/ranting.router');
app.use("/ukt/ranting", ranting)

// endpoint siswa
const siswa = require('./src/api/siswa/siswa.router');
app.use("/ukt/siswa", siswa)

// endpoint user
const user = require('./src/api/users/user.router');
app.use("/ukt/user", user)

// endpoint pengurus
const pengurus = require('./src/api/pengurus/pengurus.router');
app.use("/ukt/pengurus", pengurus)

// endpoint penguji
const penguji = require('./src/api/penguji/penguji.router');
app.use("/ukt/penguji", penguji)

const senam = require('./src/api/kategori/senam/senam/senam.router');
app.use("/ukt/senam", senam)

const senam_siswa = require('./src/api/kategori/senam/senam_siswa/senam_siswa.router');
app.use("/ukt/senam_siswa", senam_siswa)

const senam_detail = require('./src/api/kategori/senam/senam_detail/senam_detail.router');
app.use("/ukt/senam_detail", senam_detail)

//endpoint gerakan
const gerakan= require('./src/api/gerakan/gerakan.router');
app.use('/ukt/gerakan', gerakan)

const jurus = require('./src/api/kategori/jurus/jurus/jurus.router');
app.use("/ukt/jurus", jurus)

const jurus_siswa = require('./src/api/kategori/jurus/jurus_siswa/jurus_siswa.router');
app.use("/ukt/jurus_siswa", jurus_siswa)

const jurus_detail = require('./src/api/kategori/jurus/jurus_detail/jurus_detail.router');
app.use("/ukt/jurus_detail", jurus_detail)

//endpoint teknik
const teknik = require('./src/api/kategori/teknik/teknik/teknik.router');
app.use("/ukt/teknik", teknik)
//endpoint teknik_siswa
const teknik_siswa = require('./src/api/kategori/teknik/teknik_siswa/teknik_siswa.router');
app.use("/ukt/teknik_siswa", teknik_siswa)
//endpoint teknik_detail
const teknik_detail = require('./src/api/kategori/teknik/teknik_detail/teknik_detail.router');
app.use("/ukt/teknik_detail", teknik_detail)

//endpoint fisik
const fisik = require('./src/api/kategori/fisik/fisik/fisik.router');
app.use("/ukt/fisik", fisik)

//endpoint Standar Fisik
const standar_fisik = require('./src/api/kategori/fisik/standar_fisik/standar_fisik.router');
app.use("/ukt/standar_fisik", standar_fisik)

//endpoint ukt_siswa
const ukt_siswa = require('./src/api/ukt_siswa/ukt_siswa.router');
app.use("/ukt/ukt_siswa", ukt_siswa)


//endpoint Soal
const soal = require('./src/api/soal/soal.router');
app.use("/ukt/soal", soal)

//endpoint Lembar Soal
const lembar_soal = require('./src/api/lembar_soal/lembar_soal.router');
app.use("/ukt/lembar_soal", lembar_soal)

//endpoint Lembar jawaban
const lembar_jawaban = require('./src/api/lembar_jawaban/lembar_jawaban.router');
app.use("/ukt/lembar_jawaban", lembar_jawaban)

//endpoint Kunci Soal
const kunci_soal = require('./src/api/kunci_soal/kunci_soal.router');
app.use("/ukt/kunci_soal", kunci_soal)

//endpoint Session
const session = require('./src/api/session/session.router');
app.use("/ukt/session", session)

//endpoint Event
const event = require('./src/api/event/event.router');
app.use("/ukt/event", event)
//endpoint Ukt
const ukt = require('./src/api/ukt/ukt.router');
app.use("/ukt/ukt", ukt)

//endpoint Sambung
const sambung = require('./src/api/kategori/sambung/sambung.router');
app.use("/ukt/sambung", sambung)

//endpoint Nilai Sambung
const nilaiSambung = require('./src/api/nilai_sambung/nilai_sambung.router');
app.use("/ukt/nilai_sambung", nilaiSambung)

//run server
server.listen(process.env.PORT, () => {
    console.log('server run on port ' + process.env.PORT)
})