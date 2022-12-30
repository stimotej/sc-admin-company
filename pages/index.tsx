import { Button, Empty, Spin, Result } from "antd";
import React from "react";
import Layout from "../components/Layout";
import {
  useAuth,
  useGenerateDocument,
  useRegenerateDocument,
} from "../features/auth";

export default function HomePage() {
  const { data: user, isLoading, isError, refetch, isRefetching } = useAuth();

  const { mutate: generateDocument, isLoading: isGenerating } =
    useGenerateDocument();
  const { mutate: regenerateDocument, isLoading: isRegenerating } =
    useRegenerateDocument();

  const handleGenerateDocument = () => {
    if (!user?.data) return;
    generateDocument(user.data);
  };

  const handleRegenerateDocument = () => {
    if (!user?.data) return;
    regenerateDocument(user.data);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Dokument za prijavu poslodavca</h1>
        {user?.data.document_url ? (
          <div>
            <Button onClick={handleRegenerateDocument} loading={isRegenerating}>
              Regeneriraj
            </Button>
          </div>
        ) : null}
      </div>
      {isLoading ? (
        <Spin tip="Učitavanje" size="large" className="mt-4">
          <div className="content" />
        </Spin>
      ) : isError ? (
        <Result
          status="error"
          title="Greška kod učitavanja dokumenta."
          extra={
            <Button
              type="primary"
              onClick={() => refetch()}
              loading={isRefetching}
            >
              Pokušaj ponovno
            </Button>
          }
        />
      ) : user.data.document_url ? (
        <iframe
          src={user.data.document_url}
          className="h-[500px] w-full mt-4 rounded-lg border-none"
        />
      ) : (
        <Empty description={<span>Nema dokumenta za prikaz</span>}>
          <Button
            type="primary"
            loading={isGenerating}
            onClick={handleGenerateDocument}
          >
            Generiraj
          </Button>
        </Empty>
      )}
    </Layout>
  );
}
