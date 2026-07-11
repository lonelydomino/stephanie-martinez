import Image from "next/image";

type LogoSize = "nav" | "hero" | "footer";

const sizeConfig: Record<
  LogoSize,
  { className: string; width: number; height: number }
> = {
  nav: { className: "h-10 w-10 md:h-11 md:w-11", width: 44, height: 44 },
  hero: {
    className: "h-44 w-44 sm:h-52 sm:w-52 md:h-60 md:w-60 lg:h-72 lg:w-72",
    width: 288,
    height: 288,
  },
  footer: { className: "h-14 w-14", width: 56, height: 56 },
};

type Props = {
  size?: LogoSize;
  className?: string;
  priority?: boolean;
};

export default function Logo({
  size = "nav",
  className = "",
  priority = false,
}: Props) {
  const config = sizeConfig[size];

  return (
    <Image
      src="/logo.png"
      alt="@SimplySpookyStephanie logo"
      width={config.width}
      height={config.height}
      priority={priority}
      className={`rounded-full object-cover shadow-[0_0_24px_color-mix(in_srgb,#7D1111_35%,transparent)] ${config.className} ${className}`}
    />
  );
}
