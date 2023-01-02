import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Segmented,
  Tag,
  Spin,
  Result,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import { useCreateJob, useJob, useUpdateJob } from "../../features/jobs";

const EditJobPage = () => {
  const router = useRouter();

  const jobId = router.query?.id;

  const initialValues = {
    job_title: "",
    job_type: "privremeni_posao",
    job_location: "",
    job_range: [],
    job_payment_rate: 4.38,
    job_payment_rate_max: 4.38,
    job_work_hours: 1,
    job_positions: 1,
    job_active_until: "",
    job_description: "",
    job_why_me: "",
    job_required_skills: "",
    job_optional_skills: "",
  };

  const {
    isInitialLoading: isLoadingJob,
    isError: isErrorJob,
    refetch: refetchJob,
    isRefetching: isRefetchingJob,
  } = useJob(+(jobId || ""), {
    enabled: !!jobId,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      form.setFieldsValue({
        job_title: data?.title || "",
        job_type: data?.type || "privremeni_posao",
        job_location: data?.location || "",
        job_range: [dayjs(data?.start), dayjs(data?.end)] || [],
        job_payment_rate: data?.paymentRate || 4.38,
        job_payment_rate_max: data?.paymentRateMax || 4.38,
        job_work_hours: data?.workHours || 1,
        job_positions: data?.positions || 1,
        job_active_until: dayjs(data?.activeUntil) || "",
        job_description: data?.description || "",
        job_why_me: data?.whyMe || "",
        job_required_skills: data?.requiredSkills?.join(", ") || "",
        job_optional_skills: data?.optionalSkills?.join(", ") || "",
      });
    },
  });

  const [form] = Form.useForm();
  const fromHome = Form.useWatch("from_home", form);
  const requiredSkills: string =
    Form.useWatch("job_required_skills", form) || "";
  const optionalSkills: string =
    Form.useWatch("job_optional_skills", form) || "";

  const [paymentType, setPaymentType] = useState<string | number>(
    "Fiksna satnica"
  );

  const { mutate: createJob, isLoading: isCreating } = useCreateJob();
  const { mutate: updateJob, isLoading: isUpdating } = useUpdateJob();

  const handleCreateJob = (data: any) => {
    const jobData = {
      ...data,
      job_start: dayjs(data?.job_range?.[0]).toISOString(),
      job_end: dayjs(data?.job_range?.[1]).toISOString(),
      job_active_until: dayjs(data?.job_active_until).toISOString(),
      job_location: fromHome ? "FROM_HOME" : data.job_location,
    };

    if (jobId) {
      updateJob(
        { job: jobData, id: +jobId },
        {
          onSuccess: () => {
            router.back();
          },
        }
      );
    } else {
      createJob(jobData, {
        onSuccess: () => {
          router.back();
        },
      });
    }
  };

  if (isLoadingJob)
    return (
      <Layout>
        <div className="flex h-32 items-center justify-center">
          <Spin tip="Učitavanje posla..." />
        </div>
      </Layout>
    );

  if (isErrorJob)
    return (
      <Layout>
        <Result
          status="error"
          title="Greška kod učitavanja posla."
          extra={
            <Button
              type="primary"
              onClick={() => refetchJob()}
              loading={isRefetchingJob}
            >
              Pokušaj ponovno
            </Button>
          }
        />
      </Layout>
    );

  return (
    <Layout>
      <h1 className="text-lg font-bold">
        {jobId ? "Izmijeni posao" : "Dodaj posao"}
      </h1>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleCreateJob}
        autoComplete="off"
      >
        <Form.Item
          name="job_title"
          label="Naziv"
          rules={[{ required: true, message: "Unesi naziv" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="job_type" label="Vrsta posla">
          <Radio.Group>
            <Radio.Button value="privremeni_posao">
              Privremeni posao
            </Radio.Button>
            <Radio.Button value="stalni_posao">Stalni posao</Radio.Button>
            <Radio.Button value="praksa">Praksa</Radio.Button>
            <Radio.Button value="projekt">Projekt</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="job_location"
          label="Mjesto"
          rules={[{ required: true, message: "Unesi mjesto" }]}
          required={!fromHome}
        >
          <Input disabled={fromHome} />
        </Form.Item>

        <Form.Item name="from_home" valuePropName="checked">
          <Checkbox>Rad od kuće</Checkbox>
        </Form.Item>

        <Form.Item
          name="job_range"
          label="Početak i kraj rada"
          rules={[
            {
              type: "array" as const,
              required: true,
              message: "Unesi početak i kraj rada",
            },
          ]}
        >
          <DatePicker.RangePicker
            placeholder={["Odaberi datum", "Odaberi datum"]}
          />
        </Form.Item>

        <Segmented
          options={["Fiksna satnica", "Raspon satnice"]}
          value={paymentType}
          onChange={setPaymentType}
          className="my-2"
        />

        <div className="flex gap-4">
          <Form.Item
            name="job_payment_rate"
            label={
              paymentType === "Raspon satnice" ? "Minimalna satnica" : "Satnica"
            }
            rules={[
              {
                required: true,
                message: "Unesi satnicu",
              },
            ]}
            className="flex-1"
          >
            <InputNumber
              min={4.38}
              step={0.01}
              addonAfter="€"
              className="w-full"
            />
          </Form.Item>

          {paymentType === "Raspon satnice" ? (
            <Form.Item
              name="job_payment_rate_max"
              label="Maksimalna satnica"
              rules={[
                {
                  required: true,
                  message: "Unesi maksimalnu satnicu",
                },
              ]}
              className="flex-1"
            >
              <InputNumber
                min={4.38}
                step={0.01}
                addonAfter="€"
                className="w-full"
              />
            </Form.Item>
          ) : null}

          <Form.Item
            name="job_work_hours"
            label="Broj sati"
            rules={[
              {
                required: true,
                message: "Unesi broj sati",
              },
            ]}
            className="flex-1"
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>
        </div>

        <Form.Item
          name="job_positions"
          label="Broj otvorenih pozicija"
          rules={[
            {
              required: true,
              message: "Unesi broj otvorenih pozicija",
            },
          ]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>

        <Form.Item
          name="job_active_until"
          label="Trajanje prijava do"
          rules={[
            {
              required: true,
              message: "Unesi trajanje prijava",
            },
          ]}
        >
          <DatePicker placeholder="Odaberi datum" />
        </Form.Item>

        <Form.Item
          name="job_description"
          label="Opis posla"
          rules={[
            {
              required: true,
              message: "Unesi opis posla",
            },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item name="job_why_me" label="Zašto tražimo tebe">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="job_required_skills"
          label="Obavzena znanja (odvojena zarezom)"
          rules={[
            {
              required: true,
              message: "Unesi obavzena znanja",
            },
          ]}
        >
          <Input placeholder="Dodaj obavezno znanje" className="w-full" />
        </Form.Item>
        <div className="mb-4 flex flex-wrap gap-2">
          {requiredSkills
            .split(",")
            .filter((skill) => !!skill)
            .map((skill, index) => (
              <Tag key={index} className="m-0">
                {skill}
              </Tag>
            ))}
        </div>

        <Form.Item
          name="job_optional_skills"
          label="Poželjne vještine (odvojene zarezom)"
        >
          <Input className="w-full" placeholder="Dodaj poželjnu vještinu" />
        </Form.Item>
        <div className="mb-4 flex flex-wrap gap-2">
          {optionalSkills
            .split(",")
            .filter((skill) => !!skill)
            .map((skill, index) => (
              <Tag key={index} className="m-0">
                {skill}
              </Tag>
            ))}
        </div>

        <Form.Item className="mt-6">
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating || isUpdating}
          >
            {jobId ? "Spremi" : "Izradi"}
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default EditJobPage;
