import { ApiResponse } from "@/types/message";
import { messageServiceHttp } from "../utils/http";

export const fetchMessages = async (conversationId: number, page: unknown, pageSize: number) => {
  const res = await messageServiceHttp.get<ApiResponse>(`/conversations/${conversationId}/messages`, {
    params: { page, pageSize },
  });
  return res.data;
};

export const sendMessageApi = async (conversationId: number, text: string, senderId: number) => {
  return await messageServiceHttp.post(`/conversations/${conversationId}/send`, { text, senderId });
};