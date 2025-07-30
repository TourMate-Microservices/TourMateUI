import { toast } from "react-toastify"
import { PagedResult } from "@/types/response";
import { paymentServiceHttp } from "../utils/http";
import {
  RevenueDto,
  RevenueStatsDto,
  MonthlyRevenueDto,
  RevenueFilterDto,
  RevenueAdmin,
  ProcessPaymentRequest,
  PaymentResultAdmin,
  PaymentHistoryAdmin,
  DashboardStatsAdmin,
} from "@/types/revenue";
// Types based on .NET API DTOs

// Revenue API functions using axios
export const getRevenueStats = async (
  tourGuideId: number,
  month: number,
  year: number,
  signal?: AbortSignal
) => {
  const loadingToast = toast.loading("Đang tải dữ liệu doanh thu...");

  try {
    const response = await paymentServiceHttp.get<RevenueStatsDto>(
      `revenue/stats/${tourGuideId}`,
      {
        params: {
          month,
          year,
        },
        signal,
      }
    );

    toast.update(loadingToast, {
      render: "Tải dữ liệu thành công!",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });

    return response.data;
  } catch (error) {
    toast.update(loadingToast, {
      render: "Không thể tải dữ liệu doanh thu",
      type: "error",
      isLoading: false,
      autoClose: 5000,
    });
    throw error;
  }
};

export const getMonthlyRevenue = async (
  tourGuideId: number,
  month: number,
  year: number,
  signal?: AbortSignal
) => {
  const response = await paymentServiceHttp.get<MonthlyRevenueDto>(
    `revenue/monthly/${tourGuideId}`,
    {
      params: {
        month,
        year,
      },
      signal,
    }
  );
  return response.data;
};

export const getRevenueList = async (
  filter: RevenueFilterDto,
  signal?: AbortSignal
) => {
  const response = await paymentServiceHttp.get<RevenueDto[]>("revenue/list", {
    params: filter,
    signal,
  });
  return response.data;
};

export const getRevenueById = async (
  revenueId: number,
  signal?: AbortSignal
) => {
  const response = await paymentServiceHttp.get<RevenueDto>(`revenue/${revenueId}`, {
    signal,
  });
  return response.data;
};

export const createRevenue = async (
  data: Omit<RevenueDto, "revenueId" | "createdAt">
) => {
  const response = await paymentServiceHttp.post<RevenueDto>("revenue", data);
  toast.success("Tạo doanh thu thành công!");
  return response.data;
};

export const updateRevenue = async (
  revenueId: number,
  data: Partial<RevenueDto>
) => {
  const response = await paymentServiceHttp.put<RevenueDto>(`revenue/${revenueId}`, data);
  toast.success("Cập nhật doanh thu thành công!");
  return response.data;
};

export const deleteRevenue = async (revenueId: number) => {
  await paymentServiceHttp.delete(`revenue/${revenueId}`);
  toast.success("Xóa doanh thu thành công!");
};

export const getGrowthPercentage = async (
  tourGuideId: number,
  month: number,
  year: number,
  signal?: AbortSignal
) => {
  const response = await paymentServiceHttp.get<{ growthPercentage: number }>(
    `revenue/growth/${tourGuideId}`,
    {
      params: {
        month,
        year,
      },
      signal,
    }
  );
  return response.data;
};

export const getAllRevenue = async (
  page: number | string,
  limit: number | string,
  signal?: AbortSignal
) => {
  const res = await paymentServiceHttp.get<PagedResult<RevenueDto>>("revenue", {
    params: {
      pageSize: limit,
      pageIndex: page,
    },
    signal,
  });
  return res.data; // chỉ trả về mảng RevenueDto[]
};

export const exportRevenueExcel = async (tourGuideId: number, month: number, year: number) => {
  const loadingToast = toast.loading("Đang tạo file Excel...")

  try {
    const response = await paymentServiceHttp.get(`revenue/export/${tourGuideId}`, {
      params: {
        month,
        year,
      },
      responseType: "blob",
      headers: {
        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    })

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `revenue-report-${month}-${year}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    toast.update(loadingToast, {
      render: "Xuất Excel thành công!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    })

    return response.data
  } catch (error) {
    toast.update(loadingToast, {
      render: "Không thể xuất file Excel",
      type: "error",
      isLoading: false,
      autoClose: 5000,
    })
    throw error
  }
}

// Revenue API object for easier imports
export const revenueApi = {
  getStats: getRevenueStats,
  getMonthly: getMonthlyRevenue,
  getList: getRevenueList,
  getById: getRevenueById,
  create: createRevenue,
  update: updateRevenue,
  delete: deleteRevenue,
  getGrowth: getGrowthPercentage,
  exportExcel: exportRevenueExcel,
}

export const getDashboardStats = async (signal?: AbortSignal) => {
  const response = await paymentServiceHttp.get<DashboardStatsAdmin>(`revenue/dashboard-stats`, {
    signal,
  })
  return response.data
}

export const getAdminRevenueById = async (
  revenueId: number,
  signal?: AbortSignal
) => {
  const response = await paymentServiceHttp.get<RevenueAdmin>(`revenue/details/${revenueId}`, {
    signal,
  })
  return response.data
}

export const getUnpaidRevenues = async (
  page: number = 1,
  pageSize: number = 10,
  searchTerm?: string,
  signal?: AbortSignal
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  })

  if (searchTerm) {
    params.append("searchTerm", searchTerm)
  }

  const response = await paymentServiceHttp.get<PagedResult<RevenueAdmin>>(`revenue/unpaid?${params}`, {
    signal,
  })
  return response.data
}

export const processPayment = async (
  request: ProcessPaymentRequest,
  signal?: AbortSignal
) => {
  const response = await paymentServiceHttp.post<PaymentResultAdmin>("revenue/process-payment", request, {
    signal,
  })
  return response.data
}

export const getPaymentHistory = async (
  page: number = 1,
  pageSize: number = 10,
  signal?: AbortSignal
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  })

  const response = await paymentServiceHttp.get<PagedResult<PaymentHistoryAdmin>>(`revenue/payment-history?${params}`, {
    signal,
  })
  return response.data
}