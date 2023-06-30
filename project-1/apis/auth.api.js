import http from "../utils/http.js"
export const authApi = {
    registerAccount: (bodyRequest) => {
        return http.post('/register', bodyRequest)
    },
    login:(bodyRequest) => {
        return http.post('/login', bodyRequest)
    }
}