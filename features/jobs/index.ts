import axios from "axios";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import formatJob from "./format";
import jobKeys from "./queries";
import { useEffect, useRef } from "react";

import type { Job, JobResponse, JobsFilters } from "./types";
import type { AxiosError } from "axios";

export const useJobs = (
  filters: JobsFilters,
  options?: UseQueryOptions<JobResponse[], AxiosError, Job[], string[] | {}[]>
) => {
  const queryClient = useQueryClient();

  const jobsPerPage = 10;
  const totalItems = useRef(0);
  const totalPages = useRef(0);

  const fetchJobs = async (newFilters: JobsFilters) => {
    const userId = window.localStorage.getItem("user_id");

    const response = await axios.get(
      "http://161.53.174.14/wp-json/wp/v2/jobs",
      {
        params: {
          orderby: newFilters?.orderby,
          order: newFilters?.order,
          search: newFilters?.search,
          per_page: jobsPerPage,
          page: newFilters?.page,
          author: userId,
        },
      }
    );
    totalItems.current = +(response.headers?.["x-wp-total"] || "0");
    totalPages.current = +(response.headers?.["x-wp-totalpages"] || "0");
    return response.data;
  };

  const queryData = useQuery(
    jobKeys.jobsFiltered(filters),
    async () => fetchJobs(filters),
    {
      select: (jobs) => jobs.map((job) => formatJob(job)),
      keepPreviousData: true,
      staleTime: 5000,
      ...options,
    }
  );

  useEffect(() => {
    if (filters.page) {
      if (!queryData.isPreviousData && filters?.page < totalPages.current)
        queryClient.prefetchQuery(
          jobKeys.jobsFiltered({ ...filters, page: filters?.page + 1 }),
          () => fetchJobs({ ...filters, page: (filters?.page || 0) + 1 })
        );
    }
  }, [queryData.data, queryData.isPreviousData, filters, queryClient]);

  return {
    ...queryData,
    itemsPerPage: jobsPerPage,
    totalNumberOfItems: totalItems.current,
    totalNumberOfPages: totalPages.current,
  };
};

export const useJob = (
  id: number,
  options?: UseQueryOptions<{}, AxiosError, Job, (string | number)[]>
) => {
  return useQuery(
    jobKeys.job(id),
    async () => {
      const response = await axios.get(
        "http://161.53.174.14/wp-json/wp/v2/jobs/" + id
      );
      return formatJob(response.data);
    },
    options
  );
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (job: JobResponse["meta"]) => {
      const response = await axios.post(
        "http://161.53.174.14/wp-json/wp/v2/jobs",
        {
          title: job.job_title,
          excerpt: job.job_description,
          status: "publish",
          meta: job,
        }
      );
      return formatJob(response.data);
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(jobKeys.jobs);
      },
    }
  );
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, job }: { id: number; job: JobResponse["meta"] }) => {
      const response = await axios.post(
        "http://161.53.174.14/wp-json/wp/v2/jobs/" + id,
        {
          title: job.job_title,
          slug: job.job_title,
          excerpt: job.job_description,
          meta: job,
        }
      );
      return formatJob(response.data);
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(jobKeys.jobs);
      },
    }
  );
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: number) => {
      const response = await axios.delete(
        "http://161.53.174.14/wp-json/wp/v2/jobs/" + id,
        {
          params: {
            force: true,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(jobKeys.jobs);
      },
    }
  );
};
