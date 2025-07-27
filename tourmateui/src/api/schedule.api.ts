import { PagedResult } from "@/types/response";
import {userServiceHttp} from "../utils/http";
import { TourSchedule } from "@/types/tour-schedule";

export const fetchSchedules = async (
    selectedFilter: string,
    searchTerm: string,
    currentPage: number,
    pageSize: number,
    accountId: number,
    role: string
) => {
    const res = await userServiceHttp.get<PagedResult<TourSchedule>>('/invoices', {
        params: {
            status: selectedFilter,
            search: searchTerm,
            page: currentPage,
            pageSize: pageSize,
            accountId: accountId,
            role: role,
        },
    });

    return res.data;
};

export const fetchScheduleByInvoiceId = async (invoiceId: number) => {
  const res = await userServiceHttp.get<TourSchedule>(`invoices/schedule/${invoiceId}`);
  return res.data;
};
