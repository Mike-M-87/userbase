import toast from "react-hot-toast";
import { getToken } from "./utils";

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}
interface makeRequestParams {
  url: string
  body: object
  method: HttpMethod
}

interface ResponseType {
  success: boolean;
  token: string;
  data?: User | User[];
  errors?: string[]
  meta?: Meta
}

interface Meta {
  page: number
  limit: number
  totalPages: number
  total: number
}


interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  company: string;
  isAdmin: boolean;
  __v: number;
}


export async function makeRequest({ url, body, method }: makeRequestParams) {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken() || ""}`
      },
      body: JSON.stringify(body),
    });
    const jsondata: ResponseType = await response.json();

    if (!response.ok || !jsondata.success || jsondata?.errors) {
      (jsondata?.errors || []).forEach(err => {
        toast.error(err);
      });
    }
    return jsondata
  } catch (error) {
    toast.error(error.message);
    return null;
  }
}
