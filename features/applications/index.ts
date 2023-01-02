import axios from "axios";
import formatApplication from "./format";
import applicationKeys from "./queries";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Application, ApplicationResponse, ApplicationsFilters } from "./types";

import type { UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useApplications = (
  filters: ApplicationsFilters,
  options?: UseQueryOptions<
    ApplicationResponse[],
    AxiosError,
    Application[],
    string[] | {}[]
  >
) => {
  const queryClient = useQueryClient();

  const applicationsPerPage = 10;
  const totalItems = useRef(0);
  const totalPages = useRef(0);

  const fetchApplications = async (
    newFilters: ApplicationsFilters
  ): Promise<ApplicationResponse[]> => {
    const userId = window.localStorage.getItem("user_id");

    const response = await axios.get(
      "http://161.53.174.14/wp-json/wp/v2/applications",
      {
        params: {
          orderby: newFilters?.orderby,
          order: newFilters?.order,
          search: newFilters?.search,
          jobs: newFilters?.jobs,
          per_page: applicationsPerPage,
          page: newFilters?.page,
          company: userId,
        },
      }
    );
    totalItems.current = +(response.headers?.["x-wp-total"] || "");
    totalPages.current = +(response.headers?.["x-wp-totalpages"] || "");
    return response.data;
  };

  const queryData = useQuery(
    applicationKeys.applicationsFiltered(filters),
    async () => fetchApplications(filters),
    {
      select: (applications) =>
        applications.map((application) => formatApplication(application)),
      keepPreviousData: true,
      staleTime: 5000,
      ...options,
    }
  );

  useEffect(() => {
    if (filters.page)
      if (!queryData.isPreviousData && filters?.page < totalPages.current)
        queryClient.prefetchQuery(
          applicationKeys.applicationsFiltered({
            ...filters,
            page: filters?.page + 1,
          }),
          () =>
            fetchApplications({ ...filters, page: (filters?.page || 0) + 1 })
        );
  }, [queryData.data, queryData.isPreviousData, filters, queryClient]);

  return {
    ...queryData,
    itemsPerPage: applicationsPerPage,
    totalNumberOfItems: totalItems.current,
    totalNumberOfPages: totalPages.current,
  };
};

export const useApplication = (
  id: number,
  options?: UseQueryOptions<{}, AxiosError, Application, (string | number)[]>
) => {
  return useQuery(
    applicationKeys.application(id),
    async () => {
      const response = await axios.get(
        "http://161.53.174.14/wp-json/wp/v2/applications/" + id
      );
      return formatApplication(response.data);
    },
    {
      ...options,
    }
  );
};

// export const useUpdateJob = () => {
//   const queryClient = useQueryClient();

//   return useMutation(
//     async (job) => {
//       const response = await axios.post(
//         "http://161.53.174.14/wp-json/wp/v2/jobs/" + job?.id,
//         {
//           title: job?.job_title,
//           meta: job,
//         }
//       );
//       return formatJob(response.data);
//     },
//     {
//       onSuccess: () => {
//         return queryClient.invalidateQueries(jobKeys.jobs);
//       },
//     }
//   );
// };

// export const useDeleteJob = () => {
//   const queryClient = useQueryClient();

//   return useMutation(
//     async (id: number) => {
//       const response = await axios.delete(
//         "http://161.53.174.14/wp-json/wp/v2/jobs/" + id,
//         {
//           params: {
//             force: true,
//           },
//         }
//       );
//       return formatJob(response.data);
//     },
//     {
//       onSuccess: () => {
//         return queryClient.invalidateQueries(jobKeys.jobs);
//       },
//     }
//   );
// };
