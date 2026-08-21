import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createUser } from "../api/userApi";

const EMAIL_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@gmail\.com$/;

export default function Register() {
    const navigate = useNavigate();

    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState({
        nama: "",
        email: "",
        password: "",
    });

    const [submitting, setSubmitting] = useState(false);

    const validateNama = (value) => {
        if (value.trim() === "") {
            return "Nama wajib diisi";
        }

        return "";
    };

    const validateEmail = (value) => {
        const emailValue = value.trim();

        if (emailValue === "") {
            return "Email wajib diisi";
        }

        if (!EMAIL_REGEX.test(emailValue)) {
            return "Masukkan email Gmail yang valid";
        }

        return "";
    };

    const validatePassword = (value) => {
        if (value.trim() === "") {
            return "Kata sandi wajib diisi";
        }

        if (value.length < 8) {
            return "Kata sandi minimal 8 karakter";
        }

        return "";
    };

    const handleNamaChange = (e) => {
        const value = e.target.value;

        setNama(value);

        setErrors((prev) => ({
            ...prev,
            nama: validateNama(value),
        }));
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;

        setEmail(value);

        setErrors((prev) => ({
            ...prev,
            email: validateEmail(value),
        }));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;

        setPassword(value);

        setErrors((prev) => ({
            ...prev,
            password: validatePassword(value),
        }));
    };

    const isFormValid = () => {
        return (
            nama.trim() !== "" &&
            email.trim() !== "" &&
            password.trim() !== "" &&
            !errors.nama &&
            !errors.email &&
            !errors.password
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const namaError = validateNama(nama);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (namaError || emailError || passwordError) {
            setErrors({
                nama: namaError,
                email: emailError,
                password: passwordError,
            });

            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                nama: nama.trim(),
                email: email.trim(),
                password: password,
            };

            console.log("Data register:", payload);

            const data = await createUser(payload);

            console.log("Register berhasil:", data);

            await Swal.fire({
                icon: "success",
                title: "Register berhasil",
                text: "Akun berhasil dibuat!",
                confirmButtonColor: "#0B2B8E",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/");
        } catch (error) {
            console.error("Register error:", error);

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Server sedang tidak dapat diakses.";

            Swal.fire({
                icon: "error",
                title: "Register gagal",
                text: message,
                confirmButtonColor: "#0B2B8E",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const clearNama = () => {
        setNama("");

        setErrors((prev) => ({
            ...prev,
            nama: "",
        }));
    };

    const clearEmail = () => {
        setEmail("");

        setErrors((prev) => ({
            ...prev,
            email: "",
        }));
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: "100vh",
                backgroundColor: "#EEF1FB",
                padding: "24px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "400px",
                }}
            >
                <div
                    className="bg-white p-4"
                    style={{
                        borderRadius: "20px",
                        boxShadow: "0 8px 30px rgba(16,24,40,0.08)",
                    }}
                >
                    <h5 className="fw-bold text-center mb-1">
                        Buat Akun Baru
                    </h5>

                    <p className="text-muted text-center small mb-4">
                        Daftarkan akun untuk mulai menggunakan sistem
                    </p>

                    <form onSubmit={handleSubmit} noValidate>

                        <div className="form-floating position-relative mb-1">
                            <input
                                type="text"
                                className={`form-control ${
                                    errors.nama ? "is-invalid" : ""
                                }`}
                                id="registerNama"
                                placeholder="Nama"
                                value={nama}
                                onChange={handleNamaChange}
                                style={{
                                    borderRadius: "8px",
                                    paddingRight: "34px",
                                }}
                            />

                            <label
                                htmlFor="registerNama"
                                className="text-muted"
                            >
                                Nama
                            </label>

                            {nama && (
                                <button
                                    type="button"
                                    className="btn btn-sm position-absolute text-muted"
                                    style={{
                                        border: "none",
                                        background: "none",
                                        right: "6px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                    }}
                                    onClick={clearNama}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            )}
                        </div>

                        {errors.nama && (
                            <div className="text-danger small mb-2">
                                {errors.nama}
                            </div>
                        )}

                        <div className="form-floating position-relative mb-1 mt-3">
                            <input
                                type="email"
                                className={`form-control ${
                                    errors.email ? "is-invalid" : ""
                                }`}
                                id="registerEmail"
                                placeholder="Email"
                                value={email}
                                onChange={handleEmailChange}
                                style={{
                                    borderRadius: "8px",
                                    paddingRight: "34px",
                                }}
                            />

                            <label
                                htmlFor="registerEmail"
                                className="text-muted"
                            >
                                Email
                            </label>

                            {email && (
                                <button
                                    type="button"
                                    className="btn btn-sm position-absolute text-muted"
                                    style={{
                                        border: "none",
                                        background: "none",
                                        right: "6px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                    }}
                                    onClick={clearEmail}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            )}
                        </div>

                        {errors.email && (
                            <div className="text-danger small mb-2">
                                {errors.email}
                            </div>
                        )}

                        <div className="form-floating position-relative mb-1 mt-3">
                            <input
                                type={
                                    showPassword ? "text" : "password"
                                }
                                className={`form-control ${
                                    errors.password ? "is-invalid" : ""
                                }`}
                                id="registerPassword"
                                placeholder="Kata Sandi"
                                value={password}
                                onChange={handlePasswordChange}
                                style={{
                                    borderRadius: "8px",
                                    paddingRight: "45px",
                                }}
                            />

                            <label
                                htmlFor="registerPassword"
                                className="text-muted"
                            >
                                Kata Sandi
                            </label>

                            <button
                                type="button"
                                className="btn btn-sm position-absolute text-muted"
                                style={{
                                    border: "none",
                                    background: "none",
                                    right: "6px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                }}
                                onClick={() =>
                                    setShowPassword((prev) => !prev)
                                }
                            >
                                <i
                                    className={`bi ${
                                        showPassword
                                            ? "bi-eye-slash"
                                            : "bi-eye"
                                    }`}
                                ></i>
                            </button>
                        </div>

                        {errors.password && (
                            <div className="text-danger small mb-2">
                                {errors.password}
                            </div>
                        )}

                        <div className="text-end mb-3 mt-3">
                            <button
                                type="button"
                                className="btn btn-link p-0 small text-decoration-none fw-semibold"
                                style={{
                                    color: "#0B2B8E",
                                }}
                                onClick={() => navigate("/")}
                            >
                                Sudah Memiliki Akun?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 fw-semibold text-white text-uppercase"
                            disabled={
                                submitting || !isFormValid()
                            }
                            style={{
                                backgroundColor:
                                    isFormValid() && !submitting
                                        ? "#0B2B8E"
                                        : "#A0A3BD",
                                borderRadius: "999px",
                                padding: "12px 0",
                                letterSpacing: "0.5px",
                                border: "none",
                                transition:
                                    "background-color 0.2s ease",
                            }}
                        >
                            {submitting
                                ? "Memproses..."
                                : "Daftar"}
                        </button>

                        <p
                            className="text-center text-muted mt-3 mb-0"
                            style={{
                                fontSize: "11px",
                                lineHeight: 1.5,
                            }}
                        >
                            Dengan membuat akun, kamu menyetujui{" "}
                            <a
                                href="#"
                                className="fw-semibold text-decoration-none"
                                style={{
                                    color: "#0B2B8E",
                                }}
                            >
                                Syarat & Ketentuan
                            </a>{" "}
                            dan{" "}
                            <a
                                href="#"
                                className="fw-semibold text-decoration-none"
                                style={{
                                    color: "#0B2B8E",
                                }}
                            >
                                Kebijakan Privasi
                            </a>{" "}
                            kami.
                        </p>
                    </form>

                    <p
                        className="text-center text-muted mt-4 mb-0"
                        style={{
                            fontSize: "11px",
                        }}
                    >
                        ©Copyright 2026
                    </p>
                </div>
            </div>
        </div>
    );
}