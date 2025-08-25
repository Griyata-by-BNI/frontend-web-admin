import ImageSlider from "@/app/(debtor)/developers/components/ImageSlider";

interface ClusterImageSliderProps {
  urls: string[];
  altText: string;
}

export default function ClusterImageSlider({ urls, altText }: ClusterImageSliderProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden mb-8">
      <div className="relative w-full h-80 md:h-[420px]">
        <ImageSlider urls={urls} altText={altText} />
      </div>
    </div>
  );
}