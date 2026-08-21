import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import {
  RiCameraLine,
  RiEditLine,
  RiSaveLine,
  RiUser3Line,
} from "react-icons/ri";
import { updateProfil } from "../api/userApi"

export default function Profil() {
  const fileInputRef = useRef(null);

  // =========================
  // AMBIL DATA USER
  // =========================

  const userId = localStorage.getItem("userId");
  const namaStorage = localStorage.getItem("nama");

  const [nama, setNama] = useState(namaStorage || "Aizen");
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // =========================
  // PILIH FOTO
  // =========================

  const handleFotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Format tidak valid",
        text: "Silakan pilih file gambar.",
      });

      e.target.value = "";
      return;
    }

    // Validasi ukuran maksimal 2 MB
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Ukuran terlalu besar",
        text: "Ukuran foto maksimal 2 MB.",
      });

      e.target.value = "";
      return;
    }

    // Preview foto
    const imageUrl = URL.createObjectURL(file);

    setFoto({
      file: file,
      preview: imageUrl,
    });
  };

  // =========================
  // SIMPAN PERUBAHAN
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cek ID user
    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "User tidak ditemukan",
        text: "Silakan login kembali.",
      });

      return;
    }

    // Cek nama
    if (!nama.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nama belum diisi",
        text: "Silakan masukkan nama terlebih dahulu.",
      });

      return;
    }

    try {
      setLoading(true);

      console.log("=================================");
      console.log("UPDATE PROFIL");
      console.log("User ID:", userId);
      console.log("Nama:", nama);
      console.log("Foto:", foto?.file);
      console.log("=================================");

      // =========================
      // KIRIM KE BACKEND
      // =========================

      const response = await updateProfil(
        userId,
        nama,
        foto?.file || null
      );

      console.log("RESPONSE BE:", response);

      // =========================
      // UPDATE LOCAL STORAGE
      // =========================

      localStorage.setItem("nama", nama);

      // =========================
      // BERHASIL
      // =========================

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Profil berhasil diperbarui.",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error(
        "ERROR UPDATE PROFIL:",
        error.response?.data || error
      );

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat memperbarui profil.",
      });

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HAPUS FOTO
  // =========================

  const handleHapusFoto = () => {
    setFoto(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================
  // BATAL
  // =========================

  const handleBatal = () => {
    setNama(namaStorage || "Aizen");
    setFoto(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================
  // PREVIEW
  // =========================

  const previewFoto = foto?.preview || null;

  return (
    <div
      className="container-fluid py-4"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: "900px",
        }}
      >
        {/* HEADER */}

        <div className="mb-4">
          <h3 className="fw-bold mb-1">
            Profil Saya
          </h3>

          <p className="text-muted mb-0">
            Kelola informasi profil dan foto kamu
          </p>
        </div>

        {/* CARD */}

        <div className="card border-0 shadow-sm">

          <div className="card-body p-4 p-md-5">

            <form onSubmit={handleSubmit}>

              <div className="row">

                {/* ========================= */}
                {/* FOTO */}
                {/* ========================= */}

                <div className="col-md-4 text-center mb-4 mb-md-0">

                  <div
                    className="mx-auto position-relative"
                    style={{
                      width: "170px",
                      height: "170px",
                    }}
                  >

                    {previewFoto ? (

                      <img
                        src={previewFoto}
                        alt="Foto Profil"
                        className="rounded-circle"
                        style={{
                          width: "170px",
                          height: "170px",
                          objectFit: "cover",
                          border: "5px solid #fff",
                          boxShadow:
                            "0 4px 15px rgba(0,0,0,0.12)",
                        }}
                      />

                    ) : (

                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "170px",
                          height: "170px",
                          backgroundColor: "#e9ecef",
                          border: "5px solid #fff",
                          boxShadow:
                            "0 4px 15px rgba(0,0,0,0.12)",
                        }}
                      >

                        <RiUser3Line
                          size={75}
                          color="#6c757d"
                        />

                      </div>
                    )}

                    {/* CAMERA */}

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="btn btn-primary rounded-circle position-absolute d-flex align-items-center justify-content-center"
                      style={{
                        width: "48px",
                        height: "48px",
                        right: "5px",
                        bottom: "5px",
                      }}
                      title="Ubah foto"
                    >
                      <RiCameraLine size={22} />
                    </button>

                  </div>

                  {/* INPUT FOTO */}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}
                    className="d-none"
                  />

                  <h6 className="fw-semibold mt-4 mb-1">
                    Foto Profil
                  </h6>

                  <small className="text-muted d-block">
                    JPG, JPEG, PNG
                  </small>

                  <small className="text-muted d-block mb-3">
                    Maksimal 2 MB
                  </small>

                  {foto && (
                    <button
                      type="button"
                      onClick={handleHapusFoto}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Hapus Foto
                    </button>
                  )}

                </div>

                {/* ========================= */}
                {/* DATA PROFIL */}
                {/* ========================= */}

                <div className="col-md-8">

                  {/* NAMA */}

                  <div className="mb-4">

                    <label className="form-label fw-semibold">
                      Nama Lengkap
                    </label>

                    <div className="input-group">

                      <span className="input-group-text bg-white">
                        <RiUser3Line size={20} />
                      </span>

                      <input
                        type="text"
                        className="form-control"
                        value={nama}
                        onChange={(e) =>
                          setNama(e.target.value)
                        }
                        placeholder="Masukkan nama lengkap"
                      />

                      <span className="input-group-text bg-white">
                        <RiEditLine size={19} />
                      </span>

                    </div>

                  </div>

                  {/* INFORMASI */}

                  <div
                    className="p-3 rounded-3 mb-4"
                    style={{
                      backgroundColor: "#f8f9fa",
                    }}
                  >

                    <div className="d-flex align-items-center gap-2 mb-2">

                      <RiUser3Line size={20} />

                      <span className="fw-semibold">
                        Informasi Profil
                      </span>

                    </div>

                    <small className="text-muted">
                      Kamu dapat mengubah nama dan foto
                      profil melalui halaman ini.
                    </small>

                  </div>

                  {/* BUTTON */}

                  <div className="d-flex justify-content-end gap-2">

                    <button
                      type="button"
                      className="btn btn-light border px-4"
                      onClick={handleBatal}
                      disabled={loading}
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary px-4 d-flex align-items-center gap-2"
                      disabled={loading}
                    >

                      <RiSaveLine size={20} />

                      {loading
                        ? "Menyimpan..."
                        : "Simpan Perubahan"}

                    </button>

                  </div>

                </div>

              </div>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
}