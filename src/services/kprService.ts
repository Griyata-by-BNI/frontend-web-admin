import axios from "axios";
import {
  SubmissionSummary,
  SubmissionDetail,
  TrackingData,
  UpdateStatusRequest,
} from "@/types/riwayat";

const apiClient = axios.create({
  baseURL: "/api/v1",
});

const getAuthToken = (): string | null => {
  if (typeof document !== 'undefined') {
    return document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1] || null;
  }
  return null;
};

export const getAllSubmissions = async (): Promise<SubmissionSummary[]> => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");

    const response = await apiClient.get<{
      status: { code: number; message: string };
      data: SubmissionSummary[];
    }>("/kpr/submissions", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    return [];
  }
};

export const getTrackingData = async (submissionId: number): Promise<TrackingData | null> => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");
    
    const response = await apiClient.post<{
      status: { code: number; message: string };
      data: TrackingData;
    }>("/add-submission", 
      { submission_id: submissionId },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch tracking data for submission ${submissionId}:`, error);
    return null;
  }
};

export const updateSubmissionStatus = async (
  id: number,
  statusData: UpdateStatusRequest
): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");
    
    await apiClient.patch(`/kpr/submission/${id}/status`, statusData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return true;
  } catch (error) {
    console.error(`Failed to update submission ${id} status:`, error);
    return false;
  }
};

export const getSubmissionById = async (id: number): Promise<SubmissionDetail | null> => {
  try {
    const submissions = await getAllSubmissions();
    const submission = submissions.find(s => s.id === id);
    if (!submission) return null;

    const trackingData = await getTrackingData(id);
    if (!trackingData) return null;

    return {
      submission: {
        id: submission.id,
        status: submission.status,
        submitted_at: submission.submitted_at,
        verified_at: submission.status === "verified" || submission.status === "completed" ? new Date().toISOString() : "",
        verification_notes: ""
      },
      property_information: {
        property_name: submission.property_name,
        developer_group: submission.developer_group,
        image_url: submission.image_url
      },
      ...trackingData
    };
  } catch (error) {
    console.error(`Failed to fetch submission with id ${id}:`, error);
    return null;
  }
};