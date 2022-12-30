import React, { useState } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import dayjs from "dayjs";
import useDebounce from "../../utils/useDebounce";

import {
  CheckCircleOutlined,
  CloseCircleFilled,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  StarOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Table,
  Input,
  Button,
  message,
  Popconfirm,
  Empty,
  Tooltip,
} from "antd";
import { useDeleteJob, useJobs } from "../../features/jobs";
import { Job } from "../../features/jobs/types";

import type { ColumnsType } from "antd/es/table";
import type { SorterResult, TableRowSelection } from "antd/es/table/interface";

const columns: ColumnsType<Job> = [
  {
    title: "Naziv",
    dataIndex: "title",
    sorter: true,
    render: (title, job) => (
      <div className="flex items-center gap-2">
        {job.featured ? (
          <Tooltip title="Posao je istaknut">
            <StarOutlined className="text-yellow-500" />
          </Tooltip>
        ) : null}
        <div>{title}</div>
      </div>
    ),
  },
  {
    title: "Objavljen",
    dataIndex: "date",
    defaultSortOrder: "descend",
    render: (createdAt) => dayjs(createdAt).format("DD.MM.YYYY"),
    sorter: true,
  },
  {
    title: "Aktivan do",
    dataIndex: "activeUntil",
    render: (activeUntil) => dayjs(activeUntil).format("DD.MM.YYYY"),
  },
  {
    title: "Status",
    dataIndex: "allowedSc",
    render: (allowedSc) =>
      allowedSc ? (
        <div className="text-green-600 flex items-center gap-2">
          <CheckCircleOutlined />
          <div>Aktivan</div>
        </div>
      ) : (
        <div className="text-orange-500 flex items-center gap-2">
          <WarningOutlined />
          <div>Čeka povrdu Studentskog centra</div>
        </div>
      ),
  },
];

const JobsPage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date|desc");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);
  const {
    data: jobs,
    isLoading,
    isError,
    totalNumberOfPages,
    itemsPerPage,
  } = useJobs({
    orderby: sort?.split("|")?.[0],
    order: sort?.split("|")?.[1],
    search: debouncedSearch,
    page,
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection: TableRowSelection<Job> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleChangeTable = (
    _pagination: any,
    _filters: any,
    sorter: SorterResult<Job> | SorterResult<Job>[]
  ) => {
    if ("field" in sorter && "order" in sorter)
      setSort(
        `${sorter?.field}|${sorter?.order === "descend" ? "desc" : "asc"}`
      );
  };

  const { mutateAsync: deleteJob } = useDeleteJob();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteJobs = () => {
    const deleteRequests = selectedRowKeys.map((jobId) => deleteJob(+jobId));

    setIsDeleting(true);
    Promise.all(deleteRequests)
      .then((res) => {
        messageApi.open({
          type: "success",
          content: "Poslovi su uspješno obrisani.",
        });
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: "Greška kod brisanja poslova.",
        });
      })
      .finally(() => {
        setIsDeleting(false);
        setSelectedRowKeys([]);
        setConfirmOpen(false);
      });
  };

  return (
    <Layout>
      {contextHolder}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <Input.Search
          placeholder="Pretraži poslove"
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/4 min-w-[250px]"
          allowClear
        />
        {selectedRowKeys.length > 0 ? (
          <div className="flex gap-2">
            <Popconfirm
              title="Jeste li sigurni da želite obrisati odabrane poslove?"
              open={confirmOpen}
              onConfirm={handleDeleteJobs}
              okButtonProps={{
                loading: isDeleting,
                danger: true,
              }}
              okText="Obriši"
              cancelText="Odustani"
              onCancel={() => setConfirmOpen(false)}
            >
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => setConfirmOpen(true)}
              >
                Obriši
              </Button>
            </Popconfirm>
            {selectedRowKeys.length === 1 ? (
              <Link
                href={{
                  pathname: "/poslovi/uredi",
                  query: { id: selectedRowKeys[0] },
                }}
              >
                <Button icon={<EditOutlined />}>Uredi</Button>
              </Link>
            ) : null}
          </div>
        ) : (
          <Link href="/poslovi/uredi">
            <Button icon={<PlusOutlined />}>Dodaj posao</Button>
          </Link>
        )}
      </div>
      <Table
        dataSource={jobs?.map((item) => ({ ...item, key: item.id }))}
        columns={columns}
        loading={isLoading}
        onChange={handleChangeTable}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span>Nema poslova za prikaz</span>}
            />
          ),
        }}
        pagination={{
          current: page,
          onChange: (newPage) => setPage(newPage),
          total: totalNumberOfPages,
          pageSize: itemsPerPage,
        }}
        rowSelection={rowSelection}
        footer={() =>
          isError && (
            <div className="text-red-600 flex items-center gap-2">
              <CloseCircleFilled />
              Greška kod učitavanja poslova
            </div>
          )
        }
      />
    </Layout>
  );
};

export default JobsPage;
