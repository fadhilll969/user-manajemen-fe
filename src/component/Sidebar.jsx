import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";

import {
    RiHome5Line,
    RiApps2Line,
    RiArrowRightSLine,
    RiBookOpenLine,
    RiCalendarCheckLine,
    RiFileList3Line,
    RiMedalLine,
    RiSettings3Fill,
    RiLogoutBoxRLine,
    RiUser3Line,
} from "react-icons/ri";

const Sidebar = ({ open, setOpen }) => {
    const sidebarRef = useRef(null);
    const navigate = useNavigate();

    const [showLogout, setShowLogout] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // =========================
    // DATA PROFIL
    // =========================

    const [namaProfil, setNamaProfil] = useState(
        localStorage.getItem("nama") || "Aizen"
    );

    const [fotoProfil, setFotoProfil] = useState(
        localStorage.getItem("foto") || null
    );

    // =========================
    // UPDATE DATA PROFIL
    // =========================

    useEffect(() => {
        const updateProfilSidebar = () => {
            setNamaProfil(
                localStorage.getItem("nama") || "Aizen"
            );

            setFotoProfil(
                localStorage.getItem("foto") || null
            );
        };

        // Jalankan pertama kali
        updateProfilSidebar();

        // Dengarkan perubahan profil
        window.addEventListener(
            "profilUpdated",
            updateProfilSidebar
        );

        return () => {
            window.removeEventListener(
                "profilUpdated",
                updateProfilSidebar
            );
        };
    }, []);

    // =========================
    // CLICK DI LUAR SIDEBAR
    // =========================

    useEffect(() => {
        const handleClick = (e) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(e.target)
            ) {
                setOpen(false);
                setShowLogout(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClick
            );
        };
    }, [setOpen]);

    // =========================
    // STYLE MENU
    // =========================

    const menuStyle = (isActive) => ({
        backgroundColor: isActive
            ? "#EAF2FF"
            : "transparent",

        color: isActive
            ? "#2563EB"
            : "#444",

        fontWeight: isActive
            ? "600"
            : "400",

        transition: "all 0.3s ease",
    });

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {
        setShowLogout(false);
        setShowLogoutConfirm(true);
    };

    const handleCancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const handleConfirmLogout = async () => {
        setIsLoggingOut(true);

        await new Promise((resolve) =>
            setTimeout(resolve, 400)
        );

        setIsLoggingOut(false);
        setShowLogoutConfirm(false);

        // =========================
        // HAPUS DATA LOGIN
        // =========================

        localStorage.removeItem("userId");
        localStorage.removeItem("nama");
        localStorage.removeItem("foto");

        Swal.fire({
            icon: "success",
            title: "Berhasil Keluar",
            confirmButtonColor: "#0B2B8E",
            timer: 1500,
            showConfirmButton: false,
        }).then(() => {
            navigate("/");
        });
    };

    // =========================
    // BUKA PROFIL
    // =========================

    const handleOpenProfil = () => {
        setShowLogout(false);
        setOpen(false);

        navigate("/profil");
    };

    return (
        <div ref={sidebarRef}>

            {/* ========================= */}
            {/* SIDEBAR */}
            {/* ========================= */}

            <div
                className="position-fixed top-0 start-0 d-flex flex-column align-items-center py-3"
                style={{
                    width: "200px",
                    height: "100vh",
                    zIndex: 1000,
                    backgroundColor: "#2736B8",
                }}
            >

                {/* ========================= */}
                {/* TITLE */}
                {/* ========================= */}

                <h1
                    className="text-white mt-2"
                    style={{
                        fontSize: "25px",
                    }}
                >
                    Dashboard
                </h1>

                {/* ========================= */}
                {/* BERANDA */}
                {/* ========================= */}

                <NavLink
                    to="/dashboard"
                    className="text-decoration-none d-flex flex-row align-items-center justify-content-start w-100 px-3 mt-4"
                    style={({ isActive }) => ({
                        color: isActive
                            ? "#ffffff"
                            : "#ffffff",

                        fontWeight: isActive
                            ? "700"
                            : "400",
                    })}
                >
                    <RiHome5Line size={22} />

                    <span
                        style={{
                            fontSize: "15px",
                            marginTop: "4px",
                            marginLeft: "8px",
                        }}
                    >
                        Beranda
                    </span>
                </NavLink>

                {/* ========================= */}
                {/* USER MANAGEMENT */}
                {/* ========================= */}

                <NavLink
                    to="/user-management"
                    className="text-decoration-none d-flex flex-row align-items-center justify-content-start w-100 px-3 mt-3"
                    style={({ isActive }) => ({
                        color: isActive
                            ? "#ffffff"
                            : "#ffffff",

                        fontWeight: isActive
                            ? "700"
                            : "400",
                    })}
                >
                    <RiSettings3Fill size={20} />

                    <span
                        style={{
                            marginLeft: "8px",
                        }}
                    >
                        User Management
                    </span>
                </NavLink>

                {/* ========================= */}
                {/* KELAS LMS */}
                {/* ========================= */}

                <button
                    onClick={() => setOpen(!open)}
                    className="border-0 bg-transparent d-flex align-items-center justify-content-between w-100 px-3 py-2 mt-3"
                    style={{
                        color: "#FFFFFF",
                    }}
                >
                    <div className="d-flex align-items-center gap-2">

                        <RiBookOpenLine size={20} />

                        <span
                            style={{
                                fontSize: "15px",
                            }}
                        >
                            Kelas LMS
                        </span>

                    </div>

                    <RiArrowRightSLine
                        size={18}
                        style={{
                            transform: open
                                ? "rotate(90deg)"
                                : "rotate(0deg)",

                            transition:
                                "transform 0.3s ease",
                        }}
                    />
                </button>

                {/* ========================= */}
                {/* SUB MENU */}
                {/* ========================= */}

                {open && (
                    <div className="w-100 mt-1 px-2">

                        {/* PRESENSI */}

                        <NavLink
                            to="/"
                            onClick={() => setOpen(false)}
                            className="text-decoration-none d-block"
                        >
                            {({ isActive }) => (
                                <div
                                    className="d-flex align-items-center gap-2 rounded-3 px-3 py-2 mb-1"
                                    style={{
                                        backgroundColor:
                                            isActive
                                                ? "#FFFFFF"
                                                : "transparent",

                                        color: isActive
                                            ? "#2563EB"
                                            : "#FFFFFF",

                                        fontWeight: isActive
                                            ? "600"
                                            : "400",
                                    }}
                                >
                                    <RiCalendarCheckLine
                                        size={20}
                                    />

                                    <span>
                                        Presensi Peserta
                                    </span>
                                </div>
                            )}
                        </NavLink>

                        {/* INPUT NILAI */}

                        <NavLink
                            to="/"
                            onClick={() => setOpen(false)}
                            className="text-decoration-none d-block"
                        >
                            {({ isActive }) => (
                                <div
                                    className="d-flex align-items-center gap-2 rounded-3 px-3 py-2 mb-1"
                                    style={{
                                        backgroundColor:
                                            isActive
                                                ? "#FFFFFF"
                                                : "transparent",

                                        color: isActive
                                            ? "#2563EB"
                                            : "#FFFFFF",

                                        fontWeight: isActive
                                            ? "600"
                                            : "400",
                                    }}
                                >
                                    <RiFileList3Line
                                        size={20}
                                    />

                                    <span>
                                        Input Nilai
                                    </span>
                                </div>
                            )}
                        </NavLink>

                        {/* SERTIFIKAT */}

                        <NavLink
                            to="/sertifikat"
                            onClick={() => setOpen(false)}
                            className="text-decoration-none d-block"
                        >
                            {({ isActive }) => (
                                <div
                                    className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
                                    style={{
                                        backgroundColor:
                                            isActive
                                                ? "#FFFFFF"
                                                : "transparent",

                                        color: isActive
                                            ? "#2563EB"
                                            : "#FFFFFF",

                                        fontWeight: isActive
                                            ? "600"
                                            : "400",
                                    }}
                                >
                                    <RiMedalLine
                                        size={20}
                                    />

                                    <span>
                                        Sertifikat
                                    </span>
                                </div>
                            )}
                        </NavLink>

                    </div>
                )}

                {/* ========================= */}
                {/* BOTTOM PROFILE */}
                {/* ========================= */}

                <div className="mt-auto w-100 position-relative px-2">

                    <hr className="border-light opacity-50 mx-2" />

                    {/* ========================= */}
                    {/* LOGOUT MENU */}
                    {/* ========================= */}

                    {showLogout && (
                        <div
                            className="position-absolute bg-white rounded-3 shadow-sm p-2"
                            style={{
                                bottom: "68px",
                                left: "12px",
                                right: "12px",
                                zIndex: 1100,
                            }}
                        >

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="btn w-100 d-flex align-items-center gap-2 text-danger fw-semibold border-0 bg-transparent"
                                style={{
                                    fontSize: "14px",
                                }}
                            >
                                <RiLogoutBoxRLine
                                    size={18}
                                />

                                Keluar
                            </button>

                        </div>
                    )}

                    {/* ========================= */}
                    {/* PROFILE */}
                    {/* ========================= */}

                    <div
                        className="d-flex align-items-center px-2 py-2 w-100"
                        style={{
                            gap: "10px",
                        }}
                    >

                        {/* FOTO + NAMA */}

                        <button
                            type="button"
                            onClick={handleOpenProfil}
                            className="text-decoration-none text-white d-flex align-items-center flex-grow-1 border-0 bg-transparent p-0 text-start"
                            style={{
                                gap: "10px",
                            }}
                        >

                            {/* FOTO */}

                            {fotoProfil ? (
                                <img
                                    src={fotoProfil}
                                    alt="Profile"
                                    className="rounded-circle"
                                    style={{
                                        width: "45px",
                                        height: "45px",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "45px",
                                        height: "45px",
                                        backgroundColor: "#ffffff",
                                        flexShrink: 0,
                                    }}
                                >
                                    <RiUser3Line
                                        size={25}
                                        color="#2736B8"
                                    />
                                </div>
                            )}

                            {/* NAMA */}

                            <span
                                className="text-truncate"
                                style={{
                                    maxWidth: "90px",
                                    fontSize: "14px",
                                }}
                            >
                                {namaProfil}
                            </span>

                        </button>

                        {/* ========================= */}
                        {/* TOMBOL LOGOUT */}
                        {/* ========================= */}

                        <button
                            type="button"
                            onClick={() =>
                                setShowLogout(
                                    (prev) => !prev
                                )
                            }
                            className="border-0 bg-transparent text-white p-1"
                            title="Menu"
                        >
                            <RiArrowRightSLine
                                size={18}
                                style={{
                                    transform:
                                        showLogout
                                            ? "rotate(-90deg)"
                                            : "rotate(0deg)",

                                    transition:
                                        "transform 0.3s ease",
                                }}
                            />
                        </button>

                    </div>

                </div>

            </div>

            {/* ========================= */}
            {/* MODAL LOGOUT */}
            {/* ========================= */}

            <Modal
                show={showLogoutConfirm}
                onHide={handleCancelLogout}
                centered
            >

                <Modal.Body className="p-4">

                    <div className="d-flex justify-content-between align-items-center mb-2">

                        <h5 className="fw-bold mb-0">
                            Konfirmasi
                        </h5>

                        <button
                            type="button"
                            className="btn btn-sm p-1 text-muted"
                            style={{
                                border: "none",
                                background: "none",
                                fontSize: "22px",
                                lineHeight: 1,
                            }}
                            onClick={handleCancelLogout}
                        >
                            &times;
                        </button>

                    </div>

                    <p className="text-muted small mb-4">
                        Apakah Anda ingin keluar?
                    </p>

                    <div className="d-flex gap-2">

                        {/* YA */}

                        <button
                            type="button"
                            className="btn flex-fill fw-semibold text-white d-flex align-items-center justify-content-center gap-2"
                            style={{
                                backgroundColor:
                                    "#0B2B8E",

                                borderRadius: "8px",

                                padding: "10px 0",

                                border: "none",
                            }}
                            onClick={
                                handleConfirmLogout
                            }
                            disabled={isLoggingOut}
                        >

                            {isLoggingOut && (
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            )}

                            {isLoggingOut
                                ? "Keluar..."
                                : "YA"}

                        </button>

                        {/* TIDAK */}

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
                                handleCancelLogout
                            }
                            disabled={isLoggingOut}
                        >
                            TIDAK
                        </button>

                    </div>

                </Modal.Body>

            </Modal>

        </div>
    );
};

export default Sidebar;