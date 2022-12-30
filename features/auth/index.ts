import axios from "axios";
import jwt from "jsonwebtoken";
import authKeys from "./queries";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { croToEngString } from "../../utils/croToEngString";

import type { AxiosResponse, AxiosError } from "axios";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type {
  JwtData,
  LoginCallbackFunctions,
  LoginCredentials,
  LoginResponse,
  User,
  WPUpdateProfileErrorData,
} from "./types";

export const useLogin = () => {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const login = (
    { username, password }: LoginCredentials,
    { onError, onSuccess }: LoginCallbackFunctions = {}
  ) => {
    setIsLoading(true);

    axios
      .post("http://161.53.174.14/?rest_route=/simple-jwt-login/v1/auth", {
        username,
        password,
      })
      .then(async (response: AxiosResponse<LoginResponse>) => {
        const tokenData = jwt.decode(response.data.data.jwt) as JwtData;

        window.localStorage.setItem("access_token", response.data.data.jwt);
        window.localStorage.setItem("username", tokenData?.username);
        window.localStorage.setItem("user_id", tokenData?.id);

        axios.defaults.headers.common.Authorization = `Bearer ${response.data.data.jwt}`;

        const userRes = await axios.get(
          "http://161.53.174.14//wp-json/wp/v2/users/me"
        );

        const user = { ...tokenData, ...userRes.data };

        queryClient.setQueryData(authKeys.auth, user);

        return onSuccess && onSuccess(response.data);
      })
      .catch((error) => {
        setIsError(true);
        onError && onError(error);
      })
      .finally(() => setIsLoading(false));
  };

  return { login, isLoading, isError };
};

export const logout = () => {
  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("username");
  window.localStorage.removeItem("user_id");
  delete axios.defaults.headers.common["Authorization"];
};

export const useAuth = (
  options?: UseQueryOptions<{}, AxiosError, User, string[]>
): UseQueryResult<User> => {
  return useQuery(
    authKeys.auth,
    async () => {
      const token = window.localStorage.getItem("access_token") || "";
      const tokenData = jwt.decode(token) as JwtData;

      const response = await axios.get(
        "http://161.53.174.14//wp-json/wp/v2/users/me"
      );
      const user = { ...tokenData, ...response.data };

      return user;
    },
    {
      staleTime: Infinity,
      ...options,
    }
  );
};

export const useGenerateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (userData: User["data"]) => {
      const response = await axios.post(
        "http://161.53.174.14/zaposlenici/api/generate-document",
        userData
      );
      return response.data;
    },
    {
      onSuccess: () => {
        message.success("Dokument je uspješno generiran.");
        return queryClient.invalidateQueries(authKeys.auth);
      },
      onError: () => {
        message.error("Došlo je do greške kod generiranja dokumenta.");
      },
    }
  );
};

export const useRegenerateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (userData: User["data"]) => {
      await axios.delete(
        "http://161.53.174.14/wp-json/wp/v2/media/" + userData?.document_id,
        {
          params: {
            force: true,
          },
        }
      );

      const response = await axios.post(
        "http://161.53.174.14/zaposlenici/api/generate-document",
        userData
      );

      return response.data;
    },
    {
      onSuccess: () => {
        message.success("Dokument je uspješno regeneriran.");
        return queryClient.invalidateQueries(authKeys.auth);
      },
      onError: () => {
        message.error("Došlo je do greške kod regeneriranja dokumenta.");
      },
    }
  );
};

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      body,
      type,
      name,
    }: {
      body: Blob;
      type: string;
      name: string;
    }) => {
      const response = await axios.post(
        "http://161.53.174.14/wp-json/wp/v2/media",
        body,
        {
          headers: {
            "Content-Type": type,
            Accept: "application/json",
            "Content-Disposition":
              'attachment; filename="' + croToEngString(name) + '"',
          },
        }
      );
      await axios.post("http://161.53.174.14/wp-json/wp/v2/users/me", {
        image_url: response.data.source_url,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        message.success("Slika je uspješno prenesena.");
        return queryClient.invalidateQueries(authKeys.auth);
      },
      onError: () => {
        message.error("Greška kod prijenosa slike.");
      },
    }
  );
};

export const useUpdateProfileData = () => {
  const queryClient = useQueryClient();

  return useMutation<User, AxiosError<WPUpdateProfileErrorData>, User["data"]>(
    async (data) => {
      const response = await axios.post(
        "http://161.53.174.14/wp-json/wp/v2/users/me",
        {
          data,
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        message.success("Uspješno spremljene promjene.");
        return queryClient.invalidateQueries(authKeys.auth);
      },
      onError: () => {
        message.error("Greška kod spremanja promjena.");
      },
    }
  );
};
