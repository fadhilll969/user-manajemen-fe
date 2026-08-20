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

// =========================
// GET USERS
// =========================
export const getUsers = async () => {
  const response = await axios.get(
    `${API_URL}/users`
  );

  return response.data;
};