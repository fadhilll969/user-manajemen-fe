import axios from "axios";

const API_URL = "https://user-manajemen-be-production.up.railway.app";

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