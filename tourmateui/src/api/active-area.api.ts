import { AreaIdAndName } from "@/types/active-area";
import http from "@/utils/http";

export const fetchAreaIdAndName = async (): Promise<AreaIdAndName[]> => {
  const response = await http.get<AreaIdAndName[]>('/active-areas/id-and-name');
  return response.data;
};