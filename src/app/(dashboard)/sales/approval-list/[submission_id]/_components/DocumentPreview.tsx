"use client";

import { Card, Col, Row, Image, Button } from "antd";
import { FileText, Download, Eye } from "lucide-react";
import { useState } from "react";

type Document = {
  type: string;
  url: string;
};

type DocumentPreviewProps = {
  documents?: Document[];
};

const documentTypeLabels: Record<string, string> = {
  ktp: "KTP",
  npwp: "NPWP", 
  employment_certificate: "Surat Keterangan Kerja",
  salary_slip: "Slip Gaji",
};

export default function DocumentPreview({ documents = [] }: DocumentPreviewProps) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  const isPdf = (url: string) => /\.pdf$/i.test(url);

  const handlePreview = (url: string) => {
    if (isImage(url)) {
      setPreviewImage(url);
      setPreviewVisible(true);
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        {documents.map((doc, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card
              size="small"
              className="h-full"
              cover={
                isImage(doc.url) ? (
                  <div className="h-32 overflow-hidden">
                    <Image
                      src={doc.url}
                      alt={documentTypeLabels[doc.type] || doc.type}
                      className="w-full h-32 object-cover"
                      preview={false}
                    />
                  </div>
                ) : (
                  <div className="h-32 bg-gray-100 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                )
              }
              actions={[
                <Button
                  key="preview"
                  type="text"
                  size="small"
                  icon={<Eye className="w-4 h-4" />}
                  onClick={() => handlePreview(doc.url)}
                >
                  Preview
                </Button>,
                <Button
                  key="download"
                  type="text"
                  size="small"
                  icon={<Download className="w-4 h-4" />}
                  onClick={() => window.open(doc.url, "_blank")}
                >
                  Download
                </Button>,
              ]}
            >
              <Card.Meta
                title={
                  <span className="text-sm">
                    {documentTypeLabels[doc.type] || doc.type}
                  </span>
                }
                description={
                  <span className="text-xs text-gray-500">
                    {isPdf(doc.url) ? "PDF" : "Image"}
                  </span>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Image
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