import { CreateTourFeedback, Feedback, UpdateFeedback } from "@/types/feedbacks";
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

export const getTourFeedbackByInvoice = async (invoiceId: number) => {
  const response = await paymentServiceHttp.get(`/feedbacks/${invoiceId}`)
  return response.data
};

export const addTourFeedback = async (data: CreateTourFeedback) => {
  const response = await paymentServiceHttp.post("/feedbacks", data)
  return response.data
}

export const updateTourFeedback = async (data: UpdateFeedback) => {
  const response = await paymentServiceHttp.put(`/feedbacks/${data.request.feedbackId}`, data)
  return response.data
}

export const deleteTourFeedback = async (feedbackId: number) => {
  const response = await paymentServiceHttp.delete(`/feedbacks/${feedbackId}`)
  return response.data
}