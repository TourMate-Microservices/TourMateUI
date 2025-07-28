import { Customer, CustomerProfile } from "@/types/customer"
import { userServiceHttp } from "@/utils/http"

export const getCustomer = async (id: number) => {
  const response = await userServiceHttp.get<Customer>('customers/get-by-id/' + id)
  return response.data
}

export const getCustomerProfile = async (id: number) => {
  const response = await userServiceHttp.get<CustomerProfile>('customers/get-by-id/' + id)
  return response.data
}

export const getCustomerWithAcc = async (accountId: number) => {
  const response = await userServiceHttp.get<Customer>('customers/get-by-account/' + accountId)
  return response.data
}

export type CustomerUpdate = {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  image: string;
};

export const update = async (id: number, data: CustomerUpdate) => {
  const response = await userServiceHttp.put('customers/' + id, data)
  return response.data
}