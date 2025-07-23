import { PagedResult } from "@/types/paged-result";
import { TourService } from "@/types/tour-service";
import http from "@/utils/http";

export const getTourServicesOf = async (tourGuideId: number | string, page: number | string, limit: number | string, signal?: AbortSignal, token?: string | null) => {
  const res = await http.get<PagedResult<TourService>>('tour-services/services-of', {
    params: {
      pageSize: limit,
      pageIndex: page,
      tourGuideId: tourGuideId
    },
    signal,
    headers:{
      'Authorization': token
    }
  });
  return res.data;
};