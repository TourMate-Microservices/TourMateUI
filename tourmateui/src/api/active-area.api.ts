import { ActiveArea, AreaIdAndName } from "@/types/active-area";
import { PagedResult } from "@/types/paged-result";
import http from "@/utils/http";

export const fetchAreaIdAndName = async (): Promise<AreaIdAndName[]> => {
  const response = await http.get<AreaIdAndName[]>('/tour-service/api/v1/active-areas/simplified');
  return response.data;
};


export const getActiveAreas = async (page: number | string, limit: number | string) => {
  const res = await http.get<PagedResult<ActiveArea>>('active-areas', {
    params: {
      pageSize: limit,
      pageIndex: page,
    },
  });

  return res.data; // chỉ trả về mảng ActiveArea[]
};