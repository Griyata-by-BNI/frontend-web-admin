"use client";

import { Modal, Typography, Descriptions } from "antd";
import type { ApprovalItem } from "../_types";

interface DetailModalProps {
  open: boolean;
  onCancel: () => void;
  record: ApprovalItem | null;
}

export default function DetailModal({
  open,
  onCancel,
  record,
}: DetailModalProps) {
  return (
    <Modal
      title={
        <Typography.Title level={5} className="!text-dark-tosca">
          Detail Pengajuan Kredit
        </Typography.Title>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      {record && (
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Nama Nasabah">
            {record.customer_name}
          </Descriptions.Item>
          <Descriptions.Item label="NIK">{record.customer_nik}</Descriptions.Item>
          <Descriptions.Item label="Nomor HP">
            {record.customer_phone}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {record.customer_email}
          </Descriptions.Item>
          <Descriptions.Item label="Nama Properti">
            {record.property_name}
          </Descriptions.Item>
          <Descriptions.Item label="Alamat Properti">
            {record.property_address}
          </Descriptions.Item>
          <Descriptions.Item label="Jumlah Kredit">
            Rp {record.credit_amount.toLocaleString("id-ID")}
          </Descriptions.Item>
          <Descriptions.Item label="Tenor">
            {record.tenor_months} bulan
          </Descriptions.Item>
          <Descriptions.Item label="Suku Bunga">
            {record.interest_rate}%
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}