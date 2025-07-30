import { TourGuide, TourGuideIdAndName, TourGuideProfile, TourGuideWithTour } from "@/types/tour-guide";
import { userServiceHttp } from "../utils/http";
import { PagedResult } from "@/types/response";
import { TourGuideDetail } from "@/types/tour-guide-detail";

export const getTourGuides = async (page: number | string, limit: number | string, fullName?: string) => {
  const res = await userServiceHttp.get<PagedResult<TourGuide>>('/tour-guides/paged', {
    params: {
      pageSize: limit,
      pageIndex: page,
      fullName: fullName,
    },
  });

  return res.data;
};

export const getTourGuidesWithTour = async (numOfTourGuides: number, numOfTours: number) => {
  const res = await userServiceHttp.get<TourGuideWithTour[]>('/tour-guides/tourguide-with-tours', {
    params: {
      numOfTourGuides: numOfTourGuides,
      numOfTours: numOfTours
    },
  });

  return res.data;
};

export const getTourGuideByAccountId = async (accountId: number): Promise<TourGuideIdAndName> => {
  const response = await userServiceHttp.get<TourGuideIdAndName>(`/tour-guides/from-account/${accountId}`);
  return response.data;
};

export const getByAccountId = async (accountId: number): Promise<TourGuide> => {
  const response = await userServiceHttp.get<TourGuide>(`/tour-guides/get-by-accountid/${accountId}`);
  return response.data;
};


export const getList = async (name: string, areaId: string | number | undefined, page: number | string, limit: number | string, signal?: AbortSignal) => {
  const num = Number(areaId)
  const res = await userServiceHttp.get<PagedResult<TourGuide>>('tour-guides/get-list', {
    params: {
      pageSize: limit,
      pageIndex: page,
      name: name,
      areaId: num > 0 ? num : undefined
    },
    signal
  });

  return res.data;
};

export const getTourGuide = async (id: number) => userServiceHttp.get<TourGuide>(`tour-guides/${id}`)
export const getTourGuideProfile = async (id: number) => userServiceHttp.get<TourGuideProfile>(`tour-guides/profile/${id}`)

export const getOtherTourGuides = async (tourGuideId: number | string, pageSize: number, signal?: AbortSignal) => {
  const res = await userServiceHttp.get<TourGuide[]>('tour-guides/other', {
    params: {
      pageSize: pageSize,
      tourGuideId: tourGuideId,
      prioritizeMembership: true
    },
    signal
  });
  return res.data;
};

export const getTourGuidesByArea = async (areaId: number | string, pageSize: number, signal?: AbortSignal) => {
  const res = await userServiceHttp.get<TourGuide>('tour-guides/getbyarea', {
    params: {
      pageSize: pageSize,
      areaId,
      pageIndex: 1,
      prioritizeMembership: true
    },
    signal
  });
  return res.data;
};

export const changePassword = async (id: number, newPassword: string) => {
  try {
    const response = await userServiceHttp.put(`tour-guides/change-password/${id}`, newPassword);
    return response.data;
  }
  catch (err) {
    throw err
  }
}

export const getTourGuideWithServices = async (id: number | string) => {
  try {
    const response = await userServiceHttp.get<TourGuideDetail>(`/tour-guides/by-id-with-tours-paged?id=${id}&page=1&perPage=5`);
    return response.data;
  }
  catch (err) {
    throw err
  }
}