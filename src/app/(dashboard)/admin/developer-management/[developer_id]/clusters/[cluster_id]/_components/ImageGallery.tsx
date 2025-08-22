"use client";

import { Modal } from "antd";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Eye } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  name: string;
}

export default function ImageGallery({ images, name }: ImageGalleryProps) {
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const imgs = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images]
  );

  useEffect(() => {
    if (selectedImage >= imgs.length) setSelectedImage(0);
  }, [imgs.length, selectedImage]);

  if (imgs.length === 0) return null;

  const thumbs = imgs
    .map((src, i) => ({ src, i }))
    .filter((t) => t.i !== selectedImage);

  const visibleThumbs = thumbs.slice(0, 2);
  const remainingThumbs = thumbs.length - visibleThumbs.length;

  return (
    <>
      <div className="w-full space-y-2">
        {/* gambar utama + overlay "See detail" saat hover */}
        <button
          type="button"
          aria-label="Open gallery"
          className="group relative w-full h-[200px] rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setIsGalleryModalOpen(true)}
        >
          <Image
            src={imgs[selectedImage]}
            width={400}
            height={200}
            alt={`${name} - gambar utama`}
            className="w-full h-[200px] object-cover rounded-lg"
          />

          {/* overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200">
            {/* lapisan gelap */}
            <div className="absolute inset-0 bg-black/40" />
            {/* konten overlay */}
            <div className="relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-sm font-medium">
              <Eye size={16} />
              <span>See detail</span>
            </div>
          </div>
        </button>

        {/* thumbnail */}
        <div className="grid grid-cols-3 gap-2">
          {visibleThumbs.map((t) => (
            <button
              type="button"
              key={t.i}
              className="h-[60px] rounded overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(t.i)}
            >
              <Image
                src={t.src}
                width={120}
                height={60}
                alt={`${name} - thumbnail ${t.i + 1}`}
                className="w-full h-[60px] object-cover"
              />
            </button>
          ))}

          {remainingThumbs > 0 && (
            <button
              type="button"
              className="h-[60px] rounded cursor-pointer bg-gray-100 flex items-center justify-center relative overflow-hidden"
              onClick={() => setIsGalleryModalOpen(true)}
            >
              {thumbs[2]?.src && (
                <Image
                  src={thumbs[2].src}
                  width={120}
                  height={60}
                  alt={`${name} lainnya`}
                  className="w-full h-[60px] object-cover absolute inset-0"
                />
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold">
                  +{remainingThumbs} more
                </span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* modal galeri */}
      <Modal
        title="Galeri Foto"
        open={isGalleryModalOpen}
        onCancel={() => setIsGalleryModalOpen(false)}
        footer={null}
        width={800}
        centered
      >
        <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {imgs.map((image, index) => (
            <button
              type="button"
              key={index}
              className="aspect-video rounded overflow-hidden"
              onClick={() => {
                setSelectedImage(index);
                setIsGalleryModalOpen(false);
              }}
            >
              <Image
                src={image}
                alt={`${name} ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
