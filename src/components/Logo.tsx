import Image from "next/image";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Image
      src="/logo.png"
      alt="SB Alliance"
      width={200}
      height={45}
      priority
      className={`h-11 w-auto sm:h-14 ${light ? "brightness-0 invert" : ""}`}
    />
  );
}
