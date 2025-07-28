import { Customer } from "@/types/customer"
import { userServiceHttp } from "@/utils/http"

export const getCustomer = async (id: number) => {
  const response = await userServiceHttp.get<Customer>('customers/get-by-id/' + id)
  return response.data
}

export const getCustomerWithAcc = async (accountId: number) => {
  const response = await userServiceHttp.get<Customer>('customers/get-by-account/' + accountId)
  return response.data
}