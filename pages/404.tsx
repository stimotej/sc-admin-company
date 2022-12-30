import { Button, Result } from "antd";
import Link from "next/link";
import React from "react";

const PageNotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Stranica koju ste posjetili ne postoji."
      extra={
        <Link href="/">
          <Button type="primary">Idi na početnu</Button>
        </Link>
      }
    />
  );
};

export default PageNotFound;
