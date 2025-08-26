import { useFilterContext } from "@/contexts/filterContext";
import "@ant-design/v5-patch-for-react-19";
import { Button, Form, Modal, App } from "antd";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { FilterForm } from "./components/FilterForm";
import { getBaseUrl } from "@/utils/getBaseUrl";

export function FilterModal() {
  const { form, router, pathname, buildSearchParams } = useFilterContext();
  const { message } = App.useApp();
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const handleApplyFilter = async () => {
    try {
      const values = await form.validateFields();
      const formValues = await form.getFieldsValue();

      if (
        formValues.sortBy === "closestDistance" &&
        (!formValues.lat || !formValues.lng)
      ) {
        message.error(
          "Mohon izinkan akses lokasi untuk memilih filter jarak terdekat!"
        );
        form.setFieldsValue({ sortBy: "latestUpdated" });
        return;
      }

      const searchParams = buildSearchParams(values);

      const baseUrl = getBaseUrl();
      const basePath = pathname.endsWith("/search")
        ? pathname
        : `${pathname.replace(/\/$/, "")}/search`;

      const url = new URL(basePath, baseUrl);
      url.search = searchParams.toString();

      router.push(url.toString());
      setIsOpen(false);
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleReset = () => {
    form.resetFields();

    const baseUrl = getBaseUrl();
    const basePath = pathname.endsWith("/search")
      ? pathname
      : `${pathname.replace(/\/$/, "")}/search`;

    const url = new URL(basePath, baseUrl);
    url.search = "";

    router.push(url.toString());
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full lg:w-auto px-6 flex items-center justify-center rounded-xl cursor-pointer
          border-3 border-primary-tosca gap-2 font-semibold text-primary-tosca bg-white transition-all
          duration-300 shadow-lg hover:text-dark-tosca hover:border-dark-tosca h-11 sm:h-12 md:h-[52px] text-md md:text-lg"
      >
        <SlidersHorizontal className="h-5 w-5 md:h-6 md:w-6" />

        <span>Filter</span>
      </button>

      <Modal
        centered
        title="Filter Properti"
        open={isOpen}
        onCancel={onClose}
        maskClosable={false}
        keyboard={false}
        width={800}
        footer={[
          <Button key="reset" size="large" onClick={handleReset}>
            Reset
          </Button>,
          <Button
            key="apply"
            size="large"
            type="primary"
            onClick={handleApplyFilter}
          >
            Terapkan Filter
          </Button>,
        ]}
      >
        <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden px-1">
          <FilterForm />
        </div>
      </Modal>
    </>
  );
}
