import { TourGuide } from "@/types/tour-guide";
import http from "@/utils/http";

export const getOtherTourGuides = async (tourGuideId: number | string, pageSize: number, signal?: AbortSignal) => {
  const res = await http.get<TourGuide[]>('/user-service/api/v1/tour-guides/other', {
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
  const res = await http.get<TourGuide[]>('/user-service/api/v1/tour-guides/get-by-area', {
    params: {
      pageSize: pageSize,
      areaId,
      prioritizeMembership: true
    },
    signal
  });
  return res.data;
};
