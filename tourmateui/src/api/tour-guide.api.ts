import { TourGuide, TourGuideIdAndName, TourGuideWithTour } from "@/types/tour-guide";
import {http} from "../utils/http";
import { PagedResult } from "@/types/response";
import { mockTourGuideDetail } from "./tour-guide-with-service.mock.api";
import { TourGuideDetail } from "@/types/tour-guide-detail";

export const getTourGuides = async (page: number | string, limit: number | string, signal?: AbortSignal, phone?: string) => {
  const res = await http.get<PagedResult<TourGuide>>('user-service/api/v1/tour-guides', {
    params: {
      pageSize: limit,
      pageIndex: page,
      phone: phone,
    },
    signal
  });

  return res.data;
};

export const getTourGuidesWithTour = async (numOfTourGuides: number, numOfTours: number) => {
  const res = await http.get<TourGuideWithTour[]>('user-service/api/v1/tour-guides/tourguide-with-tours', {
    params: {
      numOfTourGuides: numOfTourGuides,
      numOfTours: numOfTours
    },
  });

  return res.data;
};

export const getTourGuideByAccountId = async (accountId: number): Promise<TourGuideIdAndName> => {
  const response = await http.get<TourGuideIdAndName>(`user-service/api/v1//tour-guides/from-account/${accountId}`);
  return response.data;
};

export const getByAccountId = async (accountId: number): Promise<TourGuide> => {
  const response = await http.get<TourGuide>(`user-service/api/v1//tour-guides/get-by-accountid/${accountId}`);
  return response.data;
};


export const getList = async (name: string, areaId: string | number | undefined, page: number | string, limit: number | string, signal?: AbortSignal) => {
  const num = Number(areaId)
  const res = await http.get<PagedResult<TourGuide>>('user-service/api/v1/tour-guides/get-list', {
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

export const getTourGuide = async (id: number) => http.get<TourGuide>(`user-service/api/v1/tour-guide/${id}`)


export const getOtherTourGuides = async (tourGuideId: number | string, pageSize: number, signal?: AbortSignal) => {
  const res = await http.get<TourGuide[]>('user-service/api/v1/tour-guides/other', {
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
  const res = await http.get<TourGuide>('user-service/api/v1/tour-guides/getbyarea', {
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
    const response = await http.put(`user-service/api/v1/tour-guides/change-password/${id}`, newPassword);
    return response.data;
  }
  catch (err) {
    throw err
  }
}

export const getTourGuideWithServices = async (id: number | string) => {
  try {
    const response = await http.get<TourGuideDetail>(`user-service/api/v1/tour-guides/${id}`);
    return response.data;
  }
  catch (err) {
    throw err
  }
}