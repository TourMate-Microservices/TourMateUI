"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoleSelectionModal } from "@/components/role-selection-modal";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { MyJwtPayload } from "@/types/jwt-payload";
import { login } from "@/api/account.api";
import Logo from "@/public/logo.png";
import VietNamScrene from "@/public/vietnam-scene.jpg";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  // ✅ Thực hiện push sau khi setRedirectTo
  useEffect(() => {
    if (redirectTo) {
      router.push(redirectTo);
    }
  }, [redirectTo, router]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await login({ email, password });

      if (!result.accessToken) throw new Error("Không nhận được accessToken");

      const decoded: MyJwtPayload | null = jwtDecode<MyJwtPayload>(result.accessToken.toString());
      const role = decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as string;

      if (!role) throw new Error("Không xác định được vai trò từ JWT");

      switch (role) {
        case "Customer":
        case "TourGuide":
          setRedirectTo("/");
          break;
        case "Admin":
          setRedirectTo("/admin/dashboard");
          break;
        default:
          throw new Error("Vai trò không hợp lệ");
      }
    } catch (err) {
      let message = "Đăng nhập thất bại";

      if (axios.isAxiosError(err)) {
        if (err.response?.data && typeof err.response.data === "object" && "msg" in err.response.data) {
          message = (err.response.data as { msg: string }).msg;
        } else if (err.message) {
          message = err.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      console.error("Login error:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-[-4] w-40 mt-[-15]">
                  <Link href="/">
                    <img src={Logo.src} alt="TourMate Logo" className="w-full h-auto" />
                  </Link>
                </div>
                <h1 className="text-2xl font-bold">Chào mừng bạn quay trở lại</h1>
                <p className="text-balance text-muted-foreground">
                  Đăng nhập tài khoản TourMate
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={loading} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mật Khẩu</Label>
                  <Link href="/reset-password/request" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required disabled={loading} />
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
              </Button>

              {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">Hoặc tiếp tục với</span>
              </div> */}
            
              <div className="text-center text-sm">
                Không có tài khoản?{" "}
                <Button type="button" onClick={() => setIsModalOpen(true)} variant="link" className="underline underline-offset-4 hover:text-gray-600 p-0 cursor-pointer" disabled={loading}>
                  Đăng Ký
                </Button>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img src={VietNamScrene.src} alt="Image" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-white [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Bằng cách nhấn Đăng nhập, bạn đồng ý với các{" "}
        <Link href="#">Điều khoản Dịch vụ</Link> và{" "}
        <Link href="#">Chính sách Bảo mật</Link> của chúng tôi.
      </div>
      <RoleSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
