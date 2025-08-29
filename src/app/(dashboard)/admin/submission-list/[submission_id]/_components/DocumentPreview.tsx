"use client";

import {
  Card,
  Col,
  Row,
  Image as AntImage,
  Button,
  Tag,
  Empty,
  Typography,
  Tooltip,
} from "antd";
import { FileText, Download, Eye } from "lucide-react";
import { useState } from "react";

type Document = { type: string; url: string };
type DocumentPreviewProps = { documents?: Document[] };

const documentTypeLabels: Record<string, string> = {
  ktp: "KTP",
  npwp: "NPWP",
  employment_certificate: "Surat Keterangan Kerja",
  salary_slip: "Slip Gaji",
};

const IMG_EXT = /\.(jpe?g|png|gif|webp|bmp|tiff?)$/i;
const PDF_EXT = /\.pdf$/i;

function getExt(url: string) {
  const clean = url.split("#")[0].split("?")[0];
  const dot = clean.lastIndexOf(".");
  return dot >= 0 ? clean.slice(dot + 1).toLowerCase() : "";
}
const isImage = (url: string) => IMG_EXT.test(url);
const isPdf = (url: string) => PDF_EXT.test(url);

export default function DocumentPreview({
  documents = [],
}: DocumentPreviewProps) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreview = (url: string) => {
    if (isImage(url)) {
      setPreviewImage(url);
      setPreviewVisible(true);
    } else {
      window.open(url, "_blank");
    }
  };

  if (!documents.length) {
    return (
      <div className="py-10">
        <Empty description="Belum ada dokumen" />
      </div>
    );
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        {documents.map((doc, idx) => {
          const ext = getExt(doc.url);
          const label = documentTypeLabels[doc.type] || doc.type || "Dokumen";
          const typeBadge = isPdf(doc.url)
            ? "PDF"
            : isImage(doc.url)
            ? "Image"
            : (ext || "File").toUpperCase();

          return (
            <Col xs={24} sm={12} md={8} lg={6} key={idx}>
              <Card
                size="small"
                hoverable
                className="h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                cover={
                  isImage(doc.url) ? (
                    <div className="relative h-36 w-full overflow-hidden bg-gray-50">
                      <AntImage
                        src={doc.url}
                        alt={label}
                        className="!w-full !h-36 !object-cover"
                        preview={false}
                      />
                      <Tag className="!absolute !top-2 !right-2" color="blue">
                        {typeBadge}
                      </Tag>
                    </div>
                  ) : (
                    <div className="relative h-36 w-full bg-gray-50 overflow-hidden">
                      {/* ini yang bikin dead-center */}
                      <FileText className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-gray-400" />
                      <Tag className="!absolute !top-2 !right-2" color="blue">
                        {typeBadge}
                      </Tag>
                    </div>
                  )
                }
                actions={[
                  <Button
                    key="preview"
                    type="text"
                    className="!w-full !h-auto py-2 flex items-center justify-center gap-2"
                    icon={<Eye className="w-4 h-4" />}
                    onClick={() => handlePreview(doc.url)}
                  >
                    Preview
                  </Button>,
                  <Button
                    key="download"
                    type="text"
                    className="!w-full !h-auto py-2 flex items-center justify-center gap-2"
                    icon={<Download className="w-4 h-4" />}
                    onClick={() => window.open(doc.url, "_blank")}
                  >
                    Download
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={
                    <Tooltip title={label}>
                      <Typography.Text strong ellipsis className="!text-sm">
                        {label}
                      </Typography.Text>
                    </Tooltip>
                  }
                  description={
                    <Typography.Text type="secondary" className="!text-xs">
                      {typeBadge}
                    </Typography.Text>
                  }
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      <AntImage
        style={{ display: "none" }}
        src={previewImage}
        preview={{
          visible: previewVisible,
          onVisibleChange: setPreviewVisible,
        }}
      />
    </>
  );
}
