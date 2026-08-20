import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";

import {
  getUsers,
  updateUser,
  deleteUser,
} from "../api/userapi";

// =========================
// MONTH
// =========================

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DAY_LABELS = [
  "Mo",
  "Tu",
  "We",
  "Th",
  "Fr",
  "Sa",
  "Su",
];

// =========================
// CALENDAR
// =========================

function getMonthCells(year, month) {
  const firstDay = new Date(year, month, 1);

  const startWeekday =
    (firstDay.getDay() + 6) % 7;

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const daysInPrevMonth = new Date(
    year,
    month,
    0
  ).getDate();

  const cells = [];

  // Previous month
  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;

    cells.push({
      day,
      current: false,
      date: new Date(
        year,
        month - 1,
        day
      ),
    });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      current: true,
      date: new Date(
        year,
        month,
        d
      ),
    });
  }

  // Next month
  let nextDay = 1;

  while (cells.length % 7 !== 0) {
    cells.push({
      day: nextDay,
      current: false,
      date: new Date(
        year,
        month + 1,
        nextDay
      ),
    });

    nextDay++;
  }

  return cells;
}

// =========================
// FORMAT DATE
// =========================

function formatTanggal(date) {
  if (!date) return "";

  return `${date.getDate()} ${
    MONTHS_ID[date.getMonth()]
  } ${date.getFullYear()}`;
}

// =========================
// SAME DAY
// =========================

