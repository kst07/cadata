import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/';

const AxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 5000, 
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    }
});

// ฟังก์ชันเพื่อรีเฟรช Token
const refreshToken = async () => {
    const refresh_token = localStorage.getItem('RefreshToken');
    if (!refresh_token) {
        throw new Error("No refresh token found");
    }

    try {
        const response = await axios.post(`${baseUrl}api/refresh-token/`, { refresh_token });
        const { token } = response.data;
        localStorage.setItem('Token', token); // เก็บ token ใหม่
        return token;
    } catch (error) {
        console.error("Error refreshing token:", error);
        localStorage.removeItem('Token');
        localStorage.removeItem('RefreshToken');
        window.location.href = "/login";  // ล็อกอินใหม่
        return Promise.reject(error);
    }
};

// Interceptor request
AxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('Token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        } else {
            config.headers.Authorization = '';  // ถ้าไม่มี token จะไม่ส่ง header นี้
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor response
AxiosInstance.interceptors.response.use(
    (response) => {
        return response;
    }, 
    async (error) => {
        if (error.response && error.response.status === 401) {
            const originalRequest = error.config;
            if (!originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const newToken = await refreshToken();
                    // แทนที่ Token ใหม่ใน header
                    originalRequest.headers['Authorization'] = `Token ${newToken}`;
                    return axios(originalRequest);  // ส่ง request ที่แทนที่
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default AxiosInstance;

