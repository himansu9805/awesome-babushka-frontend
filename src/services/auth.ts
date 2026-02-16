export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface UserInfo {
  username: string;
  email: string;
  verified: boolean;
  active: boolean;
}
