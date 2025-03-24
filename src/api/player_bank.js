    import axios from "axios";

    const API_URL = "https://staging.syscorp.in/api/v1/jiboomba"; 

    export const storeBank = async (data, token) => {
    try {
        const response = await axios.post(`${API_URL}/player/store-bank`, data, {
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
        const response = await axios.get(`${API_URL}/player/payment-methods`, {
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
            const response = await axios.get(`${API_URL}/player/get-bank`, {
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
                const response = await axios.get(`${API_URL}/player/statement`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return response.data;
            } catch (error) {
                console.error("Error fetching payment statement:", error);
                return { status: "error", depositHistory: [] };
            }
        };

        
