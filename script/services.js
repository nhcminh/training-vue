// Api URL
const API_URL = 'https://api-ecom.duthanhduoc.com'
//Axios common
export const axiosCaller = async (method, url, data, handleSuccess, handleError) => {
    try {
        const response = await axios({
            method: method,
            url: API_URL + url,
            data: data
        });
        handleSuccess(response.data);
    } catch (error) {
        handleError(error);
        throw error;
    }
};