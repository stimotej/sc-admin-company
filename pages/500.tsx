import { Button, Result } from "antd";
import Link from "next/link";
import React from "react";

const ServerErrorPage = () => {
  return (
    <Result
      status="500"
      title="500"
      subTitle="Došlo je do greške."
      extra={
        <Link href="/">
          <Button type="primary">Idi na početnu</Button>
        </Link>
      }
    />
  );
};

export default ServerErrorPage;
