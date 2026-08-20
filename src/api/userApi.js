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
// REGISTER / CREATE USER
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
// GET ALL USERS
// =========================
export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);

  return response.data;
};

// =========================
// UPDATE USER
// =========================
export const updateUser = async (id, data) => {
  const response = await axios.put(
    `${API_URL}/users/${id}`,
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
// DELETE USER PERMANEN
// =========================
export const deleteUser = async (id) => {
  const response = await axios.delete(
    `${API_URL}/users/${id}`
  );

  return response.data;
};