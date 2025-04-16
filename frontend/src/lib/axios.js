import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL : 'https://mern-chat-web-app-backend.onrender.com/api',
    withCredentials: true,
})
