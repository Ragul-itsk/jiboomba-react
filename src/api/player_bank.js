    import axios from "axios";
    import { BASE_URL } from "../config/apiConfig";

    export const storeBank = async (data, token) => {
    try {
        const response = await axios.post(`${BASE_URL}/player/store-bank`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || "An error occurred";
    }
    };

    export const getPaymentMethod = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/player/payment-methods`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching payment methods:", error);
        return [];
    }
    };

    export const getBank = async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/player/get-bank`, {
            headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching payment methods:", error);
            return [];
        }
        };

        export const fetchStatement = async (token) => {
            try {
                const response = await axios.get(`${BASE_URL}/player/statement`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return response.data;
            } catch (error) {
                console.error("Error fetching payment statement:", error);
                return { status: "error", depositHistory: [] };
            }
        };


        export const editBank = async (token, bankId) => {
            try {
                const response = await axios.get(`${BASE_URL}/player/edit-bank/${bankId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return response.data;
            } catch (error) {
                console.error("Error fetching bank details:", error);
                return null;
            }
        };
        
