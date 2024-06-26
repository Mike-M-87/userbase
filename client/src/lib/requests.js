import { makeRequest } from "./network.ts";
const API_URL = "https://userbase.onrender.com"
// const API_URL = "http://127.0.0.1:8090"

// endpoint url builder
const endpoint = (path, params = {}) => {
  const url = new URL(API_URL + path);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  return url.toString();
};

// functions for api requests

export async function GetUsers(page, filterkey) {
  return await makeRequest({ url: endpoint("/users", { page: page, search: filterkey }), method: "GET" })
}

export async function LoginUser(creds) {
  return await makeRequest({ url: endpoint("/auth/login"), method: "POST", body: creds })
}

export async function RegisterUser(creds) {
  return await makeRequest({ url: endpoint("/users"), method: "POST", body: creds })
}

export async function UpdateUser(userId, creds) {
  return await makeRequest({ url: endpoint("/users/" + userId), method: "PUT", body: creds })
}

export async function DeleteUser(userId) {
  return await makeRequest({ url: endpoint("/users/" + userId), method: "DELETE" })
}