export const setAccessTokenToLS = (access_token) => localStorage.setItem('access_token', access_token)
export const getAccessTokenFormLS = () => localStorage.getItem('access_token')
export const LocalStorageEventTarget = new EventTarget()

export const clearLS = () => {
    localStorage.removeItem('access_token')

    const clearLSEvent = new Event('clearLS')
        LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}