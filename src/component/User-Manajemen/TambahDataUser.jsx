import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_URL = "http://127.0.0.1:8000";

const TITLE_OPTIONS = [
  { value: "Tn", label: "Tuan" },
  { value: "Ny", label: "Nyonya" },
  { value: "Nn", label: "Nona" },
];

const EMAIL_REGEX =
  /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@gmail\.com$/;

const PASSWORD_REGEX = /^.{8,}$/;

export default function TambahDataUser() {
  const navigate = useNavigate();

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

  const [errors, setErrors] = useState({
    noHandphone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

  const validateConfirmPassword = (value, password) => {
    if (value === "") return "";

    if (value !== password) {
      return "Kata sandi tidak cocok";
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearField = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (errors[name] !== undefined) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const formatTanggalLahir = (isoDate) => {
    if (!isoDate) return "";

    const [year, month, day] = isoDate.split("-");

    return `${day}-${month}-${year}`;
  };

  const isFormValid = () => {
    return (
      formData.nama.trim() !== "" &&
      formData.noHandphone.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.tanggalLahir.trim() !== "" &&
      formData.role.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.confirmPassword.trim() !== "" &&
      !errors.noHandphone &&
      !errors.email &&
      !errors.password &&
      !errors.confirmPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (
      phoneError ||
      emailError ||
      passwordError ||
      confirmPasswordError ||
      !formData.nama.trim() ||
      !formData.tanggalLahir ||
      !formData.role
    ) {
      setErrors({
        noHandphone: phoneError,
        email: emailError,
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

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal menambahkan user"
        );
      }

      await Swal.fire({
        icon: "success",
        title: "Data berhasil ditambah",
        text: "User berhasil disimpan ke database.",
        confirmButtonColor: "#0B2B8E",
      });

      navigate("/user-management");
    } catch (error) {
      console.error("Error tambah user:", error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error.message ||
          "Tidak dapat terhubung ke server.",
        confirmButtonColor: "#0B2B8E",
      });
    }
  };

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

        <form onSubmit={handleSubmit} noValidate>

         
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

          <div className="mb-3">
            <label className="form-label fw-semibold small">
              Nama Lengkap
            </label>

            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                style={{
                  borderRadius: "8px",
                  paddingRight: "32px",
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
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small">
              No. Handphone
            </label>

            <div
              className="d-flex"
              style={{ gap: "8px" }}
            >
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
                    background:
                      "linear-gradient(to bottom, #CE1126 50%, #FFFFFF 50%)",
                    border:
                      "1px solid #E4E7EC",
                    borderRadius: "2px",
                  }}
                ></span>

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
                    paddingRight: "32px",
                  }}
                  name="noHandphone"
                  placeholder="Masukan Nomer"
                  value={formData.noHandphone}
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
                      clearField("noHandphone")
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
                  paddingRight: "32px",
                }}
                name="email"
                placeholder="Masukan Email"
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

          <div className="mb-3">
            <label className="form-label fw-semibold small">
              Tanggal Lahir
            </label>

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
            <label className="form-label fw-semibold small">
              Roles
            </label>

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

              <option value="Admin">
                Admin
              </option>

              <option value="Member">
                Member
              </option>
            </select>
          </div>

          <hr className="my-4" />

         
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
                  paddingRight: "32px",
                }}
                name="password"
                placeholder="Masukkan Kata Sandi"
                value={formData.password}
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
                  paddingRight: "32px",
                }}
                name="confirmPassword"
                placeholder="Masukkan Ulang Kata Sandi"
                value={formData.confirmPassword}
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

         
          <button
            type="submit"
            className="btn w-100 fw-semibold text-white text-uppercase"
            style={{
              backgroundColor: isFormValid()
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
            Simpan Data
          </button>

         
          <button
            type="button"
            onClick={() =>
              navigate("/user-management")
            }
            className="btn w-100 fw-semibold text-white text-uppercase mt-2"
            style={{
              backgroundColor: "#77797c",
              borderRadius: "999px",
              padding: "12px 0",
              letterSpacing: "0.5px",
              border: "none",
              transition:
                "background-color 0.2s ease",
            }}
          >
            Kembali
          </button>

        </form>
      </div>
    </div>
  );
}
