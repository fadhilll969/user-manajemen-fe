import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const TITLE_OPTIONS = [
    { value: "Tn", label: "Tuan" },
    { value: "Ny", label: "Nyonya" },
    { value: "Nn", label: "Nona" },
];

const EMAIL_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@gmail\.com$/;
const PASSWORD_REGEX = /^.{8,}$/;

function toInputDateFormat(value) {
    if (!value) return "";
    const parts = value.split("-");
    if (parts.length === 3 && parts[0].length === 2) {
        const [day, month, year] = parts;
        return `${year}-${month}-${day}`;
    }
    return value;
}

export default function EditDataUser() {
    const navigate = useNavigate();
    const location = useLocation();

    const userToEdit = location.state?.user || null;

    const [formData, setFormData] = useState({
        title: userToEdit?.title || "Tn",
        nama: userToEdit?.nama || "",
        noHandphone: userToEdit?.noHandphone?.replace(/\D/g, "").replace(/^62/, "") || "",
        email: userToEdit?.email || "",
        tanggalLahir: toInputDateFormat(userToEdit?.tanggalLahir) || "",
        role: userToEdit?.role || "",
        status: userToEdit?.status || "active", 
        alasanNonAktif: userToEdit?.alasanNonAktif || "",
    });

    const [ubahSandi, setUbahSandi] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState({
        noHandphone: "",
        email: "",
        password: "",
        confirmPassword: "",
        alasanNonAktif: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const validatePhone = (value) => {
        const digitsOnly = value.replace(/\D/g, "");
        const totalWithCountryCode = `62${digitsOnly}`;
        if (digitsOnly === "") return "";
        if (totalWithCountryCode.length > 15) {
            return "Maksimum terdiri dari 15 angka termasuk kode negara";
        }
        return "";
    };

    const validateEmail = (value) => {
        if (value === "") return "";
        if (!EMAIL_REGEX.test(value)) {
            return "Masukkan email yang valid";
        }
        return "";
    };

    const validatePassword = (value) => {
        if (value === "") return "";
        if (!PASSWORD_REGEX.test(value)) {
            return "Kata sandi minimal 8 karakter";
        }
        return "";
    };

    const validateConfirmPassword = (value, pass) => {
        if (value === "") return "";
        if (value !== pass) {
            return "Kata sandi tidak cocok";
        }
        return "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "noHandphone") {
            const digitsOnly = value.replace(/\D/g, "");
            setFormData((prev) => ({ ...prev, noHandphone: digitsOnly }));
            setErrors((prev) => ({ ...prev, noHandphone: validatePhone(digitsOnly) }));
            return;
        }

        if (name === "email") {
            setFormData((prev) => ({ ...prev, email: value }));
            setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setErrors((prev) => ({
            ...prev,
            password: validatePassword(value),
            confirmPassword: validateConfirmPassword(confirmPassword, value),
        }));
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setErrors((prev) => ({
            ...prev,
            confirmPassword: validateConfirmPassword(value, password),
        }));
    };

    const clearField = (name) => {
        setFormData((prev) => ({ ...prev, [name]: "" }));
        if (errors[name] !== undefined) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const formatTanggalLahir = (isoDate) => {
        if (!isoDate) return "";
        if (isoDate.includes("-") && isoDate.split("-")[0].length === 4) {
            const [year, month, day] = isoDate.split("-");
            return `${day}-${month}-${year}`;
        }
        return isoDate;
    };

    const isNonActive = formData.status === "non-active";

    const isFormValid = () => {
        const baseValid =
            formData.nama.trim() !== "" &&
            formData.noHandphone.trim() !== "" &&
            formData.email.trim() !== "" &&
            formData.tanggalLahir.trim() !== "" &&
            formData.role.trim() !== "" &&
            !errors.noHandphone &&
            !errors.email;

        const passwordValid = !ubahSandi || (
            password.trim() !== "" &&
            confirmPassword.trim() !== "" &&
            !errors.password &&
            !errors.confirmPassword
        );

        const alasanValid = !isNonActive || formData.alasanNonAktif.trim() !== "";

        return baseValid && passwordValid && alasanValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const phoneError = validatePhone(formData.noHandphone) || (formData.noHandphone === "" ? "No. Handphone wajib diisi" : "");
        const emailError = validateEmail(formData.email) || (formData.email === "" ? "Email wajib diisi" : "");

        let passwordError = "";
        let confirmPasswordError = "";
        if (ubahSandi) {
            passwordError = validatePassword(password) || (password === "" ? "Kata sandi wajib diisi" : "");
            confirmPasswordError =
                validateConfirmPassword(confirmPassword, password) ||
                (confirmPassword === "" ? "Konfirmasi kata sandi wajib diisi" : "");
        }

        const alasanError = isNonActive && formData.alasanNonAktif.trim() === ""
            ? "Alasan non aktif wajib diisi"
            : "";

        if (
            phoneError || emailError || passwordError || confirmPasswordError || alasanError ||
            !formData.nama || !formData.tanggalLahir || !formData.role
        ) {
            setErrors({
                noHandphone: phoneError,
                email: emailError,
                password: passwordError,
                confirmPassword: confirmPasswordError,
                alasanNonAktif: alasanError,
            });
            return;
        }

        setSubmitting(true);
        setSubmitError("");

        await new Promise((resolve) => setTimeout(resolve, 700));

        try {
            const savedUsers = localStorage.getItem("users_data");
            const users = savedUsers ? JSON.parse(savedUsers) : [];

            const emailDipakaiUserLain = users.some(
                (u) => u.id !== userToEdit?.id && u.email.toLowerCase() === formData.email.trim().toLowerCase()
            );

            if (emailDipakaiUserLain) {
                setSubmitting(false);
                setSubmitError("Ups, terjadi kesalahan. Pastikan data yang dimasukkan sudah benar. Coba lagi!");
                return;
            }

            const updatedUsers = users.map((u) => {
                if (u.id !== userToEdit?.id) return u;
                return {
                    ...u,
                    title: formData.title,
                    nama: formData.nama,
                    noHandphone: `(+62) ${formData.noHandphone}`,
                    email: formData.email,
                    tanggalLahir: formatTanggalLahir(formData.tanggalLahir),
                    role: formData.role,
                    status: formData.status,
                    alasanNonAktif: isNonActive ? formData.alasanNonAktif : "",
                };
            });

            localStorage.setItem("users_data", JSON.stringify(updatedUsers));

            setSubmitting(false);

            Swal.fire({
                icon: "success",
                title: "Perubahan data berhasil disimpan",
                confirmButtonColor: "#0B2B8E",
            }).then(() => {
                navigate("/user-management");
            });
        } catch (err) {
            setSubmitting(false);
            setSubmitError("Ups, terjadi kesalahan. Pastikan data yang dimasukkan sudah benar. Coba lagi!");
        }
    };

    return (
        <div
            className="d-flex align-items-start justify-content-center"
            style={{ minHeight: "100vh", backgroundColor: "#F8F9FB", paddingTop: "48px", paddingBottom: "48px" }}
        >
            <div style={{ width: "100%", maxWidth: "480px" }}>
                {submitError && (
                    <div
                        className="d-flex align-items-start justify-content-between p-3 mb-3 rounded-3"
                        style={{ background: "#fdeaea", border: "1px solid #f5c2c2" }}
                    >
                        <div className="d-flex align-items-start" style={{ gap: "10px" }}>
                            <i className="bi bi-exclamation-triangle-fill" style={{ color: "#c0392b", marginTop: "2px" }}></i>
                            <span style={{ color: "#c0392b", fontSize: "12.5px" }}>{submitError}</span>
                        </div>
                        <button
                            type="button"
                            className="btn btn-sm p-0"
                            style={{ border: "none", background: "none", color: "#c0392b" }}
                            onClick={() => setSubmitError("")}
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                )}

                <div
                    className="bg-white p-4"
                    style={{ borderRadius: "20px", boxShadow: "0 8px 30px rgba(16,24,40,0.08)" }}>
                    <h5 className="fw-bold text-center mb-4">Edit Data User</h5>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Title</label>
                            <div className="d-flex gap-4">
                                {TITLE_OPTIONS.map((opt) => (
                                    <div className="form-check" key={opt.value}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="title"
                                            id={`title-${opt.value}`}
                                            value={opt.value}
                                            checked={formData.title === opt.value}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label small" htmlFor={`title-${opt.value}`}>
                                            {opt.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Nama Lengkap</label>
                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control"
                                    style={{ borderRadius: "8px", paddingRight: "32px" }}
                                    name="nama"
                                    placeholder="Masukkan Nama Lengkap"
                                    value={formData.nama}
                                    onChange={handleChange}
                                />
                                {formData.nama && (
                                    <button
                                        type="button"
                                        className="btn btn-sm position-absolute top-50 end-0 translate-middle-y text-muted"
                                        style={{ border: "none", background: "none" }}
                                        onClick={() => clearField("nama")}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">No. Handphone</label>
                            <div className="d-flex" style={{ gap: "8px" }}>
                                <div
                                    className="d-flex align-items-center px-2"
                                    style={{
                                        border: "1px solid #D0D5DD",
                                        borderRadius: "8px",
                                        backgroundColor: "#F9FAFB",
                                        minWidth: "78px",
                                    }}
                                >
                                    <span
                                        className="me-1"
                                        style={{
                                            display: "inline-block",
                                            width: "18px",
                                            height: "13px",
                                            background: "linear-gradient(to bottom, #CE1126 50%, #FFFFFF 50%)",
                                            border: "1px solid #E4E7EC",
                                            borderRadius: "2px",
                                        }} >

                                    </span>
                                    <span className="small text-muted">+62</span>
                                </div>
                                <div className="position-relative flex-grow-1">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        className={`form-control ${errors.noHandphone ? "is-invalid" : ""}`}
                                        style={{ borderRadius: "8px", paddingRight: "32px" }}
                                        name="noHandphone"
                                        placeholder="Cth : 812-xxx-xxx"
                                        value={formData.noHandphone}
                                        onChange={handleChange}
                                    />
                                    {formData.noHandphone && (
                                        <button
                                            type="button"
                                            className="btn btn-sm position-absolute top-50 end-0 translate-middle-y text-muted"
                                            style={{ border: "none", background: "none" }}
                                            onClick={() => clearField("noHandphone")}
                                        >
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                            {errors.noHandphone && <div className="text-danger small mt-1">{errors.noHandphone}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Email</label>
                            <div className="position-relative">
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                    style={{ borderRadius: "8px", paddingRight: "32px" }}
                                    name="email"
                                    placeholder="Misal : hicolleagues@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {formData.email && (
                                    <button
                                        type="button"
                                        className="btn btn-sm position-absolute top-50 end-0 translate-middle-y text-muted"
                                        style={{ border: "none", background: "none" }}
                                        onClick={() => clearField("email")}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                )}
                            </div>
                            {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Tanggal Lahir</label>
                            <input
                                type="date"
                                className="form-control"
                                style={{ borderRadius: "8px" }}
                                name="tanggalLahir"
                                value={formData.tanggalLahir}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Roles</label>
                            <select
                                className="form-select"
                                style={{ borderRadius: "8px" }}
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="" disabled>
                                    Pilih Role
                                </option>
                                <option value="Admin">Admin</option>
                                <option value="Member">Member</option>
                            </select>
                        </div>

                        <hr className="my-4" />

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="ubahSandi"
                                checked={ubahSandi}
                                onChange={(e) => setUbahSandi(e.target.checked)}
                            />
                            <label className="form-check-label small fw-semibold" htmlFor="ubahSandi">
                                Ubah Kata Sandi
                            </label>
                        </div>

                        {ubahSandi && (
                            <>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold small">Kata Sandi Baru</label>
                                    <div className="position-relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                            id="editPasswordBaru"
                                            style={{
                                                borderRadius: "8px",
                                                paddingRight: "32px",
                                                WebkitAppearance: "none",
                                                MozAppearance: "textfield",
                                            }}
                                            placeholder="Masukkan Kata Sandi Baru"
                                            value={password}
                                            onChange={handlePasswordChange}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm position-absolute top-50 end-0 translate-middle-y text-muted"
                                            style={{ border: "none", background: "none" }}
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                        </button>
                                    </div>
                                    {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold small">Konfirmasi Kata Sandi Baru</label>
                                    <div className="position-relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                                            id="editPasswordKonfirmasi"
                                            style={{
                                                borderRadius: "8px",
                                                paddingRight: "32px",
                                                WebkitAppearance: "none",
                                                MozAppearance: "textfield",
                                            }}
                                            placeholder="Masukkan Ulang Kata Sandi Baru"
                                            value={confirmPassword}
                                            onChange={handleConfirmPasswordChange}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm position-absolute top-50 end-0 translate-middle-y text-muted"
                                            style={{ border: "none", background: "none" }}
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        >
                                            <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <div className="text-danger small mt-1">{errors.confirmPassword}</div>}
                                </div>

                                <style>{`
                                    #editPasswordBaru::-ms-reveal,
                                    #editPasswordBaru::-ms-clear,
                                    #editPasswordKonfirmasi::-ms-reveal,
                                    #editPasswordKonfirmasi::-ms-clear {
                                        display: none;
                                    }
                                `}</style>
                            </>
                        )}

                        {isNonActive && (
                            <div className="mb-4">
                                <label className="form-label fw-semibold small">Alasan Non Aktif</label>
                                <textarea
                                    className={`form-control ${errors.alasanNonAktif ? "is-invalid" : ""}`}
                                    style={{ borderRadius: "8px" }}
                                    rows={3}
                                    placeholder="Masukkan alasan non aktif"
                                    name="alasanNonAktif"
                                    value={formData.alasanNonAktif}
                                    onChange={handleChange}
                                />
                                {errors.alasanNonAktif && <div className="text-danger small mt-1">{errors.alasanNonAktif}</div>}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn w-100 fw-semibold text-white text-uppercase"
                            disabled={submitting}
                            style={{
                                backgroundColor: (isFormValid() && !submitting) ? "#0B2B8E" : "#A0A3BD",
                                borderRadius: "999px",
                                padding: "12px 0",
                                letterSpacing: "0.5px",
                                border: "none",
                                transition: "background-color 0.2s ease",
                            }}
                        >
                            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/user-management")}
                            className="btn w-100 fw-semibold text-white text-uppercase mt-2"
                            style={{
                                backgroundColor: isFormValid() ? "#77797c" : "#8d8e94",
                                borderRadius: "999px",
                                padding: "12px 0",
                                letterSpacing: "0.5px",
                                border: "none",
                                transition: "background-color 0.2s ease",
                            }}
                        >
                            Kembali
                        </button>
                    </form>
                </div>

                {isNonActive && (
                    <div className="text-muted small mt-3 px-2">
                        <strong>CATATAN:</strong> Form Edit Data User untuk user berstatus <strong>Non Active</strong> menampilkan field tambahan{" "}
                        <strong>"Alasan Non Aktif"</strong> yang wajib diisi.
                    </div>
                )}
            </div>
        </div>
    );
}