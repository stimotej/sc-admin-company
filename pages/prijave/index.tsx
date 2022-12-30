import React, { useState } from "react";
import Layout from "../../components/Layout";
import dayjs from "dayjs";
import useDebounce from "../../utils/useDebounce";

import { CloseCircleFilled } from "@ant-design/icons";
import { Table, Input, Empty } from "antd";
import { useApplications } from "../../features/applications";

import type { Application } from "../../features/applications/types";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection, SorterResult } from "antd/es/table/interface";
import { useJobs } from "../../features/jobs";

const ApplicationsPage = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date|desc");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);
  const {
    data: applications,
    isLoading,
    isError,
    totalNumberOfPages,
    itemsPerPage,
  } = useApplications({
    orderby: sort?.split("|")?.[0],
    order: sort?.split("|")?.[1],
    search: debouncedSearch,
    page,
  });

  const [searchJobs, setSearchJobs] = useState("");

  const debouncedSearchJobs = useDebounce(searchJobs, 300);
  const { data: jobs } = useJobs({
    search: debouncedSearchJobs,
  });

  const columns: ColumnsType<Application> = [
    {
      title: "Posao",
      dataIndex: "job",
      render: (job) => job?.title,
      filters: jobs?.map((job) => ({ text: job.title, value: job.id })),
    },
    {
      title: "Student",
      dataIndex: "student",
      render: (student) => student?.name,
    },
    {
      title: "Datum",
      dataIndex: "date",
      defaultSortOrder: "descend",
      render: (createdAt) => dayjs(createdAt).format("DD.MM.YYYY"),
      sorter: true,
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection: TableRowSelection<Application> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleChangeTable = (
    _pagination: any,
    _filters: any,
    sorter: SorterResult<Application> | SorterResult<Application>[]
  ) => {
    console.log("_filters", _filters);

    if ("field" in sorter && "order" in sorter)
      setSort(`${sorter.field}|${sorter.order === "descend" ? "desc" : "asc"}`);
  };
  return (
    <Layout>
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <Input.Search
          placeholder="Pretraži prijave"
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/4 min-w-[250px]"
          allowClear
        />
      </div>
      <Table
        dataSource={applications?.map((item) => ({ ...item, key: item.id }))}
        columns={columns}
        loading={isLoading}
        onChange={handleChangeTable}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span>Nema prijava za prikaz</span>}
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
              Greška kod učitavanja prijava
            </div>
          )
        }
      />
    </Layout>
  );
};

export default ApplicationsPage;
