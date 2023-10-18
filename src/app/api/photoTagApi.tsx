import axios from 'axios'

const photoTagApi = axios.create({
    baseURL: 'http://localhost:3500/',
    withCredentials: true,
})

export default photoTagApi