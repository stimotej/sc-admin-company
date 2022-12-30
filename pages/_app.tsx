import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import axios from "axios";

const queryClient = new QueryClient();

const myTheme = {
  token: {
    colorPrimary: "#1677ff",
  },
};

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const token = window.localStorage.getItem("access_token");
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={myTheme}>
        <Component {...pageProps} />
      </ConfigProvider>
    </QueryClientProvider>
  );
}
