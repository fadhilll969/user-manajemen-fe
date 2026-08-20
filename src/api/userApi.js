import axios from "axios";

// =========================
// BASE API URL
// =========================

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
// BUAT USER BARU
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

export const createUser = async (data) => {
  const response = await axios.post(
    `${API_URL}/users`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

