
const tugas = JSON.parse(
    localStorage.getItem("daftarTugas") || "[]"
);

let pengumpulan = JSON.parse(
    localStorage.getItem("pengumpulan") || "[]"
);

const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
);

// Tanggal
document.getElementById("tanggal").textContent =
    new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

// Nama mahasiswa
if (currentUser) {
    document.getElementById("namaMahasiswa").textContent =
        currentUser.nama || currentUser.username || "Mahasiswa";
}

// Isi pilihan tugas
function isiPilihanTugas() {
    const select = document.getElementById("pilihTugas");

    select.innerHTML = '<option value="">Pilih tugas</option>';

    tugas.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.nama;
        select.appendChild(option);
    });
}

// Tampilkan daftar tugas
function tampilkanTugas() {
    const table = document.getElementById("taskTable");
    table.innerHTML = "";

    tugas.forEach((item, index) => {
        const data = pengumpulan.find(
            p => p.tugasId === item.id &&
            p.username === (currentUser?.username || "mahasiswa")
        );

        const tr = document.createElement("tr");

        [
            index + 1,
            item.nama,
            item.matkul,
            item.deadline,
            data ? "Sudah Dikumpulkan" : "Belum Dikumpulkan"
        ].forEach((nilai, i) => {
            const td = document.createElement("td");
            td.textContent = nilai;

            if (i === 4) {
                td.className = data ?
                    "status-selesai" : "status-belum";
            }

            tr.appendChild(td);
        });

        table.appendChild(tr);
    });

    tampilkanStatistik();
    tampilkanRiwayat();
}

// Statistik
function tampilkanStatistik() {
    const milikSaya = pengumpulan.filter(
        p => p.username === (currentUser?.username || "mahasiswa")
    );

    document.getElementById("totalTugas").textContent =
        tugas.length;

    document.getElementById("sudahTugas").textContent =
        milikSaya.length;

    document.getElementById("belumTugas").textContent =
        tugas.length - milikSaya.length;

    document.getElementById("dinilaiTugas").textContent =
        milikSaya.filter(p => p.nilai !== undefined).length;
}

// Riwayat
function tampilkanRiwayat() {
    const riwayat = document.getElementById("riwayatList");

    const milikSaya = pengumpulan.filter(
        p => p.username === (currentUser?.username || "mahasiswa")
    );

    if (milikSaya.length === 0) {
        riwayat.innerHTML =
            "<p>Belum ada riwayat pengumpulan.</p>";
        return;
    }

    riwayat.innerHTML = milikSaya.map(item => `
        <div class="history-item">
            <strong>${item.namaTugas}</strong>
            <p>File: ${item.namaFile}</p>
            <small>Tanggal: ${item.tanggal}</small>
            <p>Status: ${item.nilai === undefined ?
                "Menunggu penilaian" : "Sudah dinilai: " + item.nilai}</p>
        </div>
    `).join("");
}

// Proses pengumpulan
document.getElementById("formPengumpulan")
.addEventListener("submit", function(event) {
    event.preventDefault();

    const tugasId = Number(
        document.getElementById("pilihTugas").value
    );

    const file = document.getElementById("fileTugas").files[0];

    const keterangan =
        document.getElementById("keterangan").value;

    const pesan = document.getElementById("pesanPengumpulan");

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        pesan.style.color = "red";
        pesan.textContent = "Ukuran file maksimal 2 MB.";
        return;
    }

    const tugasDipilih = tugas.find(t => t.id === tugasId);

    if (!tugasDipilih) {
        pesan.textContent = "Silakan pilih tugas.";
        return;
    }

    const username = currentUser?.username || "mahasiswa";

    const sudahAda = pengumpulan.some(
        p => p.tugasId === tugasId && p.username === username
    );

    if (sudahAda) {
        pesan.style.color = "red";
        pesan.textContent = "Tugas ini sudah dikumpulkan.";
        return;
    }

    const tanggalSekarang = new Date()
        .toLocaleString("id-ID");

    const reader = new FileReader();

    reader.onload = function() {
        const dataBaru = {
            id: Date.now(),
            tugasId: tugasId,
            namaTugas: tugasDipilih.nama,
            namaMahasiswa: currentUser?.nama ||
                currentUser?.username || "Mahasiswa",
            username: username,
            namaFile: file.name,
            fileData: reader.result,
            keterangan: keterangan,
            tanggal: tanggalSekarang
        };

        pengumpulan.push(dataBaru);

        localStorage.setItem(
            "pengumpulan",
            JSON.stringify(pengumpulan)
        );

        pesan.style.color = "green";
        pesan.textContent = "Tugas berhasil dikumpulkan!";

        document.getElementById("formPengumpulan").reset();

        tampilkanTugas();
        isiPilihanTugas();
    };

    reader.readAsDataURL(file);
});

// Jalankan
isiPilihanTugas();
tampilkanTugas();
