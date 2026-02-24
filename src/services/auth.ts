export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface UserInfo {
  firstname: string;
  lastname: string;
  bio: string;
  username: string;
  email: string;
  verified: boolean;
  active: boolean;
}

export interface UserUpdateRequest {
  firstname: string;
  lastname: string;
  bio: string;
  username: string;
}
