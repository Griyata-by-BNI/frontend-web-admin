"use client";

import { Modal } from "antd";
import Image from "next/image";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  name: string;
}

export default function ImageGallery({ images, name }: ImageGalleryProps) {
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <>
      <div className="w-full space-y-2">
        <div
          className="w-full h-[200px] rounded-lg cursor-pointer"
          onClick={() => setIsGalleryModalOpen(true)}
        >
          <Image
            src={images[selectedImage]}
            width={400}
            height={200}
            alt={name}
            className="w-full h-[200px] object-cover rounded-lg"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {images.length > 1 && (
            <>
              {images.slice(1, 3).map((image, index) => (
                <div
                  key={index}
                  className="h-[60px] rounded cursor-pointer"
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image}
                    width={120}
                    height={60}
                    alt={`${name} ${index + 1}`}
                    className="w-full h-[60px] object-cover rounded"
                  />
                </div>
              ))}
            </>
          )}

          {images.length > 3 && (
            <div
              className="h-[60px] rounded cursor-pointer bg-gray-100 flex items-center justify-center relative overflow-hidden"
              onClick={() => setIsGalleryModalOpen(true)}
            >
              <Image
                src={images[2]}
                width={120}
                height={60}
                alt={name}
                className="w-full h-[60px] object-cover rounded absolute inset-0"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-semibold">
                  +{images.length - 3} more
                </span>
              </div>
            </div>
          )}

          {images.length === 3 && (
            <div
              className="h-[60px] rounded cursor-pointer"
              onClick={() => setSelectedImage(2)}
            >
              <Image
                src={images[2]}
                width={120}
                height={60}
                alt={`${name} 3`}
                className="w-full h-[60px] object-cover rounded"
              />
            </div>
          )}
        </div>
      </div>

      <Modal
        title="Galeri Foto"
        open={isGalleryModalOpen}
        onCancel={() => setIsGalleryModalOpen(false)}
        footer={null}
        width={800}
        centered
      >
        <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {images.map((image, index) => (
            <div key={index} className="aspect-video">
              <Image
                src={image}
                alt={`${name} ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-full object-cover rounded"
              />
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
