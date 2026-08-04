import Image from "next/image";

export default function HeroBanner() {
  return (
    <section className="w-full px-4">
      <Image
        src="/banner/front-banner.svg"
        alt="Janak Hero Banner"
        width={1440}
        height={500}
        className="w-full h-auto"
        priority
      />
    </section>
  );
}
