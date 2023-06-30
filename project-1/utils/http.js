import HttpStatusCode from "../constants/httpStatusCode.js";
import { clearLS, getAccessTokenFormLS, setAccessTokenToLS } from "./auth.js";

const http = axios.create({
    baseURL: 'https://api-ecom.duthanhduoc.com/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 60 * 60 * 24,
        'expire-refresh-token': 60 * 60 * 24 *160,
    }
});

http.interceptors.request.use(
    (config) => {
        if(getAccessTokenFormLS() && config.headers) {
            config.headers.Authorization = getAccessTokenFormLS()
            return config
        }
        return config
    }, (err) => {
        return Promise.reject(err)
    }
);

http.interceptors.response.use(
    (response) => {
        const { url } = response.config
        if (url === '/login' || url === '/register') {
            const data = response.data
            setAccessTokenToLS(data.data.access_token)
        } else if (url === '/logout') {
            clearLS()
        }
        return response
    },
    (error) => {
        if(![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response.status)) {
            const data = error.response.data
            const message = data.message
            return Promise.reject(message)
        }

        return Promise.reject(error.response.data)
    }
)

export default http