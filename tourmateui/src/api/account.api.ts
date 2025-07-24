import { LoginPayload, LoginResponse } from "@/types/authenticate";
import { CustomerRegister } from "@/types/customer";
import { TourGuideRegister } from "@/types/tour-guide";
import {http} from "@/utils/http";
import axios from "axios";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await http.post<LoginResponse>("/v1/accounts/login", payload, {
      headers: { "Content-Type": "application/json" },
    });

    const data = response.data;

    if (data && data.accessToken && data.refreshToken) {
      sessionStorage.setItem("accessToken", data.accessToken);
      sessionStorage.setItem("refreshToken", data.refreshToken);
    }

    return data;
  } catch (error) {
    let message = "Đăng nhập thất bại";

    if (axios.isAxiosError(error)) {
      if (
        error.response?.data &&
        typeof error.response.data === "object" &&
        "msg" in error.response.data
      ) {
        message = (error.response.data as { msg: string }).msg;
      } else if (error.message) {
        message = error.message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }

    throw new Error(message);
  }
}

/**
 * Đăng ký tài khoản hướng dẫn viên
 */
export async function registerTourGuide(payload: TourGuideRegister): Promise<{ msg: string }> {
  try {
    const response = await http.post<{ msg: string }>("/v1/accounts/register-tourguide", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    let message = "Đăng ký thất bại";
    if (axios.isAxiosError(error)) {
      if (
        error.response?.data &&
        typeof error.response.data === "object" &&
        "msg" in error.response.data
      ) {
        message = (error.response.data as { msg: string }).msg;
      } else if (error.message) {
        message = error.message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }
    throw new Error(message);
  }
}

export async function registerCustomer(payload: CustomerRegister): Promise<{ msg: string }> {
  try {
    const response = await http.post<{ msg: string }>("/v1/accounts/register-customer", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    let message = "Đăng ký thất bại";
    if (axios.isAxiosError(error)) {
      if (
        error.response?.data &&
        typeof error.response.data === "object" &&
        "msg" in error.response.data
      ) {
        message = (error.response.data as { msg: string }).msg;
      } else if (error.message) {
        message = error.message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }
    throw new Error(message);
  }
}