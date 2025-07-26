import { LoginPayload, LoginResponse } from "@/types/authenticate";
import { CustomerRegister } from "@/types/customer";
import { TourGuideRegister } from "@/types/tour-guide";
import { userServiceHttp } from "@/utils/http";
import axios from "axios";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await userServiceHttp.post<LoginResponse>("accounts/login", payload, {
      headers: { "Content-Type": "application/json" },
    });

    const data = response.data;

    console.log("Login successful:", data);
    
    if (data && data.accessToken) {
      sessionStorage.setItem("accessToken", data.accessToken);
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
    const response = await userServiceHttp.post<{ msg: string }>("accounts/register-tourguide", payload, {
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
    const response = await userServiceHttp.post<{ msg: string }>("accounts/register-customer", payload, {
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