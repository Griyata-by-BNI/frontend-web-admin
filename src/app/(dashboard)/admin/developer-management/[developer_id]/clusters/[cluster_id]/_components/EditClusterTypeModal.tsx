import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import type { ClusterType } from "../../../../_types";

interface EditClusterTypeModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: { name: string }) => void;
  editingRecord: ClusterType | null;
}

export default function EditClusterTypeModal({
  open,
  onCancel,
  onSubmit,
  editingRecord,
}: EditClusterTypeModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue({ name: editingRecord.name });
    }
  }, [editingRecord, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  return (
    <Modal
      title="Edit Cluster Type"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Simpan"
      cancelText="Batal"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Nama Cluster Type"
          rules={[{ required: true, message: "Nama cluster type wajib diisi" }]}
        >
          <Input placeholder="Masukkan nama cluster type" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
