"use client";

import { Form, Input, Modal, Typography, Upload, message } from "antd";
import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { Developer } from "@/types/developer";
import { useUpdateDeveloper } from "@/services/developerServices";

interface EditDeveloperModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  editingRecord: Developer | null;
}

export default function EditDeveloperModal({
  open,
  onCancel,
  onSubmit,
  editingRecord,
}: EditDeveloperModalProps) {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string>("");
  const updateMutation = useUpdateDeveloper();

  useEffect(() => {
    if (editingRecord && open) {
      form.setFieldsValue({
        name: editingRecord.name,
        description: editingRecord.description
      });
      setPreviewImage(editingRecord.developerPhotoUrl || "");
    }
  }, [editingRecord, form, open]);

  const handleSubmit = async (values: any) => {
    if (!editingRecord) return;
    try {
      const payload: Developer = {
        ...editingRecord,
        name: values.name,
        description: values.description,
        updatedBy: 1,
        developerPhotoUrl: values.image || editingRecord.developerPhotoUrl
      };
      await updateMutation.mutateAsync(payload);
      message.success('Developer berhasil diperbarui');
      onSubmit();
      form.resetFields();
      setPreviewImage("");
    } catch (error) {
      message.error('Gagal memperbarui developer');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setPreviewImage("");
    onCancel();
  };

  return (
    <Modal
      centered
      title={
        <Typography.Title level={5} className="!text-dark-tosca">
          Edit Data Developer
        </Typography.Title>
      }
      maskClosable={false}
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Perbarui"
      classNames={{
        body: "!pt-2 max-h-[75vh] overflow-y-auto !px-6",
        content: "!p-0",
        header: "!pt-5 !px-6",
        footer: "!pb-5 !px-6",
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Nama"
          className="!mb-3"
          rules={[{ required: true, message: "Mohon masukkan nama!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="image"
          label="Gambar"
          className="!mb-3"
        >
          <Upload.Dragger
            maxCount={1}
            beforeUpload={() => false}
            onChange={(info) => {
              if (info.fileList.length > 0) {
                const file = info.fileList[0].originFileObj;
                if (file) {
                  form.setFieldValue("image", file);
                  const reader = new FileReader();
                  reader.onload = () => {
                    setPreviewImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              } else {
                form.setFieldValue("image", null);
                setPreviewImage(editingRecord?.developerPhotoUrl || "");
              }
            }}
          >
            {previewImage ? (
              <div className="flex flex-col items-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-72 aspect-video object-contain rounded mb-2"
                />
                <p className="text-gray-500">
                  Klik atau seret file untuk mengganti gambar
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-center w-full">
                  <UploadCloud className="w-10 h-10 stroke-primary-tosca" />
                </div>
                <p className="text-gray-700 text-md mt-2">
                  Klik atau seret file untuk upload gambar
                </p>
                <p className="ant-upload-hint">Mendukung upload satu gambar.</p>
              </>
            )}
          </Upload.Dragger>
        </Form.Item>



        <Form.Item
          name="description"
          label="Deskripsi"
          className="!mb-3"
          rules={[{ required: true, message: "Mohon masukkan deskripsi!" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
