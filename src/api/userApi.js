import axios from "axios";

const API_URL =
  "https://user-manajemen-be-production.up.railway.app";

// =========================
// LOGIN
// =========================

export const loginUser = async (data) => {
  const response = await axios.post(
    `${API_URL}/login`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// =========================
// TAMBAH USER
// =========================

export const createUser = async (data) => {
  const response = await axios.post(
    `${API_URL}/register`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const tambahDataUser = async (data) => {
  const response = await axios.post(
    `${API_URL}/tambah-data-management`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