function sameDay(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// =========================
// MINI CALENDAR
// =========================

function MiniCalendar({
  monthDate,
  onPrev,
  onNext,
  rangeStart,
  rangeEnd,
  onDayClick,
}) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const cells = getMonthCells(
    year,
    month
  );

  const isInRange = (date) => {
    if (!rangeStart || !rangeEnd) {
      return false;
    }

    return (
      date > rangeStart &&
      date < rangeEnd
    );
  };

  return (
    <div style={{ width: "230px" }}>
      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-2">
        <button
          type="button"
          className="btn btn-sm p-0 text-muted"
          style={{
            border: "none",
            background: "none",
          }}
          onClick={onPrev}
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        <span className="fw-semibold small">
          {MONTHS_ID[month]}, {year}
        </span>

        <button
          type="button"
          className="btn btn-sm p-0 text-muted"
          style={{
            border: "none",
            background: "none",
          }}
          onClick={onNext}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      {/* CALENDAR */}

      <div
        className="d-grid"
        style={{
          gridTemplateColumns:
            "repeat(7, 1fr)",
          rowGap: "4px",
        }}
      >
        {/* DAY */}

        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-muted"
            style={{
              fontSize: "11px",
            }}
          >
            {d}
          </div>
        ))}

        {/* DATE */}

        {cells.map((cell, idx) => {
          const isStart = sameDay(
            cell.date,
            rangeStart
          );

          const isEnd = sameDay(
            cell.date,
            rangeEnd
          );

          const inRange = isInRange(
            cell.date
          );

          let bg = "transparent";

          let color = cell.current
            ? "#1D2939"
            : "#C0C4CC";

          if (isStart || isEnd) {
            bg = "#0B2B8E";
            color = "#fff";
          } else if (inRange) {
            bg = "#E6EEFF";
            color = "#0B2B8E";
          }

          return (
            <div
              key={idx}
              onClick={() =>
                onDayClick(cell.date)
              }
              className="text-center"
              style={{
                fontSize: "12px",
                padding: "5px 0",
                borderRadius: "6px",
                backgroundColor: bg,
                color,
                cursor: "pointer",
              }}
            >
              {cell.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =========================
// MAIN COMPONENT
// =========================

export default function UserManagement() {
  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================

  const [activeTab, setActiveTab] =
    useState("active");

  const [search, setSearch] =
    useState("");

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [showDetail, setShowDetail] =
    useState(false);

  // =========================
  // DELETE / NON ACTIVE
  // =========================

  const [userToDelete, setUserToDelete] =
    useState(null);

  const [
    showDeleteConfirm,
    setShowDeleteConfirm,
  ] = useState(false);

  const [deleteReason, setDeleteReason] =
    useState("");

  const [
    deleteReasonError,
    setDeleteReasonError,
  ] = useState("");

  // =========================
  // REACTIVATE
  // =========================

  const [
    userToReactivate,
    setUserToReactivate,
  ] = useState(null);

  const [
    showReactivateConfirm,
    setShowReactivateConfirm,
  ] = useState(false);

  // =========================
  // PERMANENT DELETE
  // =========================

  const [
    userToPermanentDelete,
    setUserToPermanentDelete,
  ] = useState(null);

  const [
    showPermanentDeleteConfirm,
    setShowPermanentDeleteConfirm,
  ] = useState(false);

  // =========================
  // CALENDAR
  // =========================

  const today = new Date();

  const [
    showDatePicker,
    setShowDatePicker,
  ] = useState(false);

  const [leftMonth, setLeftMonth] =
    useState(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

  const [rightMonth, setRightMonth] =
    useState(
      new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        1
      )
    );

  const [rangeStart, setRangeStart] =
    useState(null);

  const [rangeEnd, setRangeEnd] =
    useState(null);

  const [dateRangeText, setDateRangeText] =
    useState(
      "4 April 2023 - 16 Juli 2023"
    );

  // =====================================================
  // GET USERS
  // GET /users
  // =====================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const result = await getUsers();

      console.log(
        "Data users dari backend:",
        result
      );

      /*
       * Backend bisa mengembalikan:
       *
       * [
       *   {...},
       *   {...}
       * ]
       *
       * atau:
       *
       * {
       *   data: [...]
       * }
       *
       * Kita handle dua-duanya.
       */

      const userData = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
        ? result.data
        : [];

      setUsers(userData);
    } catch (error) {
      console.error(
        "Error fetch users:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error.response?.data?.message ||
          "Tidak dapat mengambil data user dari server.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    fetchUsers();
  }, []);

  // =====================================================
  // NON ACTIVE
  // PUT /users/{id}
  // =====================================================

  const handleDeleteClick = (user) => {
    setUserToDelete(user);

    setDeleteReason("");

    setDeleteReasonError("");

    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);

    setUserToDelete(null);

    setDeleteReason("");

    setDeleteReasonError("");
  };

  const handleConfirmDelete = async () => {
    if (!deleteReason.trim()) {
      setDeleteReasonError(
        "Alasan penghapusan wajib diisi"
      );

      return;
    }

    if (!userToDelete) {
      return;
    }

    try {
      await updateUser(
        userToDelete.id,
        {
          status: "non-active",
          alasanNonAktif:
            deleteReason,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text:
          "User berhasil dinonaktifkan",
        timer: 1500,
        showConfirmButton: false,
      });

      handleCancelDelete();

      await fetchUsers();
    } catch (error) {
      console.error(
        "Error nonaktifkan user:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error.response?.data?.message ||
          error.message ||
          "Gagal menonaktifkan user",
      });
    }
  };

  // =====================================================
  // REACTIVATE
  // PUT /users/{id}
  // =====================================================

  const handleReactivateClick = (user) => {
    setUserToReactivate(user);

    setShowReactivateConfirm(true);
  };

  const handleCancelReactivate = () => {
    setShowReactivateConfirm(false);

    setUserToReactivate(null);
  };

  const handleConfirmReactivate =
    async () => {
      if (!userToReactivate) {
        return;
      }

      try {
        await updateUser(
          userToReactivate.id,
          {
            status: "active",
            alasanNonAktif: "",
          }
        );

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text:
            "User berhasil diaktifkan kembali",
          timer: 1500,
          showConfirmButton: false,
        });

        handleCancelReactivate();

        await fetchUsers();
      } catch (error) {
        console.error(
          "Error reactivate user:",
          error
        );

        Swal.fire({
          icon: "error",
          title: "Gagal",
          text:
            error.response?.data?.message ||
            error.message ||
            "Gagal mengaktifkan user",
        });
      }
    };

  // =====================================================
  // PERMANENT DELETE
  // DELETE /users/{id}
  // =====================================================

  const handlePermanentDeleteClick =
    (user) => {
      setUserToPermanentDelete(user);

      setShowPermanentDeleteConfirm(
        true
      );
    };

  const handleCancelPermanentDelete =
    () => {
      setShowPermanentDeleteConfirm(
        false
      );

      setUserToPermanentDelete(null);
    };

  const handleConfirmPermanentDelete =
    async () => {
      if (!userToPermanentDelete) {
        return;
      }

      try {
        await deleteUser(
          userToPermanentDelete.id
        );

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text:
            "User berhasil dihapus permanen",
          timer: 1500,
          showConfirmButton: false,
        });

        handleCancelPermanentDelete();

        await fetchUsers();
      } catch (error) {
        console.error(
          "Error delete user:",
          error
        );

        Swal.fire({
          icon: "error",
          title: "Gagal",
          text:
            error.response?.data?.message ||
            error.message ||
            "Gagal menghapus user",
        });
      }
    };

  // =====================================================
  // DETAIL
  // =====================================================

  const handleViewDetail = (user) => {
    setSelectedUser(user);

    setShowDetail(true);
  };

  // =====================================================
  // CALENDAR
  // =====================================================

  const handleDayClick = (date) => {
    if (
      !rangeStart ||
      (rangeStart && rangeEnd)
    ) {
      setRangeStart(date);

      setRangeEnd(null);
    } else if (date < rangeStart) {
      setRangeEnd(rangeStart);

      setRangeStart(date);
    } else {
      setRangeEnd(date);
    }
  };

  const handleTerapkan = () => {
    if (rangeStart && rangeEnd) {
      setDateRangeText(
        `${formatTanggal(
          rangeStart
        )} - ${formatTanggal(rangeEnd)}`
      );
    } else if (rangeStart) {
      setDateRangeText(
        formatTanggal(rangeStart)
      );
    }

    setShowDatePicker(false);
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredUsers = users.filter(
    (user) => {
      const matchesSearch =
        user.nama
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesTab =
        activeTab === "active"
          ? user.status !==
            "non-active"
          : user.status ===
            "non-active";

      return (
        matchesSearch &&
        matchesTab
      );
    }
  );

  // =====================================================
  // TITLE COLOR
  // =====================================================

  const titleColor = {
    Tn: {
      bg: "#E6F0FF",
      color: "#0B2B8E",
    },

    Ny: {
      bg: "#FDEBF3",
      color: "#B32E7A",
    },

    Nn: {
      bg: "#EAFBF0",
      color: "#0F9D58",
    },
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="p-3 min-vh-100">
      <div className="border-0 shadow-sm rounded-4 p-3 bg-light">

        {/* =====================================================
            SUMMARY CARD
        ===================================================== */}

        <div className="row mb-4 g-3">

          {/* TOTAL MEMBER */}

          <div className="col-md-4">
            <div
              className="card border-0 p-4"
              style={{
                background:
                  "linear-gradient(135deg, #EAF2FF 0%, #DCEBFF 100%)",
                borderRadius: "16px",
                boxShadow:
                  "0 4px 16px rgba(11,43,142,0.06)",
              }}
            >
              <div className="d-flex align-items-center mb-2">
                <span
                  className="text-uppercase fw-semibold small me-1"
                  style={{
                    color: "#4C6FCF",
                    letterSpacing:
                      "0.5px",
                  }}
                >
                  Total Member
                </span>

                <i
                  className="bi bi-info-circle small"
                  style={{
                    color: "#4C6FCF",
                  }}
                ></i>
              </div>

              <h2
                className="fw-bold mb-0"
                style={{
                  color: "#0B2B8E",
                }}
              >
                {users.length.toLocaleString(
                  "id-ID"
                )}
              </h2>
            </div>
          </div>

          {/* MEMBER BARU */}

          <div className="col-md-5">
            <div
              className="card border-0 p-4"
              style={{
                background:
                  "linear-gradient(135deg, #FFF9E6 0%, #FFF3CC 100%)",
                borderRadius: "16px",
                boxShadow:
                  "0 4px 16px rgba(154,120,0,0.06)",
              }}
            >
              <div className="d-flex align-items-center mb-2">
                <span
                  className="text-uppercase fw-semibold small me-1"
                  style={{
                    color: "#9A7800",
                    letterSpacing:
                      "0.5px",
                  }}
                >
                  Member Baru
                </span>

                <i
                  className="bi bi-info-circle small"
                  style={{
                    color: "#9A7800",
                  }}
                ></i>
              </div>

              <h2
                className="fw-bold mb-1"
                style={{
                  color: "#1D2939",
                }}
              >
                {users.length.toLocaleString(
                  "id-ID"
                )}
              </h2>

              <span className="text-muted small">
                90 hari terakhir
                (4 April - 4 Juli
                2023)
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            TABLE CONTAINER
        ===================================================== */}

        <div
          className="bg-white p-4"
          style={{
            borderRadius: "16px",
            boxShadow:
              "0 2px 12px rgba(16,24,40,0.05)",
          }}
        >

          {/* =====================================================
              TAB
          ===================================================== */}

          <div className="border-bottom mb-3">

            <button
              className={`btn btn-link text-decoration-none fw-semibold pb-2 me-4 ${
                activeTab === "active"
                  ? "text-primary border-bottom border-2 border-primary"
                  : "text-muted"
              }`}
              onClick={() =>
                setActiveTab("active")
              }
              style={{
                borderRadius: 0,
              }}
            >
              Active
            </button>

            <button
              className={`btn btn-link text-decoration-none fw-semibold pb-2 ${
                activeTab ===
                "non-active"
                  ? "text-primary border-bottom border-2 border-primary"
                  : "text-muted"
              }`}
              onClick={() =>
                setActiveTab(
                  "non-active"
                )
              }
              style={{
                borderRadius: 0,
              }}
            >
              Non Active
            </button>

          </div>

          {/* =====================================================
              SEARCH / FILTER
          ===================================================== */}

          <div className="row g-2 align-items-center mb-3 position-relative">

            {/* SEARCH */}

            <div className="col-md-4">
              <div className="input-group">

                <span
                  className="input-group-text bg-white border-end-0 text-muted"
                  style={{
                    borderRadius:
                      "8px 0 0 8px",
                  }}
                >
                  <i className="bi bi-search"></i>
                </span>

                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Cari nama member"
                  style={{
                    borderRadius:
                      "0 8px 8px 0",
                  }}
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>
            </div>

            {/* DATE */}

            <div className="col-md-5">
              <div
                className="input-group"
                style={{
                  cursor: "pointer",
                }}
                onClick={() =>
                  setShowDatePicker(
                    (prev) => !prev
                  )
                }
              >

                <span
                  className="input-group-text bg-white border-end-0 text-muted"
                  style={{
                    borderRadius:
                      "8px 0 0 8px",
                  }}
                >
                  <i className="bi bi-calendar"></i>
                </span>

                <input
                  type="text"
                  className="form-control border-start-0 text-muted"
                  style={{
                    borderRadius:
                      "0 8px 8px 0",
                    cursor: "pointer",
                  }}
                  value={dateRangeText}
                  readOnly
                />

              </div>

              {/* DATE PICKER */}

              {showDatePicker && (
                <div
                  className="bg-white shadow-sm border rounded-4 p-3 position-absolute"
                  style={{
                    top: "48px",
                    left: 0,
                    zIndex: 20,
                  }}
                >

                  <div className="d-flex justify-content-end mb-2">

                    <button
                      type="button"
                      className="btn btn-sm p-0 text-muted"
                      style={{
                        border: "none",
                        background:
                          "none",
                      }}
                      onClick={() =>
                        setShowDatePicker(
                          false
                        )
                      }
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>

                  </div>

                  <div className="d-flex gap-4">

                    <MiniCalendar
                      monthDate={
                        leftMonth
                      }
                      onPrev={() =>
                        setLeftMonth(
                          new Date(
                            leftMonth.getFullYear(),
                            leftMonth.getMonth() - 1,
                            1
                          )
                        )
                      }
                      onNext={() =>
                        setLeftMonth(
                          new Date(
                            leftMonth.getFullYear(),
                            leftMonth.getMonth() + 1,
                            1
                          )
                        )
                      }
                      rangeStart={
                        rangeStart
                      }
                      rangeEnd={
                        rangeEnd
                      }
                      onDayClick={
                        handleDayClick
                      }
                    />

                    <MiniCalendar
                      monthDate={
                        rightMonth
                      }
                      onPrev={() =>
                        setRightMonth(
                          new Date(
                            rightMonth.getFullYear(),
                            rightMonth.getMonth() - 1,
                            1
                          )
                        )
                      }
                      onNext={() =>
                        setRightMonth(
                          new Date(
                            rightMonth.getFullYear(),
                            rightMonth.getMonth() + 1,
                            1
                          )
                        )
                      }
                      rangeStart={
                        rangeStart
                      }
                      rangeEnd={
                        rangeEnd
                      }
                      onDayClick={
                        handleDayClick
                      }
                    />

                  </div>

                  <div className="row g-2 mt-3">

                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">
                        Dari
                      </label>

                      <input
                        type="text"
                        className="form-control form-control-sm"
                        readOnly
                        value={formatTanggal(
                          rangeStart
                        )}
                      />
                    </div>

                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">
                        Sampai
                      </label>

                      <input
                        type="text"
                        className="form-control form-control-sm"
                        readOnly
                        value={formatTanggal(
                          rangeEnd
                        )}
                      />
                    </div>

                  </div>

                  <button
                    type="button"
                    className="btn w-100 fw-semibold text-white mt-3"
                    style={{
                      backgroundColor:
                        "#0B2B8E",
                      borderRadius: "8px",
                      padding: "8px 0",
                      border: "none",
                    }}
                    onClick={
                      handleTerapkan
                    }
                  >
                    TERAPKAN
                  </button>

                </div>
              )}
            </div>

            {/* BUTTON CREATE */}

            <div className="col-md-3 text-end">
              <button
                className="btn btn-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
                style={{
                  backgroundColor:
                    "#0B2B8E",
                  borderColor:
                    "#0B2B8E",
                  borderRadius: "8px",
                  padding: "10px 0",
                }}
                onClick={() =>
                  navigate(
                    "/tambah-data-management"
                  )
                }
              >
                <i className="bi bi-plus-lg"></i>
                Buat User Baru
              </button>
            </div>

          </div>

          {/* =====================================================
              TABLE
          ===================================================== */}

          <div className="table-responsive">

            <table
              className="table align-middle text-nowrap mb-0"
              style={{
                color: "#475467",
              }}
            >

              <thead>

                <tr
                  className="text-uppercase small text-muted"
                  style={{
                    backgroundColor:
                      "#F9FAFB",
                  }}
                >

                  <th
                    className="py-3 ps-3"
                    style={{
                      borderRadius:
                        "8px 0 0 8px",
                    }}
                  >
                    NO.
                  </th>

                  <th className="py-3">
                    TITLE
                  </th>

                  <th className="py-3">
                    NAMA
                  </th>

                  <th className="py-3">
                    NO. HANDPHONE
                  </th>

                  <th className="py-3">
                    EMAIL
                  </th>

                  <th className="py-3">
                    TANGGAL LAHIR
                  </th>

                  <th className="py-3">
                    ROLES
                  </th>

                  <th
                    className="py-3 text-center"
                    style={{
                      borderRadius:
                        "0 8px 8px 0",
                    }}
                  >
                    AKSI
                  </th>

                </tr>

              </thead>

              <tbody>

                {/* LOADING */}

                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-5 text-muted"
                    >
                      <div
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></div>

                      Mengambil data
                      user...
                    </td>
                  </tr>
                ) : filteredUsers.length ===
                  0 ? (

                  /* EMPTY */

                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-5 text-muted"
                    >

                      {activeTab ===
                      "active" ? (
                        <>
                          Belum ada data
                          user. Klik
                          tombol{" "}
                          <strong>
                            + Buat User
                            Baru
                          </strong>{" "}
                          untuk
                          menambahkan
                          data.
                        </>
                      ) : (
                        <>
                          Belum ada data
                          user non
                          aktif.
                        </>
                      )}

                    </td>
                  </tr>

                ) : (

                  /* DATA */

                  filteredUsers.map(
                    (user, index) => {

                      const tc =
                        titleColor[
                          user.title
                        ] || {
                          bg: "#F2F4F7",
                          color:
                            "#475467",
                        };

                      return (
                        <tr
                          key={user.id}
                          style={{
                            borderBottom:
                              "1px solid #F0F2F5",
                          }}
                        >

                          {/* NO */}

                          <td className="ps-3">
                            {index + 1}
                          </td>

                          {/* TITLE */}

                          <td>
                            <span
                              className="fw-semibold px-2 py-1"
                              style={{
                                backgroundColor:
                                  tc.bg,
                                color:
                                  tc.color,
                                borderRadius:
                                  "6px",
                                fontSize:
                                  "0.8rem",
                              }}
                            >
                              {user.title ||
                                "-"}
                            </span>
                          </td>

                          {/* NAMA */}

                          <td className="fw-medium text-dark">
                            {user.nama ||
                              "-"}
                          </td>

                          {/* PHONE */}

                          <td>
                            {user.noHandphone ||
                              "-"}
                          </td>

                          {/* EMAIL */}

                          <td>
                            {user.email ||
                              "-"}
                          </td>

                          {/* DOB */}

                          <td>
                            {user.tanggalLahir ||
                              "-"}
                          </td>

                          {/* ROLE */}

                          <td>
                            <span
                              className="fw-semibold px-2 py-1"
                              style={{
                                backgroundColor:
                                  user.role ===
                                  "Admin"
                                    ? "#FFF1E6"
                                    : "#EEF2FF",
                                color:
                                  user.role ===
                                  "Admin"
                                    ? "#B54708"
                                    : "#3538CD",
                                borderRadius:
                                  "6px",
                                fontSize:
                                  "0.8rem",
                              }}
                            >
                              {user.role ||
                                "-"}
                            </span>
                          </td>

                          {/* ACTION */}

                          <td className="text-center">

                            {/* DETAIL */}

                            <button
                              className="btn btn-link text-secondary p-1 me-1"
                              title="Lihat Detail"
                              onClick={() =>
                                handleViewDetail(
                                  user
                                )
                              }
                            >
                              <i className="bi bi-eye"></i>
                            </button>

                            {/* EDIT */}

                            <button
                              className="btn btn-link text-secondary p-1 me-1"
                              title="Edit"
                              onClick={() =>
                                navigate(
                                  "/edit-data-management",
                                  {
                                    state: {
                                      user,
                                    },
                                  }
                                )
                              }
                            >
                              <i className="bi bi-pencil"></i>
                            </button>

                            {/* NON ACTIVE */}

                            {user.status ===
                            "non-active" ? (
                              <>
                                {/* REACTIVATE */}

                                <button
                                  className="btn btn-link p-1 me-1"
                                  style={{
                                    color:
                                      "#0F9D58",
                                  }}
                                  title="Aktifkan Kembali"
                                  onClick={() =>
                                    handleReactivateClick(
                                      user
                                    )
                                  }
                                >
                                  <i className="bi bi-arrow-counterclockwise"></i>
                                </button>

                                {/* PERMANENT DELETE */}

                                <button
                                  className="btn btn-link text-danger p-1"
                                  title="Hapus Permanen"
                                  onClick={() =>
                                    handlePermanentDeleteClick(
                                      user
                                    )
                                  }
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </>
                            ) : (

                              /* SOFT DELETE */

                              <button
                                className="btn btn-link text-danger p-1"
                                title="Nonaktifkan"
                                onClick={() =>
                                  handleDeleteClick(
                                    user
                                  )
                                }
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}

                          </td>

                        </tr>
                      );
                    }
                  )
                )}

              </tbody>

            </table>

          </div>
        </div>
      </div>

      {/* =====================================================
          DETAIL MODAL
      ===================================================== */}

      <Modal
        show={showDetail}
        onHide={() =>
          setShowDetail(false)
        }
        centered
      >
        <Modal.Body className="p-4">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <h5 className="fw-bold mb-0">
              Detail Data User
            </h5>

            <button
              className="btn btn-sm p-1 text-muted"
              style={{
                border: "none",
                background: "none",
                fontSize: "24px",
                lineHeight: 1,
              }}
              onClick={() =>
                setShowDetail(false)
              }
            >
              &times;
            </button>

          </div>

          {selectedUser && (
            <div
              className="d-flex flex-column"
              style={{
                gap: "14px",
              }}
            >

              <DetailRow
                label="Title"
                value={
                  selectedUser.title
                }
              />

              <DetailRow
                label="Nama"
                value={
                  selectedUser.nama
                }
              />

              <DetailRow
                label="No. Handphone"
                value={
                  selectedUser.noHandphone
                }
              />

              <DetailRow
                label="Email"
                value={
                  selectedUser.email
                }
              />

              <DetailRow
                label="Tanggal Lahir"
                value={
                  selectedUser.tanggalLahir
                }
              />

              <DetailRow
                label="Roles"
                value={
                  selectedUser.role
                }
              />

              {selectedUser.status ===
                "non-active" && (
                <DetailRow
                  label="Alasan Non Aktif"
                  value={
                    selectedUser.alasanNonAktif
                  }
                />
              )}

            </div>
          )}

        </Modal.Body>
      </Modal>

      {/* =====================================================
          DELETE / NON ACTIVE MODAL
      ===================================================== */}

      <Modal
        show={showDeleteConfirm}
        onHide={handleCancelDelete}
        centered
      >
        <Modal.Body className="p-4">

          <div className="d-flex justify-content-between align-items-center mb-2">

            <h5 className="fw-bold mb-0">
              Konfirmasi
            </h5>

            <button
              className="btn btn-sm p-1 text-muted"
              style={{
                border: "none",
                background: "none",
                fontSize: "22px",
                lineHeight: 1,
              }}
              onClick={
                handleCancelDelete
              }
            >
              &times;
            </button>

          </div>

          <p className="text-muted small mb-3">
            Apakah kamu yakin ingin
            menghapus data ini?
            Berikan alasan
          </p>

          <textarea
            className={`form-control mb-1 ${
              deleteReasonError
                ? "is-invalid"
                : ""
            }`}
            style={{
              borderRadius: "8px",
            }}
            rows={3}
            placeholder="Tulis alasan kenapa kamu ingin menghapus data ini"
            value={deleteReason}
            onChange={(e) => {
              setDeleteReason(
                e.target.value
              );

              if (
                e.target.value.trim() !==
                ""
              ) {
                setDeleteReasonError(
                  ""
                );
              }
            }}
          />

          {deleteReasonError && (
            <div className="text-danger small mb-3">
              {deleteReasonError}
            </div>
          )}

          <div className="d-flex gap-2 mt-4">

            <button
              type="button"
              className="btn flex-fill fw-semibold text-white"
              style={{
                backgroundColor:
                  "#0B2B8E",
                borderRadius: "8px",
                padding: "10px 0",
                border: "none",
              }}
              onClick={
                handleConfirmDelete
              }
            >
              YA, HAPUS DATA
            </button>

            <button
              type="button"
              className="btn flex-fill fw-semibold"
              style={{
                backgroundColor: "#fff",
                color: "#0B2B8E",
                border:
                  "1px solid #0B2B8E",
                borderRadius: "8px",
                padding: "10px 0",
              }}
              onClick={
                handleCancelDelete
              }
            >
              TIDAK, BATAL
            </button>

          </div>

        </Modal.Body>
      </Modal>

      {/* =====================================================
          REACTIVATE MODAL
      ===================================================== */}

      <Modal
        show={showReactivateConfirm}
        onHide={
          handleCancelReactivate
        }
        centered
      >
        <Modal.Body className="p-4">

          <div className="d-flex justify-content-between align-items-center mb-2">

            <h5 className="fw-bold mb-0">
              Konfirmasi
            </h5>

            <button
              className="btn btn-sm p-1 text-muted"
              style={{
                border: "none",
                background: "none",
                fontSize: "22px",
                lineHeight: 1,
              }}
              onClick={
                handleCancelReactivate
              }
            >
              &times;
            </button>

          </div>

          <p className="text-muted small mb-4">
            Apakah kamu yakin ingin
            mengaktifkan kembali
            data ini?
          </p>

          <div className="d-flex gap-2">

            <button
              type="button"
              className="btn flex-fill fw-semibold text-white"
              style={{
                backgroundColor:
                  "#0B2B8E",
                borderRadius: "8px",
                padding: "10px 0",
                border: "none",
              }}
              onClick={
                handleConfirmReactivate
              }
            >
              YA, AKTIFKAN DATA
            </button>

            <button
              type="button"
              className="btn flex-fill fw-semibold"
              style={{
                backgroundColor: "#fff",
                color: "#0B2B8E",
                border:
                  "1px solid #0B2B8E",
                borderRadius: "8px",
                padding: "10px 0",
              }}
              onClick={
                handleCancelReactivate
              }
            >
              TIDAK, KEMBALI
            </button>

          </div>

        </Modal.Body>
      </Modal>

      {/* =====================================================
          PERMANENT DELETE MODAL
      ===================================================== */}

      <Modal
        show={
          showPermanentDeleteConfirm
        }
        onHide={
          handleCancelPermanentDelete
        }
        centered
      >
        <Modal.Body className="p-4">

          <div className="d-flex justify-content-between align-items-center mb-2">

            <h5 className="fw-bold mb-0">
              Konfirmasi
            </h5>

            <button
              className="btn btn-sm p-1 text-muted"
              style={{
                border: "none",
                background: "none",
                fontSize: "22px",
                lineHeight: 1,
              }}
              onClick={
                handleCancelPermanentDelete
              }
            >
              &times;
            </button>

          </div>

          <p className="text-muted small mb-4">
            Apakah kamu yakin ingin
            menghapus data ini secara
            permanen? Data yang sudah
            dihapus permanen tidak
            dapat dikembalikan.
          </p>

          <div className="d-flex gap-2">

            <button
              type="button"
              className="btn flex-fill fw-semibold text-white"
              style={{
                backgroundColor:
                  "#D92D20",
                borderRadius: "8px",
                padding: "10px 0",
                border: "none",
              }}
              onClick={
                handleConfirmPermanentDelete
              }
            >
              YA, HAPUS PERMANEN
            </button>

            <button
              type="button"
              className="btn flex-fill fw-semibold"
              style={{
                backgroundColor: "#fff",
                color: "#0B2B8E",
                border:
                  "1px solid #0B2B8E",
                borderRadius: "8px",
                padding: "10px 0",
              }}
              onClick={
                handleCancelPermanentDelete
              }
            >
              TIDAK, BATAL
            </button>

          </div>

        </Modal.Body>
      </Modal>

    </div>
  );
}

// =====================================================
// DETAIL ROW
// =====================================================

function DetailRow({
  label,
  value,
}) {
  return (
    <div className="d-flex justify-content-between align-items-center border-bottom pb-2">

      <span className="text-muted small">
        {label}
      </span>

      <span className="fw-semibold text-dark small">
        {value || "-"}
      </span>

    </div>
  );
}