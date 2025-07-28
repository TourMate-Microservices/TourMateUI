import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Settings } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useToken } from "./getToken";
import { MyJwtPayload } from "@/types/jwt-payload";
import { jwtDecode } from "jwt-decode";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { Customer } from "@/types/customer";
import { getUserByAccountAndRole } from "@/api/account.api";
import { getCustomer, getCustomerProfile, getCustomerWithAcc, update } from "@/api/customer.api";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebaseConfig";

export default function CustomerProfile() {
    const token = useToken("accessToken");
    const decoded: MyJwtPayload | null = token
        ? jwtDecode<MyJwtPayload>(token.toString())
        : null;
    const currentAccountId = decoded?.AccountId;
    const accountRole = decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as string;

    const { data: customer } = useQuery({
        queryKey: ["user-profile", currentAccountId, accountRole],
        queryFn: () => {
            const controller = new AbortController();
            setTimeout(() => {
                controller.abort();
            }, 5000);
            if (typeof accountRole !== "string") {
                throw new Error("Account role is required");
            }
            return getCustomerProfile(decoded?.SuppliedId ?? -1)
        },
        retry: 0,
        refetchOnWindowFocus: false,
        staleTime: 24 * 3600 * 1000,
        enabled: token !== null
    });


    const [fullName, setFullName] = useState<string>(customer?.fullName || "");
    const [phone, setPhone] = useState<string>(customer?.phone || "");
    const [dob, setDob] = useState<string>(customer?.dateOfBirth?.split("T")[0] || "");
    const [gender, setGender] = useState<string>(customer?.gender || "");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (customer) {
            setFullName(customer.fullName || "");
            setPhone(customer.phone || "");
            setDob(customer.dateOfBirth?.split("T")[0] || "");
            setGender(customer.gender || "");
        }
    }, [customer]);

    useEffect(() => {
        if (selectedImage) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(selectedImage);
        } else {
            setPreviewImage(null);
        }
    }, [selectedImage]);

    const { mutate } = useMutation({
        mutationFn: (payload: Customer) => update(customer?.customerId as number, payload),
        onSuccess: () => {
            toast.success("Cập nhật thông tin thành công!");
            setIsUpdating(false);
        },
        onError: () => {
            toast.error("Cập nhật thất bại, vui lòng thử lại.");
            setIsUpdating(false);
        },
    });


    const [isUpdating, setIsUpdating] = useState(false);
    const handleImageUpload = async (file: File) => {
        if (!file) return

        try {
            const storageRef = ref(storage, `customers/profile-images/${Date.now()}-${file.name}`)
            const snapshot = await uploadBytes(storageRef, file)
            const downloadURL = await getDownloadURL(snapshot.ref)
            return downloadURL
        } catch (error) {
            console.error("Error uploading image:", error)
            alert("Tải ảnh lên thất bại. Vui lòng thử lại.")
        }
    }
    const handleUpdate = () => {
        if (!customer) return;

        const update = async () => {
            try {
                setIsUpdating(true);
                let imageUrl = customer.image;

                if (selectedImage) {
                    imageUrl = (await handleImageUpload(selectedImage)) || ''; // 👈 gọi qua backend
                }

                const updatedCustomer: Customer = {
                    ...customer,
                    fullName: fullName.trim() !== "" ? fullName : customer.fullName,
                    phone: phone.trim() !== "" ? phone : customer.phone,
                    gender: gender,
                    dateOfBirth: dob.trim() !== "" ? dob : customer.dateOfBirth,
                    image: imageUrl,
                };


                mutate(updatedCustomer);
            } catch (error) {
                toast.error("Tải ảnh lên thất bại, vui lòng thử lại.");
                console.error(error);
                setIsUpdating(false);
            }
        };

        update();
    };


    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <button className="w-full flex items-center gap-3 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md">
                        <Settings size={18} />
                        Thông tin tài khoản
                    </button>
                </DialogTrigger>

                <DialogContent className="max-w-lg rounded-lg">
                    <DialogHeader className="items-center text-center space-y-2">
                        <div className="relative group w-fit mx-auto">
                            <img
                                src={
                                    previewImage ||
                                    customer?.image ||
                                    "https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg"
                                }
                                alt="User Avatar"
                                className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 mx-auto"
                            />
                            <label className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[rgba(0,0,0,0.3)]">
                                <span className="text-white text-xs font-semibold">Chọn ảnh</span>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setSelectedImage(e.target.files[0]);
                                        }
                                    }}
                                />
                            </label>

                        </div>

                        <DialogTitle className="text-lg font-semibold">
                            {customer?.fullName || "Nguyễn Văn A"}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Chỉnh sửa thông tin của bạn tại đây, nhấn xác nhận để lưu thay đổi.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                defaultValue={customer?.account?.email}
                                placeholder="Nhập email..."
                                disabled
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="fullname">Họ và tên</Label>
                            <Input
                                id="fullname"
                                name="fullname"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Nhập họ tên..."
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Số điện thoại</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Nhập số điện thoại..."
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="grid gap-2 col-span-1">
                                <Label htmlFor="dob">Ngày sinh</Label>
                                <Input
                                    type="date"
                                    id="dob"
                                    name="dateOfBirth"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2 col-span-1">
                                <Label htmlFor="gender">Giới tính</Label>
                                <Select
                                    name="gender"
                                    value={gender}
                                    onValueChange={(value) => setGender(value)}
                                >
                                    <SelectTrigger id="gender" className="w-full">
                                        <SelectValue placeholder="Chọn giới tính" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Nam">Nam</SelectItem>
                                        <SelectItem value="Nữ">Nữ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2 col-span-1">
                                <Label htmlFor="createdDate">Ngày tham gia</Label>
                                <Input
                                    id="createdDate"
                                    name="createdDate"
                                    value={
                                        customer?.account?.createdDate
                                            ? new Date(customer?.account?.createdDate).toLocaleDateString("vi-VN")
                                            : ""
                                    }
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex justify-center gap-4 pt-4">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                                Đóng
                            </Button>
                        </DialogClose>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            type="button"
                            onClick={handleUpdate}
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Đang cập nhật..." : "Xác nhận"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
