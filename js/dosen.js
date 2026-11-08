
// PENYIMPANAN DATA TUGAS
let daftarTugas = JSON.parse(
    localStorage.getItem("daftarTugas") || "null"
);

// Data tugas awal jika belum ada
if (daftarTugas === null) {
    daftarTugas = [
        {
            id: 1,
            nama: "Membuat Makalah Data Science",
            matkul: "Data Science",
            deskripsi: "Buat makalah tentang Data Science.",
            deadline: "2026-11-15"
        },
        {
            id: 2,
            nama: "Membuat Program JavaScript",
            matkul: "Pemrograman Web",
            deskripsi: "Buat program sederhana menggunakan JavaScript.",
            deadline: "2026-11-12"
        },
        {
            id: 3,
            nama: "Laporan Basis Data",
            matkul: "Basis Data",
            deskripsi: "Buat laporan praktikum basis data.",
            deadline: "2026-11-18"
        }
    ];

    simpanTugas();
}

// Ambil data pengumpulan mahasiswa
function ambilPengumpulan() {
    return JSON.parse(
        localStorage.getItem("pengumpulan") || "[]"
    );
}

// Simpan tugas
function simpanTugas() {
    localStorage.setItem(
        "daftarTugas",
        JSON.stringify(daftarTugas)
    );
}

// Tanggal hari ini
document.getElementById("tanggalDosen").textContent =
    new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

// Form membuat tugas
document.getElementById("formTugas")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const tugasBaru = {
        id: Date.now(),
        nama: document.getElementById("namaTugas").value.trim(),
        matkul: document.getElementById("mataKuliah").value.trim(),
        deskripsi: document.getElementById("deskripsiTugas").value.trim(),
        deadline: document.getElementById("deadlineTugas").value
    };

    daftarTugas.push(tugasBaru);

    simpanTugas();

    document.getElementById("formTugas").reset();

    document.getElementById("pesanTugas").textContent =
        "Tugas berhasil dipublikasikan!";

    document.getElementById("pesanTugas").style.color = "green";

    tampilkanTugas();
});

// Tampilkan daftar tugas
function tampilkanTugas() {

    const tabel = document.getElementById("daftarTugasDosen");

    tabel.innerHTML = "";

    daftarTugas.forEach((tugas, index) => {

        const baris = document.createElement("tr");

        const data = [
            index + 1,
            tugas.nama,
            tugas.matkul,
            tugas.deadline
        ];

        data.forEach(nilai => {
            const td = document.createElement("td");
            td.textContent = nilai;
            baris.appendChild(td);
        });

        const aksi = document.createElement("td");
        const tombol = document.createElement("button");

        tombol.textContent = "Hapus";
        tombol.className = "delete-task-btn";

        tombol.addEventListener("click", function() {
            hapusTugas(tugas.id);
        });

        aksi.appendChild(tombol);
        baris.appendChild(aksi);

        tabel.appendChild(baris);
    });

    tampilkanStatistik();
    tampilkanPengumpulan();
}

// Hapus tugas
function hapusTugas(id) {

    const yakin = confirm("Apakah kamu yakin ingin menghapus tugas ini?");

    if (!yakin) return;

    daftarTugas = daftarTugas.filter(
        tugas => tugas.id !== id
    );

    simpanTugas();
    tampilkanTugas();
}

// Statistik dashboard
function tampilkanStatistik() {

    const pengumpulan = ambilPengumpulan();

    document.getElementById("jumlahTugas").textContent =
        daftarTugas.length;

    document.getElementById("jumlahPengumpulan").textContent =
        pengumpulan.length;

    document.getElementById("tugasAktif").textContent =
        daftarTugas.filter(t => t.deadline >=
            new Date().toISOString().split("T")[0]
        ).length;

    document.getElementById("jumlahDinilai").textContent =
        pengumpulan.filter(p => p.nilai !== undefined).length;
}

// Tampilkan data pengumpulan
function tampilkanPengumpulan() {

    const tabel = document.getElementById("dataPengumpulan");
    const pengumpulan = ambilPengumpulan();

    tabel.innerHTML = "";

    if (pengumpulan.length === 0) {
        const baris = document.createElement("tr");
        const kolom = document.createElement("td");

        kolom.colSpan = 5;
        kolom.textContent = "Belum ada mahasiswa yang mengumpulkan tugas.";
        baris.appendChild(kolom);
        tabel.appendChild(baris);
        return;
    }

    pengumpulan.forEach((item, index) => {

        const baris = document.createElement("tr");

        [
            index + 1,
            item.namaMahasiswa || "Mahasiswa",
            item.namaTugas,
            item.namaFile,
            item.nilai === undefined ? "Belum dinilai" : item.nilai
        ].forEach(nilai => {
            const td = document.createElement("td");
            td.textContent = nilai;
            baris.appendChild(td);
        });

        tabel.appendChild(baris);
    });
}

// Jalankan dashboard
tampilkanTugas();
