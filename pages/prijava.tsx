import { Button, Form, Input, message } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useLogin } from "../features/auth";

const LoginPage = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { login, isLoading } = useLogin();

  const handleLogIn = (data: any) => {
    login(data, {
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Pogrešno korisničko ime ili lozinka.",
        });
      },
      onSuccess: () => {
        router.push("/");
      },
    });
  };

  return (
    <div className="mx-auto container w-auto md:w-2/3 lg:w-1/2">
      {contextHolder}

      <div className="flex flex-col gap-2 items-center mt-10">
        <h3 className="uppercase text-sm font-normal mb-0">
          Studentski centar
        </h3>
        <h1 className="font-bold text-4xl mt-0 leading-6">Poslodavci</h1>
      </div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={handleLogIn}
        autoComplete="off"
        className="mt-10 bg-gray-100 p-4 rounded-lg"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Unesi korisničko ime!" }]}
          wrapperCol={{}}
        >
          <Input size="large" placeholder="Korisničko ime" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Unesi lozinku!" }]}
          wrapperCol={{}}
        >
          <Input.Password size="large" placeholder="Lozinka" />
        </Form.Item>

        <Form.Item wrapperCol={{}} className="my-0 flex justify-center">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoading}
          >
            Prijavi se
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
