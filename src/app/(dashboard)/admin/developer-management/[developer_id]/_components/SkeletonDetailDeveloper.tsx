import { Col, Row, Skeleton } from "antd";

export default function SkeletonDetailDeveloper() {
  return (
    <div className="mb-4 flex flex-col gap-1">
      <Skeleton.Input active size="large" className="!w-1/3 !h-8" />

      <Skeleton
        active
        paragraph={{ rows: 1, width: "60%" }}
        title={false}
        className="mt-2"
      />

      <div className="mt-4 overflow-hidden">
        <Row gutter={[48, 24]}>
          <Col xs={24} md={8}>
            <Skeleton.Image className="!w-full !h-[200px]" active />
          </Col>

          <Col xs={24} md={16}>
            <div className="flex gap-2 justify-end mb-4">
              <Skeleton.Button active className="!w-20" />
              <Skeleton.Button active className="!w-20" />
            </div>

            <Skeleton.Input active className="!w-1/4 !h-6 mb-2" />
            <Skeleton paragraph={{ rows: 4 }} active />
          </Col>

          <Col span={24}>
            <Skeleton.Input active className="!w-1/4 !h-6 mb-2" />
            <Skeleton paragraph={{ rows: 5 }} active />
          </Col>
        </Row>
      </div>
    </div>
  );
}
