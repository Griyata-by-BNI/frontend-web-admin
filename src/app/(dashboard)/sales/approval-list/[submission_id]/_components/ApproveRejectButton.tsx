"use client";

import { Button, Modal, Form, Input, App, Checkbox, Divider } from "antd";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useUpdateSubmissionStatus } from "@/services/approvalListServices";

const APPROVAL_TEXT =
  "Saya telah memverifikasi SELURUH data dan dokumen pengajuan: identitas nasabah sesuai, informasi pekerjaan terverifikasi, kontak darurat dapat dihubungi, informasi properti sesuai, dokumen jelas & lengkap, serta nilai pinjaman dan tenor sesuai.";

export default function ApproveRejectButton() {
  const { message } = App.useApp();
  const params = useParams<{ submission_id: string }>();
  const submissionId = params?.submission_id ?? "";
  const { mutate, isPending } = useUpdateSubmissionStatus();

  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [formApprove] = Form.useForm();
  const [formReject] = Form.useForm();

  const approveChecked = Form.useWatch("confirm_all", formApprove) as
    | boolean
    | undefined;
  const rejectChecked = Form.useWatch("confirm_all", formReject) as
    | boolean
    | undefined;
  const rejectNotes = Form.useWatch("verification_notes", formReject) as
    | string
    | undefined;

  const approveOkDisabled = !submissionId || !approveChecked;
  const rejectOkDisabled =
    !submissionId ||
    !rejectChecked ||
    !rejectNotes ||
    rejectNotes.trim() === "";

  const requiredCheckRule = [
    {
      validator: (_: unknown, v?: boolean) =>
        v
          ? Promise.resolve()
          : Promise.reject(new Error("Mohon centang pernyataan verifikasi")),
    },
  ];

  const doApprove = async () => {
    try {
      const { verification_notes } = await formApprove.validateFields();
      mutate(
        {
          id: submissionId,
          payload: { status: "verified", verification_notes },
        },
        {
          onSuccess: () => {
            message.success("Pengajuan disetujui");
            setOpenApprove(false);
            formApprove.resetFields();
          },
          onError: () => message.error("Gagal menyetujui pengajuan"),
        }
      );
    } catch {}
  };

  const doReject = async () => {
    try {
      const { verification_notes } = await formReject.validateFields();
      mutate(
        {
          id: submissionId,
          payload: { status: "rejected", verification_notes },
        },
        {
          onSuccess: () => {
            message.success("Pengajuan ditolak");
            setOpenReject(false);
            formReject.resetFields();
          },
          onError: () => message.error("Gagal menolak pengajuan"),
        }
      );
    } catch {}
  };

  return (
    <>
      <div className="w-full flex justify-end gap-4">
        <Button
          size="large"
          onClick={() => setOpenReject(true)}
          danger
          type="primary"
          disabled={!submissionId}
          loading={isPending}
        >
          Tolak
        </Button>
        <Button
          size="large"
          onClick={() => setOpenApprove(true)}
          type="primary"
          disabled={!submissionId}
          loading={isPending}
        >
          Setujui
        </Button>
      </div>

      <Modal
        title="Setujui Pengajuan"
        open={openApprove}
        onCancel={() => setOpenApprove(false)}
        onOk={doApprove}
        okText="Setujui"
        confirmLoading={isPending}
        okButtonProps={{ disabled: approveOkDisabled }}
      >
        <Divider className="!border-gray-300 !my-4" />

        <p className="mb-2 text-red-500">
          Pastikan Anda sudah memverifikasi seluruh data pengajuan KPR sebelum
          menyetujui!
        </p>

        <p className="mb-2 text-gray-500">
          * Data pengajuan KPR tidak dapat diubah setelah disetujui.
        </p>

        <Divider className="!border-gray-300 !my-4" />

        <Form form={formApprove} layout="vertical">
          <Form.Item
            name="confirm_all"
            valuePropName="checked"
            rules={requiredCheckRule}
          >
            <Checkbox>{APPROVAL_TEXT}</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Tolak Pengajuan"
        open={openReject}
        onCancel={() => setOpenReject(false)}
        onOk={doReject}
        okText="Tolak"
        okButtonProps={{ danger: true, disabled: rejectOkDisabled }}
        confirmLoading={isPending}
      >
        <Divider className="!border-gray-300 !my-4" />

        <p className="mb-2 text-red-500">
          Pastikan Anda sudah memverifikasi seluruh data pengajuan KPR sebelum
          menolak pengajuan!
        </p>

        <p className="mb-2 text-gray-500">
          * Data pengajuan KPR tidak dapat diubah setelah ditolak.
        </p>

        <Divider className="!border-gray-300 !my-4" />

        <Form form={formReject} layout="vertical">
          <Form.Item
            name="confirm_all"
            valuePropName="checked"
            rules={requiredCheckRule}
          >
            <Checkbox>{APPROVAL_TEXT}</Checkbox>
          </Form.Item>
          <Form.Item
            name="verification_notes"
            label="Alasan Penolakan"
            rules={[{ required: true, message: "Mohon isi alasan penolakan" }]}
          >
            <Input.TextArea
              placeholder="Contoh: Dokumen KTP tidak jelas"
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
