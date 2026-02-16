import { ApiClient } from "@/services/ApiClient";
import { LoginRequest, LoginResponse, UserInfo } from "@/services/auth";

export class AuthService {
  constructor(private api: ApiClient) {}

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(
      "/auth/login",
      credentials,
    );
    return response.data;
  }

  async refresh(): Promise<LoginResponse> {
    const response = await this.api.get<LoginResponse>("/auth/refresh");
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.get("/auth/logout");
  }

  async me(): Promise<UserInfo> {
    const response = await this.api.get<UserInfo>("/user/me");
    return response.data;
  }
}
