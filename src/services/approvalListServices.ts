import {
  KprDashboardParams,
  KprDashboardResponse,
  SubmissionDetailResponse,
  UpdateSubmissionStatusPayload,
  UpdateSubmissionStatusResponse,
} from "@/types/approval-list";
import { axiosInstance } from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const fetchApprovalList = async (
  params: KprDashboardParams
): Promise<KprDashboardResponse> => {
  const { status, pageNumber, pageSize, search } = params;
  const { data } = await axiosInstance.get<KprDashboardResponse>(
    "/kpr/submission",
    {
      params: {
        status,
        pageNumber,
        pageSize,
        search,
      },
    }
  );
  return data;
};

export const useApprovalList = (params: KprDashboardParams) => {
  return useQuery<KprDashboardResponse>({
    queryKey: ["approval-list", params],
    queryFn: () => fetchApprovalList(params),
  });
};

export const fetchSubmissionDetail = async (
  submissionId: string
): Promise<SubmissionDetailResponse> => {
  const { data } = await axiosInstance.get<SubmissionDetailResponse>(
    `/kpr/submission/${submissionId}`
  );
  return data;
};

export const useSubmissionDetail = (submissionId: string) => {
  return useQuery<SubmissionDetailResponse>({
    queryKey: ["submissionDetail", submissionId],
    queryFn: () => fetchSubmissionDetail(submissionId),
    enabled: !!submissionId,
  });
};

export const updateSubmissionStatus = async (
  id: string | number,
  payload: UpdateSubmissionStatusPayload
): Promise<UpdateSubmissionStatusResponse> => {
  const { data } = await axiosInstance.patch<UpdateSubmissionStatusResponse>(
    `/kpr/submission/${id}/status`,
    payload
  );
  return data;
};

export const useUpdateSubmissionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | number;
      payload: UpdateSubmissionStatusPayload;
    }) => updateSubmissionStatus(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["submissionDetail", String(id)],
      });
      queryClient.invalidateQueries({ queryKey: ["approval-list"] });
    },
  });
};
