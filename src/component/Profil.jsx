import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    RiCameraLine,
    RiEditLine,
    RiSaveLine,
    RiUser3Line,
} from "react-icons/ri";


const API_URL =
    "https://user-manajemen-be-production.up.railway.app";


const Profil = () => {

        const navigate = useNavigate();

    const fileInputRef =
        useRef(null);


    const [nama, setNama] =
        useState("");


    const [fotoAwal, setFotoAwal] =
        useState(null);


    const [foto, setFoto] =
        useState(null);


    const [loading, setLoading] =
        useState(true);


    const [saving, setSaving] =
        useState(false);


    const [profilAda, setProfilAda] =
        useState(false);

    useEffect(() => {

        const getProfil = async () => {

            try {

                setLoading(true);


                const response =
                    await axios.get(
                        `${API_URL}/profil`
                    );


                console.log(
                    "DATA PROFIL:",
                    response.data
                );


                const data =
                    response.data.data;


                setNama(
                    data.nama || ""
                );


                setProfilAda(
                    true
                );

                if (data.foto) {

                    const fotoUrl =
                        `${API_URL}/uploads/profil/${data.foto}`;


                    setFotoAwal(
                        fotoUrl
                    );


                    localStorage.setItem(
                        "foto",
                        fotoUrl
                    );

                } else {

                    setFotoAwal(
                        null
                    );


                    localStorage.removeItem(
                        "foto"
                    );

                }

                localStorage.setItem(
                    "nama",
                    data.nama || ""
                );


                window.dispatchEvent(
                    new Event(
                        "profilUpdated"
                    )
                );


            } catch (error) {

                console.error(
                    "ERROR GET PROFIL:",
                    error.response?.data ||
                    error
                );


                if (
                    error.response?.status === 404
                ) {

                    setProfilAda(
                        false
                    );


                    setNama(
                        localStorage.getItem(
                            "nama"
                        ) || ""
                    );


                    setFotoAwal(
                        null
                    );

                } else {

                    Swal.fire({

                        icon: "error",

                        title:
                            "Gagal mengambil profil",

                        text:
                            error.response?.data?.message ||
                            "Terjadi kesalahan saat mengambil profil.",
                    });
              }
            } finally {

                setLoading(
                    false
                );
            }
        };
        getProfil();
    }, []);

    const handleFotoChange = (
        e
    ) => {

        const file =
            e.target.files?.[0];


        if (!file) {

            return;

        }

        const allowedTypes = [

            "image/jpeg",

            "image/png",

            "image/webp"

        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            Swal.fire({

                icon: "error",

                title:
                    "Format tidak didukung",

                text:
                    "Gunakan format JPG, JPEG, PNG, atau WEBP.",

            });

            e.target.value = "";
            return;
        }

        if (
            file.size >
            2 * 1024 * 1024
        ) {

            Swal.fire({

                icon: "error",

                title:
                    "Ukuran terlalu besar",

                text:
                    "Ukuran foto maksimal 2 MB.",
            });

            e.target.value = "";
            return;
        }

        const preview =
            URL.createObjectURL(
                file
            );


        setFoto({

            file: file,

            preview: preview

        });

    };

    const handlePilihFoto = () => {

        fileInputRef.current?.click();

    };

   const handleBatal = () => {
    setFoto(null);

    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }

    navigate("/user-management");
};


    const handleSubmit = async (
        e
    ) => {

        e.preventDefault();


        if (
            !nama.trim()
        ) {

            Swal.fire({

                icon: "warning",

                title:
                    "Nama belum diisi",

                text:
                    "Silakan isi nama terlebih dahulu.",

            });

            return;

        }


        try {

            setSaving(
                true
            );


            const formData =
                new FormData();


            formData.append(

                "nama",

                nama.trim()

            );


            if (
                foto?.file
            ) {

                formData.append(

                    "foto",

                    foto.file

                );

            }


            let response;

            if (profilAda) {

                response =
                    await axios.put(

                        `${API_URL}/profil`,

                        formData

                    );

            }

            else {

                response =
                    await axios.post(

                        `${API_URL}/profil`,

                        formData

                    );

            }


            console.log(
                "RESPONSE SIMPAN PROFIL:",
                response.data
            );


            const data =
                response.data.data;

            setNama(
                data.nama
            );


            localStorage.setItem(

                "nama",

                data.nama

            );
            if (
                data.foto
            ) {

                const fotoUrl =
                    `${API_URL}/uploads/profil/${data.foto}`;


                setFotoAwal(
                    fotoUrl
                );


                localStorage.setItem(

                    "foto",

                    fotoUrl

                );

            }


            setFoto(
                null
            );


            setProfilAda(
                true
            );


            if (
                fileInputRef.current
            ) {

                fileInputRef.current.value =
                    "";

            }

            window.dispatchEvent(

                new Event(
                    "profilUpdated"
                )

            );


            Swal.fire({

                icon: "success",

                title:
                    "Berhasil!",

                text:

                    response.data.message ||

                    "Profil berhasil disimpan.",

                timer: 1500,

                showConfirmButton: false,

            });


        } catch (error) {

            console.error(
                "ERROR SIMPAN PROFIL:",
                error.response?.data ||
                error
            );


            Swal.fire({

                icon: "error",

                title:
                    "Gagal",

                text:

                    error.response?.data?.message ||

                    "Terjadi kesalahan saat menyimpan profil.",

            });


        } finally {

            setSaving(
                false
            );

        }

    };

    const previewFoto =
        foto?.preview ||
        fotoAwal;

    if (loading) {

        return (

            <div
                className="d-flex justify-content-center align-items-center"
                style={{
                    minHeight: "80vh"
                }}
            >

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

            </div>

        );

    }


    return (

        <div
            className="container-fluid py-4"
        >

            <div
                className="mx-auto"
                style={{
                    maxWidth: "900px"
                }}
            >

                <div
                    className="mb-4"
                >

                    <h2
                        className="fw-bold mb-1"
                    >
                        Profil Saya
                    </h2>


                    <p
                        className="text-muted mb-0"
                    >
                        Kelola informasi profil dan foto kamu
                    </p>

                </div>

                <div
                    className="card border-0 shadow-sm"
                >

                    <div
                        className="card-body p-4 p-md-5"
                    >

                        <form
                            onSubmit={handleSubmit}
                        >

                            <div
                                className="row align-items-center"
                            >

                                <div
                                    className="col-md-4 text-center mb-4 mb-md-0"
                                >

                                    <div
                                        className="position-relative mx-auto"
                                        style={{
                                            width: "170px",
                                            height: "170px"
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
                                                    border:
                                                        "5px solid white",
                                                    boxShadow:
                                                        "0 4px 20px rgba(0,0,0,0.15)"
                                                }}
                                            />

                                        ) : (

                                            <div
                                                className="rounded-circle d-flex justify-content-center align-items-center"
                                                style={{
                                                    width: "170px",
                                                    height: "170px",
                                                    background:
                                                        "#eef1f5",
                                                    border:
                                                        "5px solid white",
                                                    boxShadow:
                                                        "0 4px 20px rgba(0,0,0,0.15)"
                                                }}
                                            >

                                                <RiUser3Line
                                                    size={80}
                                                    color="#6c757d"
                                                />

                                            </div>

                                        )}


                                        <button
                                            type="button"
                                            onClick={
                                                handlePilihFoto
                                            }
                                            className="btn btn-primary rounded-circle position-absolute d-flex justify-content-center align-items-center"
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                right: "0",
                                                bottom: "0"
                                            }}
                                        >

                                            <RiCameraLine
                                                size={22}
                                            />

                                        </button>

                                    </div>


                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp"
                                        onChange={
                                            handleFotoChange
                                        }
                                        className="d-none"
                                    />


                                    <h6
                                        className="fw-semibold mt-4 mb-1"
                                    >
                                        Foto Profil
                                    </h6>


                                    <small
                                        className="text-muted d-block"
                                    >
                                        JPG, JPEG, PNG, WEBP
                                    </small>


                                    <small
                                        className="text-muted d-block"
                                    >
                                        Maksimal 2 MB
                                    </small>

                                </div>

                                <div
                                    className="col-md-8"
                                >

                                    <div
                                        className="mb-4"
                                    >

                                        <label
                                            className="form-label fw-semibold"
                                        >
                                            Nama Lengkap
                                        </label>


                                        <div
                                            className="input-group"
                                        >

                                            <span
                                                className="input-group-text bg-white"
                                            >

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


                                            <span
                                                className="input-group-text bg-white"
                                            >

                                                <RiEditLine
                                                    size={20}
                                                />

                                            </span>

                                        </div>

                                    </div>

                                    <div
                                        className="p-3 rounded mb-4"
                                        style={{
                                            background:
                                                "#f6f7f9"
                                        }}
                                    >

                                        <div
                                            className="d-flex gap-2"
                                        >

                                            <RiUser3Line
                                                size={20}
                                                className="mt-1"
                                            />


                                            <div>

                                                <h6
                                                    className="fw-semibold mb-2"
                                                >
                                                    Informasi Profil
                                                </h6>


                                                <p
                                                    className="text-muted mb-0 small"
                                                >
                                                    Kamu dapat mengubah nama
                                                    dan foto profil melalui
                                                    halaman ini.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    <div
                                        className="d-flex justify-content-end gap-2"
                                    >

                                        <button
                                            type="button"
                                            className="btn btn-light border px-4"
                                            onClick={
                                                handleBatal
                                            }
                                            disabled={
                                                saving
                                            }
                                        >
                                            Batal
                                        </button>


                                        <button
                                            type="submit"
                                            className="btn btn-primary px-4 d-flex align-items-center gap-2"
                                            disabled={
                                                saving
                                            }
                                        >

                                            {saving ? (

                                                <>

                                                    <span
                                                        className="spinner-border spinner-border-sm"
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

};


export default Profil;