import { useUpdateClusterType } from "@/services/clusterTypeServices";
import { ClusterType } from "@/types/clusterType";
import { Modal, Form, Input, Tooltip, Button, App } from "antd";
import { Edit } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface EditClusterTypeModalProps {
  editingRecord: ClusterType;
}

export default function EditClusterTypeModal({
  editingRecord,
}: EditClusterTypeModalProps) {
  const { cluster_id } = useParams();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue({ name: editingRecord.name });
    }
  }, [editingRecord, form, modalOpen]);

  const handleCancel = () => {
    setModalOpen(false);
    form.resetFields();
  };

  const { mutate, status } = useUpdateClusterType();

  const handleSubmit = (values: any) => {
    mutate(
      {
        clusterTypeId: String(editingRecord.id),
        payload: {
          name: values.name,
          clusterId: parseInt(cluster_id as string),
          description: "",
        },
      },
      {
        onSuccess: () => {
          message.success("Cluster type berhasil diperbarui");
          setModalOpen(false);
          form.resetFields();
        },
        onError: (err) => {
          console.error(err);
          message.error("Gagal memperbarui cluster type. Silakan coba lagi.");
        },
      }
    );
  };

  return (
    <>
      <Tooltip title="Edit Data">
        <Button
          icon={<Edit className="w-4 h-4" />}
          onClick={() => {
            setModalOpen(true);
          }}
        />
      </Tooltip>

      <Modal
        forceRender
        destroyOnHidden
        okButtonProps={{ loading: status === "pending" }}
        title="Edit Cluster Type"
        open={modalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Simpan"
        cancelText="Batal"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Nama Cluster Type"
            rules={[
              { required: true, message: "Nama cluster type wajib diisi" },
            ]}
          >
            <Input
              maxLength={100}
              showCount
              placeholder="Masukkan nama cluster type"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
