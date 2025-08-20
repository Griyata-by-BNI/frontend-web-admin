"use client";

import { useUpdateDeveloper } from "@/services/developerServices";
import { Developer } from "@/types/developer";
import { useQueryClient } from "@tanstack/react-query";
import {
  App,
  Button,
  Form,
  Input,
  Modal,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import { Edit, UploadCloud } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface EditDeveloperModalProps {
  developerData: Developer;
}

export default function EditDeveloperModal({
  developerData,
}: EditDeveloperModalProps) {
  const router = useRouter();
  const [form] = Form.useForm();
  const pathname = usePathname();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const { mutateAsync, status } = useUpdateDeveloper();

  const [previewImage, setPreviewImage] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const isDetailPage = pathname.includes(`${developerData.id}`);

  useEffect(() => {
    if (developerData && modalOpen) {
      form.setFieldsValue({
        name: developerData.name,
        description: developerData.description,
        image: developerData.developerPhotoUrl
          ? [
              {
                uid: "-1",
                name: `${developerData.name}.jpg`,
                status: "done",
                url: developerData.developerPhotoUrl,
              },
            ]
          : [],
      });
      setPreviewImage(developerData.developerPhotoUrl || "");
    }
  }, [developerData, form, modalOpen]);

  const handleSubmit = async (values: any) => {
    try {
      const { updatedAt, createdAt, ...rest } = developerData;
      const payload = {
        ...rest,
        name: values.name,
        description: values.description,
        updatedBy: 1,
        developerPhotoUrl: Array.isArray(values.image)
          ? values.image?.[0]?.originFileObj
          : undefined,
      };
      await mutateAsync(payload);
      message.success("Developer berhasil diperbarui");

      isDetailPage
        ? router.push("/admin/developer-management")
        : queryClient.invalidateQueries({ queryKey: ["developers"] });

      form.resetFields();
      setPreviewImage("");
      setModalOpen(false);
    } catch (error) {
      message.error("Gagal memperbarui developer");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setPreviewImage("");
    setModalOpen(false);
  };

  return (
    <>
      <Modal
        centered
        title={
          <Typography.Title level={5} className="!text-dark-tosca">
            Edit Data Developer
          </Typography.Title>
        }
        maskClosable={false}
        open={modalOpen}
        okButtonProps={{ loading: status === "pending" }}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Simpan Perubahan"
        classNames={{
          body: "!pt-2 max-h-[75vh] overflow-y-auto !px-6",
          content: "!p-0",
          header: "!pt-5 !px-6",
          footer: "!pb-5 !px-6",
        }}
      >
        <Form
          disabled={status === "pending"}
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
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
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: true, message: "Mohon upload gambar!" }]}
          >
            <Upload.Dragger
              maxCount={1}
              beforeUpload={() => false}
              onChange={(info) => {
                const file = info.fileList[0]?.originFileObj;
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () =>
                    setPreviewImage(reader.result as string);
                  reader.readAsDataURL(file);
                } else {
                  setPreviewImage("");
                }
              }}
            >
              {previewImage ? (
                <div className="flex flex-col items-center">
                  <Image
                    key={previewImage}
                    src={previewImage}
                    alt={previewImage}
                    width={288}
                    height={288}
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
                  <p className="ant-upload-hint">
                    Mendukung upload satu gambar.
                  </p>
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

      {isDetailPage ? (
        <Button
          icon={<Edit className="w-4 h-4" />}
          className="w-max"
          onClick={() => setModalOpen(true)}
        >
          Edit
        </Button>
      ) : (
        <Tooltip title="Edit Data">
          <Button
            icon={<Edit className="w-4 h-4" />}
            onClick={() => setModalOpen(true)}
          />
        </Tooltip>
      )}
    </>
  );
}
