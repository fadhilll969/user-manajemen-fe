import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { tambahDataUser } from "../api/userapi";

// =====================================================
// TITLE OPTIONS
// =====================================================

const TITLE_OPTIONS = [
  {
    value: "Tn",
    label: "Tuan",
  },
  {
    value: "Ny",
    label: "Nyonya",
  },
  {
    value: "Nn",
    label: "Nona",
  },
];

// =====================================================
// VALIDASI EMAIL
// Gmail saja
// =====================================================

const EMAIL_REGEX =
  /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@gmail\.com$/;

// =====================================================
// VALIDASI PASSWORD
// Minimal 8 karakter
// =====================================================

const PASSWORD_REGEX = /^.{8,}$/;

export default function TambahDataUser() {
  const navigate = useNavigate();

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    title: "Tn",
    nama: "",
    noHandphone: "",
    email: "",
    tanggalLahir: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  // =====================================================
  // ERROR
  // =====================================================

  const [errors, setErrors] = useState({
    nama: "",
    noHandphone: "",
    email: "",
    tanggalLahir: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(false);

  // =====================================================
  // VALIDASI NOMOR HP
  // =====================================================

  const validatePhone = (value) => {
    const digitsOnly = value.replace(/\D/g, "");

    if (digitsOnly === "") {
      return "";
    }

    const totalWithCountryCode = `62${digitsOnly}`;

    if (totalWithCountryCode.length > 15) {
      return "Maksimum terdiri dari 15 angka termasuk kode negara";
    }

    if (digitsOnly.length < 8) {
      return "Nomor handphone minimal 8 angka";
    }

    return "";
  };

  // =====================================================
  // VALIDASI EMAIL
  // =====================================================

  const validateEmail = (value) => {
    if (value === "") {
      return "";
    }

    if (!EMAIL_REGEX.test(value)) {
      return "Masukkan email Gmail yang valid";
    }

    return "";
  };

  // =====================================================
  // VALIDASI PASSWORD
  // =====================================================

  const validatePassword = (value) => {
    if (value === "") {
      return "";
    }

    if (!PASSWORD_REGEX.test(value)) {
      return "Kata sandi minimal 8 karakter";
    }

    return "";
  };

  // =====================================================
  // VALIDASI CONFIRM PASSWORD
  // =====================================================

  const validateConfirmPassword = (value, password) => {
    if (value === "") {
      return "";
    }

    if (value !== password) {
      return "Kata sandi tidak cocok";
    }

    return "";
  };

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ===================================================
    // NOMOR HP
    // ===================================================

    if (name === "noHandphone") {
      const digitsOnly = value.replace(/\D/g, "");

      setFormData((prev) => ({
        ...prev,
        noHandphone: digitsOnly,
      }));

      setErrors((prev) => ({
        ...prev,
        noHandphone: validatePhone(digitsOnly),
      }));

      return;
    }

    // ===================================================
    // EMAIL
    // ===================================================

    if (name === "email") {
      setFormData((prev) => ({
        ...prev,
        email: value,
      }));

      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));

      return;
    }

    // ===================================================
    // PASSWORD
    // ===================================================

    if (name === "password") {
      setFormData((prev) => ({
        ...prev,
        password: value,
      }));

      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
        confirmPassword: validateConfirmPassword(
          formData.confirmPassword,
          value
        ),
      }));

      return;
    }

    // ===================================================
    // CONFIRM PASSWORD
    // ===================================================

    if (name === "confirmPassword") {
      setFormData((prev) => ({
        ...prev,
        confirmPassword: value,
      }));

      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(
          value,
          formData.password
        ),
      }));

      return;
    }

    // ===================================================
    // INPUT LAIN
    // ===================================================

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =====================================================
  // CLEAR FIELD
  // =====================================================

  const clearField = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: "",
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =====================================================
  // FORMAT TANGGAL
  // YYYY-MM-DD → DD-MM-YYYY
  // =====================================================

  const formatTanggalLahir = (isoDate) => {
    if (!isoDate) {
      return "";
    }

    const [year, month, day] = isoDate.split("-");

    return `${day}-${month}-${year}`;
  };

  // =====================================================
  // FORM VALID
  // =====================================================

  const isFormValid = () => {
    return (
      formData.nama.trim() !== "" &&
      formData.noHandphone.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.tanggalLahir.trim() !== "" &&
      formData.role.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.confirmPassword.trim() !== "" &&
      !errors.nama &&
      !errors.noHandphone &&
      !errors.email &&
      !errors.tanggalLahir &&
      !errors.role &&
      !errors.password &&
      !errors.confirmPassword &&
      formData.password === formData.confirmPassword
    );
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    // ===================================================
    // VALIDASI
    // ===================================================

    const phoneError =
      validatePhone(formData.noHandphone) ||
      (formData.noHandphone === ""
        ? "No. Handphone wajib diisi"
        : "");

    const emailError =
      validateEmail(formData.email) ||
      (formData.email === ""
        ? "Email wajib diisi"
        : "");

    const passwordError =
      validatePassword(formData.password) ||
      (formData.password === ""
        ? "Kata sandi wajib diisi"
        : "");

    const confirmPasswordError =
      validateConfirmPassword(
        formData.confirmPassword,
        formData.password
      ) ||
      (formData.confirmPassword === ""
        ? "Konfirmasi kata sandi wajib diisi"
        : "");

    const namaError = !formData.nama.trim()
      ? "Nama wajib diisi"
      : "";

    const tanggalError = !formData.tanggalLahir
      ? "Tanggal lahir wajib diisi"
      : "";

    const roleError = !formData.role
      ? "Role wajib dipilih"
      : "";

    // ===================================================
    // JIKA VALIDASI GAGAL
    // ===================================================

    if (
      phoneError ||
      emailError ||
      passwordError ||
      confirmPasswordError ||
      namaError ||
      tanggalError ||
      roleError
    ) {
      setErrors({
        nama: namaError,
        noHandphone: phoneError,
        email: emailError,
        tanggalLahir: tanggalError,
        role: roleError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });

      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Silakan periksa kembali data yang diisi.",
        confirmButtonColor: "#0B2B8E",
      });

      return;
    }

    // ===================================================
    // DATA YANG DIKIRIM KE BACKEND
    // ===================================================

    const dataUser = {
      title: formData.title,
      nama: formData.nama.trim(),
      noHandphone: formData.noHandphone,
      email: formData.email.trim(),
      tanggalLahir: formatTanggalLahir(
        formData.tanggalLahir
      ),
      role: formData.role,
      password: formData.password,
      status: "active",
      alasanNonAktif: "",
    };

    console.log("=================================");
    console.log("DATA USER YANG DIKIRIM:");
    console.log(dataUser);
    console.log("=================================");

    // ===================================================
    // KIRIM KE BACKEND
    // ===================================================

    try {
      setLoading(true);

      const result = await tambahDataUser(dataUser);

      console.log("=================================");
      console.log("RESPONSE BACKEND:");
      console.log(result);
      console.log("=================================");

      // =================================================
      // SUCCESS
      // =================================================

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data user berhasil ditambahkan.",
        confirmButtonColor: "#0B2B8E",
      });

      navigate("/user-management");
    } catch (error) {
      console.error("=================================");
      console.error("ERROR TAMBAH DATA USER:");
      console.error(error);
      console.error("=================================");

      let errorMessage =
        "Tidak dapat terhubung ke server.";

      if (error.response) {
        console.error(
          "STATUS:",
          error.response.status
        );

        console.error(
          "DATA:",
          error.response.data
        );

        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.message ||
          "Gagal menambahkan user.";
      } else if (error.request) {
        errorMessage =
          "Server tidak memberikan response. Periksa koneksi backend.";
      } else {
        errorMessage =
          error.message ||
          "Terjadi kesalahan.";
      }

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: errorMessage,
        confirmButtonColor: "#0B2B8E",
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div
      className="d-flex align-items-start justify-content-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#F8F9FB",
        paddingTop: "48px",
        paddingBottom: "48px",
      }}
    >
      <div
        className="bg-white p-4"
        style={{
          width: "100%",
          maxWidth: "480px",
          borderRadius: "20px",
          boxShadow:
            "0 8px 30px rgba(16,24,40,0.08)",
        }}
      >
        <h5 className="fw-bold text-center mb-4">
          Buat User
        </h5>

        <form
          onSubmit={handleSubmit}
          noValidate
        >
          {/* TITLE */}

          <div className="mb-3">
            <label className="form-label fw-semibold small">
              Title
            </label>

            <div className="d-flex gap-4">
              {TITLE_OPTIONS.map((opt) => (
                <div
                  className="form-check"
                  key={opt.value}
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name="title"
                    id={`title-${opt.value}`}
                    value={opt.value}
                    checked={
                      formData.title === opt.value
                    }
                    onChange={handleChange}
                  />

                  <label
                    className="form-check-label small"
                    htmlFor={`title-${opt.value}`}
                  >
                    {opt.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* NAMA */}

          <div className="mb-3">
            <label className="form-label fw-semibold small">
              Nama Lengkap
            </label>

            <div className="position-relative">
              <input
                type="text"
                className={`form-control ${
                  errors.nama ? "is-invalid" : ""
                }`}
                style={{
                  borderRadius: "8px",
                  paddingRight: "40px",
                }}
                name="nama"
                placeholder="Masukkan Nama Lengkap"
                value={formData.nama}
                onChange={handleChange}
              />

              {formData.nama && (
                <button
                  type="button"
                  className="btn btn-sm position-absolute top-50 end-0 translate-middle-y text-muted"
                  style={{
                    border: "none",
                    background: "none",
                  }}
                  onClick={() =>
                    clearField("nama")
                  }
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>

            {errors.nama && (
              <div className="text-danger small mt-1">
                {errors.nama}
              </div>
            )}
          </div>

          {/* NO HP */}

          <div className="mb-3">
            <label className="form-label fw-semibold small">
              No. Handphone
            </label>

            <div
              className="d-flex"
              style={{
                gap: "8px",
              }}
            >
              <div
                className="d-flex align-items-center px-2"
                style={{
                  border:
                    "1px solid #D0D5DD",
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
                    background:
                      "linear-gradient(to bottom, #CE1126 50%, #FFFFFF 50%)",
                    border:
                      "1px solid #E4E7EC",
                    borderRadius: "2px",
                  }}
                />

                <span className="small text-muted">
                  +62
                </span>
              </div>

              <div className="position-relative flex-grow-1">
                <input
                  type="text"
                  inputMode="numeric"
                  className={`form-control ${
                    errors.noHandphone
                      ? "is-invalid"
                      : ""
                  }`}
                  style={{
                    borderRadius: "8px",
                    paddingRight: "40px",
                  }}
                  name="noHandphone"
                  placeholder="Masukkan Nomor"
                  value={
                    formData.noHandphone
                  }
                  onChange={handleChange}
                />

                {formData.noHandphone && (
                  <button
                    type="button"
                    className="btn btn-sm position-absolute top-50 end-0 translate-middle-y text-muted"
                    style={{
                      border: "none",
                      background: "none",
                    }}
                    onClick={() =>
                      clearField(
                        "noHandphone"
                      )
                    }
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
              </div>
            </div>

            {errors.noHandphone && (
              <div className="text-danger small mt-1">
                {errors.noHandphone}
              </div>
            )}
          </div>

          {/* EMAIL */}

          <div className="mb-3">
            <label className="form-label fw-semibold small">
              Email
            </label>

            <div className="position-relative">
              <input
                type="email"
                className={`form-control ${
                  errors.email
                    ? "is-invalid"
                    : ""
                }`}
                style={{
                  borderRadius: "8px",
                  paddingRight: "40px",
                }}
                name="email"
                placeholder="Masukkan Email"
                value={formData.email}
                onChange={handleChange}
              />

              {formData.email && (
                <button
                  type="button"
                  className="btn btn-sm position-absolute top-50 end-0 translate-middle-y text-muted"
                  style={{
                    border: "none",
                    background: "none",
                  }}
                  onClick={() =>
                    clearField("email")
                  }
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>

            {errors.email && (
              <div className="text-danger small mt-1">
                {errors.email}
              </div>
            )}
          </div>

          {/* TANGGAL LAHIR */}

          <div className="mb-3">
            <label className="form-label fw-semibold small">
              Tanggal Lahir
            </label>

            <input
              type="date"
              className={`form-control ${
                errors.tanggalLahir
                  ? "is-invalid"
                  : ""
              }`}
              style={{
                borderRadius: "8px",
              }}
              name="tanggalLahir"
              value={
                formData.tanggalLahir
              }
              onChange={handleChange}
            />

            {errors.tanggalLahir && (
              <div className="text-danger small mt-1">
                {errors.tanggalLahir}
              </div>
            )}
          </div>

          {/* ROLE */}

          <div className="mb-3">
            <label className="form-label fw-semibold small">
              Roles
            </label>

            <select
              className={`form-select ${
                errors.role
                  ? "is-invalid"
                  : ""
              }`}
              style={{
                borderRadius: "8px",
              }}
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option
                value=""
                disabled
              >
                Pilih Role
              </option>

              <option value="Admin">
                Admin
              </option>

              <option value="Member">
                Member
              </option>
            </select>

            {errors.role && (
              <div className="text-danger small mt-1">
                {errors.role}
              </div>
            )}
          </div>

          <hr className="my-4" />

          {/* PASSWORD */}

          <div className="mb-3">
            <label className="form-label fw-semibold small">
              Kata Sandi
            </label>

            <div className="position-relative">
              <input
                type="password"
                className={`form-control ${
                  errors.password
                    ? "is-invalid"
                    : ""
                }`}
                style={{
                  borderRadius: "8px",
                  paddingRight: "40px",
                }}
                name="password"
                placeholder="Masukkan Kata Sandi"
                value={
                  formData.password
                }
                onChange={handleChange}
              />

              {formData.password && (
                <button
                  type="button"
                  className="btn btn-sm position-absolute top-50 end-0 translate-middle-y text-muted"
                  style={{
                    border: "none",
                    background: "none",
                  }}
                  onClick={() =>
                    clearField("password")
                  }
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>

            {errors.password && (
              <div className="text-danger small mt-1">
                {errors.password}
              </div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}

          <div className="mb-4">
            <label className="form-label fw-semibold small">
              Konfirmasi Kata Sandi
            </label>

            <div className="position-relative">
              <input
                type="password"
                className={`form-control ${
                  errors.confirmPassword
                    ? "is-invalid"
                    : ""
                }`}
                style={{
                  borderRadius: "8px",
                  paddingRight: "40px",
                }}
                name="confirmPassword"
                placeholder="Masukkan Ulang Kata Sandi"
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
              />

              {formData.confirmPassword && (
                <button
                  type="button"
                  className="btn btn-sm position-absolute top-50 end-0 translate-middle-y text-muted"
                  style={{
                    border: "none",
                    background: "none",
                  }}
                  onClick={() =>
                    clearField(
                      "confirmPassword"
                    )
                  }
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>

            {errors.confirmPassword && (
              <div className="text-danger small mt-1">
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {/* SIMPAN */}

          <button
            type="submit"
            disabled={
              loading ||
              !isFormValid()
            }
            className="btn w-100 fw-semibold text-white text-uppercase"
            style={{
              backgroundColor:
                loading
                  ? "#A0A3BD"
                  : isFormValid()
                  ? "#0B2B8E"
                  : "#A0A3BD",
              borderRadius: "999px",
              padding: "12px 0",
              letterSpacing: "0.5px",
              border: "none",
            }}
          >
            {loading
              ? "Menyimpan..."
              : "Simpan Data"}
          </button>

          {/* KEMBALI */}

          <button
            type="button"
            disabled={loading}
            onClick={() =>
              navigate(
                "/user-management"
              )
            }
            className="btn w-100 fw-semibold text-white text-uppercase mt-2"
            style={{
              backgroundColor: "#77797c",
              borderRadius: "999px",
              padding: "12px 0",
              letterSpacing: "0.5px",
              border: "none",
            }}
          >
            Kembali
          </button>
        </form>
      </div>
    </div>
  );
}