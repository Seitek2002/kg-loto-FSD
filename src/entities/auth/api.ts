import api from "@/shared/api/apiClient";

interface AutoLoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
  };
}

export const authApi = {
  webviewAutoLogin: async (phoneNumber: string, appSource: string | null) => {
    const payload: Record<string, string> = {
      phoneNumber: phoneNumber,
    };

    if (appSource) {
      payload.appSource = appSource;
    }

    const { data } = await api.post<AutoLoginResponse>(
      "/auth/webview/auto-login/",
      payload,
    );

    return data.data;
  },
};
