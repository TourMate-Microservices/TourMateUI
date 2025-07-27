import { Feedback } from "@/types/feedbacks";
import { PagedResult } from "@/types/response";
import { paymentServiceHttp } from "@/utils/http";

export const fetchFeedbacksOfTourGuide = async (id: number, page: number, pageSize: number) => {
  const res = await paymentServiceHttp.get<PagedResult<Feedback>>(`feedbacks/tourGuide/${id}`, {
    params: {
        pageIndex: page,
        pageSize
    }
  });
  return res.data;
};