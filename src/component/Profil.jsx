import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import {
    RiCameraLine,
    RiEditLine,
    RiSaveLine,
    RiUser3Line,
} from "react-icons/ri";

const API_URL =
    "https://user-manajemen-be-production.up.railway.app";

export default function Profil() {
    const fileInputRef = useRef(null);

    const userId = localStorage.getItem("userId");

    const [nama, setNama] = useState(
        localStorage.getItem("nama") || "Aizen"
    );

    const [fotoAwal, setFotoAwal] = useState(
        localStorage.getItem("foto") || null
    );

    const [foto, setFoto] = useState(null);

    const [loading, setLoading] = useState(false);

    // ==========================================
    // LOAD PROFIL DARI BACKEND
    // ==========================================

    useEffect(() => {
        const loadProfil = async () => {
            if (!userId) return;

            try {
                const response = await axios.get(
                    `${API_URL}/profil/${userId}`
                );

                if (response.data?.data) {
                    const data = response.data.data;

                    setNama(data.nama || "Aizen");

                    localStorage.setItem(
                        "nama",
                        data.nama || "Aizen"
                    );

                    if (data.foto) {
                        const fotoUrl =
                            `${API_URL}/uploads/profil/${data.foto}`;

                        setFotoAwal(fotoUrl);

                        localStorage.setItem(
                            "foto",
                            fotoUrl
                        );
                    } else {
                        setFotoAwal(null);
                        localStorage.removeItem("foto");
                    }
                }
            } catch (error) {
                console.error(
                    "ERROR LOAD PROFIL:",
                    error.response?.data || error
                );
            }
        };

        loadProfil();
    }, [userId]);

    // ==========================================
    // PILIH FOTO
    // ==========================================

    const handleFotoChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        // Validasi tipe
        if (!file.type.startsWith("image/")) {
            Swal.fire({
                icon: "error",
                title: "Format tidak valid",
                text: "Silakan pilih file gambar.",
            });

            e.target.value = "";
            return;
        }

        // Validasi ukuran
        if (file.size > 2 * 1024 * 1024) {
            Swal.fire({
                icon: "error",
                title: "Ukuran terlalu besar",
                text: "Ukuran foto maksimal 2 MB.",
            });

            e.target.value = "";
            return;
        }

        const imageUrl = URL.createObjectURL(file);

        setFoto({
            file: file,
            preview: imageUrl,
        });
    };

    // ==========================================
    // SIMPAN PERUBAHAN
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nama.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Nama belum diisi",
                text: "Silakan masukkan nama terlebih dahulu.",
            });

            return;
        }

        if (!userId) {
            Swal.fire({
                icon: "error",
                title: "User tidak ditemukan",
                text: "Silakan login kembali.",
            });

            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append(
                "nama",
                nama.trim()
            );

            if (foto?.file) {
                formData.append(
                    "foto",
                    foto.file
                );
            }

            console.log("=================================");
            console.log("UPDATE PROFIL");
            console.log("USER ID:", userId);
            console.log("NAMA:", nama);
            console.log("FOTO:", foto?.file);
            console.log("=================================");

            const response = await axios.put(
                `${API_URL}/profil/${userId}`,
                formData
            );

            console.log(
                "RESPONSE BE:",
                response.data
            );

            const data = response.data.data;

            // ==========================================
            // SIMPAN NAMA
            // ==========================================

            localStorage.setItem(
                "nama",
                data.nama
            );

            setNama(data.nama);

            // ==========================================
            // SIMPAN FOTO
            // ==========================================

            if (data.foto) {
                const fotoUrl =
                    `${API_URL}/uploads/profil/${data.foto}`;

                setFotoAwal(fotoUrl);

                localStorage.setItem(
                    "foto",
                    fotoUrl
                );
            }

            // Foto baru sudah tersimpan di server
            setFoto(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            // ==========================================
            // KASIH TAU SIDEBAR
            // ==========================================

            window.dispatchEvent(
                new Event("profilUpdated")
            );

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

    // ==========================================
    // HAPUS FOTO PREVIEW
    // ==========================================

    const handleHapusFoto = () => {
        setFoto(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // ==========================================
    // BATAL
    // ==========================================

    const handleBatal = () => {
        setNama(
            localStorage.getItem("nama") || "Aizen"
        );

        setFoto(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // ==========================================
    // PREVIEW
    // ==========================================

    const previewFoto =
        foto?.preview || fotoAwal;

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

                                {/* FOTO */}

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
                                                onError={(e) => {
                                                    e.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />

                                        ) : (

                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: "170px",
                                                    height: "170px",
                                                    backgroundColor:
                                                        "#e9ecef",
                                                    border:
                                                        "5px solid #fff",
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
                                            <RiCameraLine
                                                size={22}
                                            />
                                        </button>

                                    </div>

                                    {/* INPUT */}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={
                                            handleFotoChange
                                        }
                                        className="d-none"
                                    />

                                    <h6 className="fw-semibold mt-4 mb-1">
                                        Foto Profil
                                    </h6>

                                    <small className="text-muted d-block">
                                        JPG, JPEG, PNG, WEBP
                                    </small>

                                    <small className="text-muted d-block mb-3">
                                        Maksimal 2 MB
                                    </small>

                                    {foto && (
                                        <button
                                            type="button"
                                            onClick={
                                                handleHapusFoto
                                            }
                                            className="btn btn-sm btn-outline-danger"
                                        >
                                            Hapus Foto
                                        </button>
                                    )}

                                </div>

                                {/* DATA PROFIL */}

                                <div className="col-md-8">

                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Nama Lengkap
                                        </label>

                                        <div className="input-group">

                                            <span className="input-group-text bg-white">
                                                <RiUser3Line
                                                    size={20}
                                                />
                                            </span>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={nama}
                                                onChange={(e) =>
                                                    setNama(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Masukkan nama lengkap"
                                            />

                                            <span className="input-group-text bg-white">
                                                <RiEditLine
                                                    size={19}
                                                />
                                            </span>

                                        </div>

                                    </div>

                                    {/* INFORMASI */}

                                    <div
                                        className="p-3 rounded-3 mb-4"
                                        style={{
                                            backgroundColor:
                                                "#f8f9fa",
                                        }}
                                    >

                                        <div className="d-flex align-items-center gap-2 mb-2">

                                            <RiUser3Line
                                                size={20}
                                            />

                                            <span className="fw-semibold">
                                                Informasi Profil
                                            </span>

                                        </div>

                                        <small className="text-muted">
                                            Kamu dapat mengubah
                                            nama dan foto profil
                                            melalui halaman ini.
                                        </small>

                                    </div>

                                    {/* BUTTON */}

                                    <div className="d-flex justify-content-end gap-2">

                                        <button
                                            type="button"
                                            className="btn btn-light border px-4"
                                            onClick={
                                                handleBatal
                                            }
                                            disabled={loading}
                                        >
                                            Batal
                                        </button>

                                        <button
                                            type="submit"
                                            className="btn btn-primary px-4 d-flex align-items-center gap-2"
                                            disabled={loading}
                                        >

                                            {loading ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm"
                                                        role="status"
                                                    />

                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <RiSaveLine
                                                        size={20}
                                                    />

                                                    Simpan Perubahan
                                                </>
                                            )}

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