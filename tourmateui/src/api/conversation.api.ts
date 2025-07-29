import { ConversationListResult, ConversationResponse } from "@/types/conversation";
import { messageServiceHttp } from "@/utils/http";

export const fetchConversations = async (
  page: unknown ,
  pageSize: number,
  userId: number,
  searchTerm: string = ""
) => {
  const res = await messageServiceHttp.get<ConversationListResult>("/conversations", {
    params: {
      page,
      pageSize,
      userId,
      searchTerm: searchTerm.trim(),
    },
  });
  return res.data;
};

export const fetchMarkRead = async (id: number, userId: number) => {
  const response = await messageServiceHttp.post(`/messages/${id}/mark-read`, null, {
    params: {
      userId,
    },
  });
  return response.data;
};


export const fetchOrCreateConversation = async (
  currentUserId: number,
  otherUserId: number,
  currentRole: number
): Promise<ConversationResponse> => {
  const res = await messageServiceHttp.get<ConversationResponse>(
    "/conversations/fetch-or-create",
    {
      params: { currentUserId, otherUserId, currentRole },
    }
  );

  return res.data;
};


