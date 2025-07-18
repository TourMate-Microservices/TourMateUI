import { MyJwtPayload } from "@/types/jwt-payload";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

/**
 * Hook để lấy token (đã hash) từ sessionStorage và trả về.
 * 
 * @param key khóa lưu token trong sessionStorage, mặc định 'accessToken'
 */
export function useToken(key: string = "accessToken") {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
      const storedToken = sessionStorage.getItem(key);
      if (!storedToken) {
        return;
      }
      setToken(storedToken);
  }, [key]);

  return token;
}

export function getUserRole(key: string): string | null {
      const decoded: MyJwtPayload | null = key ? jwtDecode<MyJwtPayload>(key.toString()) : null;      
      return decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as string ?? null;
}
