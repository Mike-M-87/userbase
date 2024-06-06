export const AUTHTOKEN = "authToken"
export const AUTHUSER = "authUser"

export const getToken = () => {
  return localStorage.getItem(AUTHTOKEN)
}

export const getUser = () => {
  return JSON.parse(localStorage.getItem(AUTHUSER))
}