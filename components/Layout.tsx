import React from "react";
import type { MenuProps } from "antd";
import { Menu, Layout, Avatar, Dropdown } from "antd";
import {
  HomeOutlined,
  ContainerOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { logout, useAuth } from "../features/auth";
import Link from "next/link";
import { isSidebarCollapsed } from "../utils/globalState";
import { useAtom } from "jotai";

const items: MenuProps["items"] = [
  {
    key: "/",
    icon: <HomeOutlined />,
    label: "Početna",
  },
  {
    key: "/poslovi",
    icon: <ContainerOutlined />,
    label: "Poslovi",
  },
  {
    key: "/prijave",
    icon: <TeamOutlined />,
    label: "Prijave",
  },
];

const { Header, Sider, Content } = Layout;

interface LayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useAtom(isSidebarCollapsed);
  const { data: user } = useAuth();

  const onClick: MenuProps["onClick"] = (e) => {
    router.push(e.key);
  };

  const handleLogout = () => {
    logout();
    router.push("/prijava");
  };

  const profileItems: MenuProps["items"] = [
    {
      key: "1",
      label: <Link href="/profil">Profil</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "2",
      danger: true,
      label: "Odjavi se",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout hasSider>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        trigger={null}
        className="h-screen !fixed left-0 top-0 bottom-0"
        // className="hidden md:block"
      >
        <Menu
          onClick={onClick}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["0"]}
          mode="inline"
          className=" h-screen"
          items={items}
          selectedKeys={[router.pathname]}
        />
      </Sider>
      <Layout>
        <Header
          className={`flex justify-between !bg-white ${
            collapsed ? "!pl-[104px]" : "!pl-[224px]"
          }`}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <Dropdown menu={{ items: profileItems }}>
            <Link href="/profil">
              <div className="flex items-center justify-center gap-2 text-black">
                <Avatar
                  size={32}
                  src={user?.image_url}
                  icon={<UserOutlined />}
                />
                {user?.data.short_name || user?.name}
              </div>
            </Link>
          </Dropdown>
        </Header>
        <Content
          className={`p-6 bg-gray-100 ${
            collapsed ? "pl-[104px]" : "pl-[224px]"
          }`}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default RootLayout;
