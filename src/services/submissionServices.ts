"use client";
import {
  KprApplicationPayload,
  KprApplicationResponse,
  KprSubmissionPayload,
} from "@/types/submission";
import { axiosInstance } from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";

async function addKprDetail(
  payload: KprApplicationPayload
): Promise<KprApplicationResponse> {
  try {
    const res = await axiosInstance.post<KprApplicationResponse>(
      "/kpr/add-detail-submission",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    throw err;
  }
}

export function useAddKprDetail() {
  return useMutation<KprApplicationResponse, Error, KprApplicationPayload>({
    mutationFn: addKprDetail,
  });
}

function buildKprFormData(payload: KprSubmissionPayload): FormData {
  const fd = new FormData();
  fd.append("submission", JSON.stringify(payload.submission));
  fd.append("id_card", payload.id_card);
  fd.append("tax_id", payload.tax_id);
  fd.append("employment_certificate", payload.employment_certificate);
  fd.append("salary_slip", payload.salary_slip);
  if (payload.spouse_id_card)
    fd.append("spouse_id_card", payload.spouse_id_card);
  if (payload.marriage_certificate)
    fd.append("marriage_certificate", payload.marriage_certificate);
  return fd;
}

export function useSubmitKpr() {
  return useMutation({
    mutationFn: async (payload: KprSubmissionPayload) => {
      const formData = buildKprFormData(payload);
      try {
        const res = await axiosInstance.post("/kpr/add-submission", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return res.data;
      } catch (err) {
        throw err as Error;
      }
    },
  });
}
