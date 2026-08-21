import axios from "axios";

const API_URL =
  "https://user-manajemen-be-production.up.railway.app";


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


export const getUsers = async () => {
  const response = await axios.get(
    `${API_URL}/users`
  );

  return response.data;
};

export const tambahDataUser = async (data) => {
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

export const getUser = async (id) => {
  const response = await axios.get(
    `${API_URL}/users/${id}`
  );

  return response.data;
};

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

export const deleteUser = async (id) => {
  const response = await axios.delete(
    `${API_URL}/users/${id}`
  );

  return response.data;
};

export const updateProfil = async (id, nama, foto) => {
  const formData = new FormData();

  formData.append("nama", nama);

  if (foto) {
    formData.append("foto", foto);
  }

  const response = await axios.put(
    `${API_URL}/profil/${id}`,
    formData
  );

  return response.data;
};