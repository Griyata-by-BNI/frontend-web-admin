import axios from 'axios'

const axiosInstance = axios.create({ baseURL: 
    process.env.NEXT_PUBLIC_API_URL || 'https://6e4e91325664.ngrok-free.app' })

export default axiosInstance