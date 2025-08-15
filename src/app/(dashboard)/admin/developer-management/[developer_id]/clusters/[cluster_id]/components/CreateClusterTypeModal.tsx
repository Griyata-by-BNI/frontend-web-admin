import { Modal, Form, Input } from "antd";

interface CreateClusterTypeModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: { name: string }) => void;
}

export default function CreateClusterTypeModal({
  open,
  onCancel,
  onSubmit,
}: CreateClusterTypeModalProps) {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Buat Cluster Type"
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