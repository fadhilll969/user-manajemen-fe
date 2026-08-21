import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginUser } from "../api/userApi";


const EMAIL_REGEX =
    /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@gmail\.com$/;

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const validateEmail = (value) => {
        const emailValue = value.trim();

        if (emailValue === "") {
            return "Email wajib diisi";
        }

        if (!EMAIL_REGEX.test(emailValue)) {
            return "Masukan email Gmail yang valid";
        }

        return "";
    };

    const validatePassword = (value) => {
        if (value === "") {
            return "Kata sandi wajib diisi";
        }

        if (value.length < 8) {
            return "Kata sandi minimal 8 karakter";
        }

        return "";
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
            email.trim() !== "" &&
            password !== "" &&
            !validateEmail(email) &&
            !validatePassword(password)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError || passwordError) {
            setErrors({
                email: emailError,
                password: passwordError,
            });

            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                email: email.trim(),
                password: password,
            };

            console.log("LOGIN PAYLOAD:", payload);
            const data = await loginUser(payload);
            console.log("LOGIN RESPONSE:", data);

            if (data?.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            } else if (data) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data)
                );
            }

            if (data?.token) {
                localStorage.setItem(
                    "token",
                    data.token
                );
            }

            await Swal.fire({
                icon: "success",
                title: "Login berhasil",
                text: "Selamat datang kembali!",
                confirmButtonColor: "#0B2B8E",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/user-management");

        } catch (error) {
            console.error("LOGIN ERROR:", error);

            let message = "Email atau password salah.";

            if (error.response?.data?.message) {
                message = error.response.data.message;
            } else if (error.response?.data?.error) {
                message = error.response.data.error;
            } else if (error.response?.status === 404) {
                message = "Endpoint login tidak ditemukan.";
            } else if (error.response?.status === 401) {
                message = "Email atau password salah.";
            } else if (!error.response) {
                message =
                    "Tidak dapat terhubung ke server backend.";
            }


            Swal.fire({
                icon: "error",
                title: "Login gagal",
                text: message,
                confirmButtonColor: "#0B2B8E",
            });

        } finally {
            setSubmitting(false);
        }
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
                        boxShadow:
                            "0 8px 30px rgba(16,24,40,0.08)",
                    }}
                >

                    <h5 className="fw-bold text-center mb-1">
                        Hai, Selamat Datang Kembali!
                    </h5>

                    <p className="text-muted text-center small mb-4">
                        Memudahkan manajemen dan urus fitur HR
                        dengan mudah
                    </p>
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        <div className="form-floating position-relative mb-1">

                            <input
                                type="email"
                                className={`form-control ${errors.email
                                    ? "is-invalid"
                                    : ""
                                    }`}
                                id="loginEmail"
                                placeholder="Email"
                                value={email}
                                onChange={handleEmailChange}
                                autoComplete="email"
                                style={{
                                    borderRadius: "8px",
                                    paddingRight: "40px",
                                }}
                            />

                            <label
                                htmlFor="loginEmail"
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
                                        transform:
                                            "translateY(-50%)",
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
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                className={`form-control ${errors.password
                                    ? "is-invalid"
                                    : ""
                                    }`}
                                id="loginPassword"
                                placeholder="Kata Sandi"
                                value={password}
                                onChange={handlePasswordChange}
                                autoComplete="current-password"
                                style={{
                                    borderRadius: "8px",
                                    paddingRight: "45px",
                                }}
                            />

                            <label
                                htmlFor="loginPassword"
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
                                    transform:
                                        "translateY(-50%)",
                                }}
                                onClick={() =>
                                    setShowPassword(
                                        (prev) => !prev
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? "Sembunyikan password"
                                        : "Tampilkan password"
                                }
                            >
                                <i
                                    className={`bi ${showPassword
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
                        <div className="text-end mb-3 mt-1">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/register")
                                }
                                className="btn btn-link p-0 small text-decoration-none fw-semibold"
                                style={{
                                    color: "#0B2B8E",
                                }}
                            >
                                Belum Membuat Akun?
                            </button>

                        </div>
                        <button
                            type="submit"
                            className="btn w-100 fw-semibold text-white text-uppercase"
                            disabled={
                                submitting ||
                                !isFormValid()
                            }
                            style={{
                                backgroundColor:
                                    isFormValid() &&
                                        !submitting
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
                                : "Masuk"}

                        </button>
                        <p
                            className="text-center text-muted mt-3 mb-0"
                            style={{
                                fontSize: "11px",
                                lineHeight: 1.5,
                            }}
                        >
                            Dengan masuk ke dalam akun,
                            kamu menyetujui{" "}

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