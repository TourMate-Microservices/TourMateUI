export type CustomerRegister = {
    image: string;
    email: string;
    password: string;
    fullName: string;
    phone: string;
    gender: string;
    dateOfBirth: string; // ISO date string
};


export type Customer = {
  customerId: number;
  fullName: string;
  accountId: number;
  gender: string;
  dateOfBirth: string;
  phone: string;
  image: string;
};