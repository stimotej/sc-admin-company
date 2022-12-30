import type { AxiosError } from "axios";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  link: string;
  slug: string;
  description: string;
  image_url: string;
  data: {
    document_url: string;
    document_id: number;
    roles: string[];
    oib_company: string;
    name: string;
    short_name: string;
    id_number: string;
    address: string;
    location: string;
    first_name: string;
    last_name: string;
    oib: string;
    iban: string;
    phone: string;
    mobile: string;
    telefax: string;
    email: string;
  };
}

export interface LoginResponse {
  data: {
    jwt: string;
  };
  success: boolean;
}

export interface LoginCallbackFunctions {
  onError?: (a: AxiosError) => void;
  onSuccess?: (a: LoginResponse) => void;
}

export interface WPUpdateProfileErrorData {
  code: string;
  data: {
    status: number;
  };
  message: string;
}

export interface JwtData {
  email: string;
  id: string;
  username: string;
}
