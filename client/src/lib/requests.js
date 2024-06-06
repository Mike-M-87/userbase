import { makeRequest } from "./network.ts";
const endpoint = (path) => "http://127.0.0.1:8090" + path

export async function GetUsers() {
  return await makeRequest({ url: endpoint("/users"), method: "GET" })
}

export async function LoginUser(creds) {
  return await makeRequest({ url: endpoint("/auth/login"), method: "POST", body: creds })
}

export async function RegisterUser(creds) {
  return await makeRequest({ url: endpoint("/users"), method: "POST", body: creds })
}