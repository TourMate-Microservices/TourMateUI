export interface ApiError {
  response?: {
    data?: {
      msg?: string;
    };
  };
}


export interface ChangePasswordResponse {
  msg: string;
}
