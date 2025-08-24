import "@ant-design/v5-patch-for-react-19";
import { Button, Form, Modal } from "antd";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { FilterForm } from "./components/FilterForm";
import { FilterFormData } from "./types";
import { useFilterContext } from "@/contexts/filterContext";

export function FilterModal() {
  const { form } = useFilterContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFinish = async (values: FilterFormData) => {};

  const handleReset = () => {
    form.resetFields();
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
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
            loading={isLoading}
            onClick={() => form.submit()}
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
