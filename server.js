const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Menyiapkan folder untuk menyimpan file audio yang diunggah
const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)){
    fs.mkdirSync(uploadFolder);
}

// Konfigurasi Multer untuk menyimpan file ke folder uploads dengan nama asli
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

// Menambahkan middleware untuk menyediakan akses ke file-file statis di folder uploads
app.use('/uploads', express.static('uploads'));

// Menambahkan rute untuk menangani permintaan GET ke root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Menggunakan endpoint POST /upload untuk mengunggah file audio
app.post('/upload', upload.single('audio'), (req, res) => {
  const fileUrl = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
  res.send({ fileUrl });
})

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
