import { ActiveArea, AreaIdAndName, MostPopularArea } from "@/types/active-area";
import { AreaDetailResponse } from "@/types/area-detail-response";
import { PagedResult } from "@/types/paged-result";
import { tourServiceHttp } from "@/utils/http";

export const fetchAreaIdAndName = async (): Promise<AreaIdAndName[]> => {
  const response = await tourServiceHttp.get<AreaIdAndName[]>('active-areas/simplified');
  return response.data;
};

export const getActiveAreas = async (page: number | string, limit: number | string, signal?: AbortSignal) => {
  const res = await tourServiceHttp.get<PagedResult<ActiveArea>>('active-areas', {
    params: {
      size: limit,
      page: page
    },
    signal
  });

  return res.data;
};

export const getFilteredActiveAreas = async (page: number | string, limit: number | string, search: string, region: string, signal?: AbortSignal, excludeContent?: boolean) => {
  const res = await tourServiceHttp.get<PagedResult<ActiveArea>>('active-areas', {
    params: {
      size: limit,
      page: page,
      search: search,
      region: region,
      excludeContent: excludeContent
    },
    signal
  });

  return res.data;
};

export const getActiveArea = async (id: number) => {
  const response = await tourServiceHttp.get<AreaDetailResponse>(`active-areas/area-with-guide?areaId=${id}`)
  return response.data
}

export const getMostPopularAreas = async () => await tourServiceHttp.get<MostPopularArea[]>('active-area/most-popular')

export const getRandomActiveArea = async (size: number, signal?: AbortSignal) => {
  const res = await tourServiceHttp.get<ActiveArea>('active-area/random', {
    params: {
      size: size,
    },
    signal
  });
  return res.data;
};

export const getOtherActiveArea = async (currentActiveAreaId: number, size: number, signal?: AbortSignal) => {
  const res = await tourServiceHttp.get<ActiveArea[]>('active-area/other', {
    params: {
      currentActiveAreaId: currentActiveAreaId,
      size: size
    },
    signal
  });
  return res.data;
}
