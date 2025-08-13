import axios from 'axios'

const axiosInstance = axios.create({ baseURL: 
    process.env.NEXT_PUBLIC_API_URL || 'https://6d34b78df5d6.ngrok-free.app' })

export default axiosInstance