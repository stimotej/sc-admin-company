import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";

import { Upload, Avatar, Image, Button, Form, Input } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  useAuth,
  useUpdateProfileData,
  useUpdateProfileImage,
} from "../features/auth";
import { User } from "../features/auth/types";
import type { UploadProps } from "antd";

const ProfilePage = () => {
  const { data: user } = useAuth({
    onSuccess: (user) => {
      form.setFieldsValue(user.data);
    },
  });

  const [form] = Form.useForm();

  const token = useRef("");
  const [imageUrl, setImageUrl] = useState<string>();
  const [imagePreview, setImagePreview] = useState(false);

  useEffect(() => {
    token.current = window.localStorage.getItem("access_token") || "";
  }, []);

  const { mutate: createMedia, isLoading: isUploading } =
    useUpdateProfileImage();

  const props: UploadProps = {
    accept: "image/png, image/jpeg",
    showUploadList: false,
    customRequest: ({ file }) => {
      if (typeof file !== "string")
        createMedia(
          { body: file, type: file.type, name: file.name },
          {
            onSuccess: (media) => {
              setImageUrl(media.source_url);
            },
          }
        );
    },
  };

  const { mutate: updateProfileData, isLoading: isUpdating } =
    useUpdateProfileData();

  const handleUpdateProfile = (data: User["data"]) => {
    updateProfileData(data, {
      onError: (error) => {
        if (error?.response?.data.code === "email")
          form.setFields([
            { name: "email", errors: [error.response.data.message] },
          ]);
      },
    });
  };

  return (
    <Layout>
      <h1 className="text-lg font-bold">Profil</h1>
      <div className="flex items-center gap-6">
        <Avatar
          shape="square"
          size={64}
          src={imageUrl || user?.image_url}
          icon={<PlusOutlined size={24} />}
          className="cursor-pointer"
          onClick={() => setImagePreview(true)}
        />
        <div className="flex flex-col items-start gap-2">
          <div>Slika profila</div>
          <Upload {...props}>
            <Button loading={isUploading} icon={<UploadOutlined />}>
              Prenesi sliku
            </Button>
          </Upload>
        </div>
      </div>
      <Image
        alt="Profile image"
        className="hidden"
        src={imageUrl || user?.image_url}
        preview={{
          visible: imagePreview,
          src: imageUrl || user?.image_url,
          onVisibleChange: (value) => {
            setImagePreview(value);
          },
        }}
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={user?.data}
        onFinish={handleUpdateProfile}
        autoComplete="off"
      >
        <h3 className="text-md font-medium">Podatci o firmi</h3>

        <Form.Item
          label="Naziv"
          name="name"
          rules={[{ required: true, message: "Unesi naziv" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Skraćeni naziv"
          name="short_name"
          rules={[{ required: true, message: "Unesi skraćeni naziv" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="OIB"
          name="oib_company"
          rules={[
            { required: true, message: "Unesi OIB" },
            { len: 11, message: "Mora sadržavati 11 znakova" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="IBAN"
          name="iban"
          rules={[
            { required: true, message: "Unesi IBAN" },
            { len: 21, message: "Mora sadržavati 21 znak" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Matični broj"
          name="id_number"
          rules={[{ required: true, message: "Unesi matični broj" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Adresa sjedišta"
          name="address"
          rules={[{ required: true, message: "Unesi adresu sjedišta" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mjesto i poštanski broj"
          name="location"
          rules={[
            {
              required: true,
              message: "Unesi mjesto i poštanski broj",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <h3 className="text-md font-medium">Osobni podatci</h3>

        <Form.Item
          label="Ime"
          name="first_name"
          rules={[{ required: true, message: "Unesi ime" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Prezime"
          name="last_name"
          rules={[{ required: true, message: "Unesi prezime" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="OIB"
          name="oib"
          rules={[
            { required: true, message: "Unesi OIB" },
            { len: 11, message: "Mora sadržavati 11 znakova" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Telefon" name="phone">
          <Input />
        </Form.Item>

        <Form.Item label="Mobitel" name="mobile">
          <Input />
        </Form.Item>

        <Form.Item label="Telefaks" name="telefax">
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Unesi email" },
            { type: "email", message: "Mora biti ispravna email adresa" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item className="mt-6">
          <Button type="primary" htmlType="submit" loading={isUpdating}>
            Spremi
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default ProfilePage;
