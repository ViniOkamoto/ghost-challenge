import Image from "next/image";

export function GhostsPayLogo({
  className = "h-9 w-50",
}: {
  className?: string;
}) {
  return (
    <Image
      src="/logo.png"
      alt="GhostsPay"
      width={210}
      height={48}
      className={className}
    />
  );
}

export function GhostsPayIcon({
  className = "h-6 w-6",
}: {
  className?: string;
}) {
  return (
    <svg
      className={`${className} text-primary`}
      viewBox="0 0 250 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M35.795 211.055C35.795 211.055 72.51 149.955 59.85 93.935C59.85 93.935 40.255 93.445 35.69 84.79C31.125 76.135 55.225 36.155 105.77 26.99C156.315 17.83 205.36 39.62 212.22 105.675C218.585 166.965 212.435 213.225 204.285 220.84C196.135 228.455 174.43 202.115 158.895 207.22C143.36 212.325 132.44 231.07 113.065 223.01C100.06 217.6 83.695 204.545 60.285 214.685C36.875 224.825 34.28 219.25 35.79 211.055H35.795Z"
        fill="#CC0854"
      />
      <path
        d="M135.055 108.455C126.08 99.645 115.84 93.625 105.115 91.55C93.185 89.24 80.735 91.835 81.505 113.195C82.965 153.665 150.71 123.82 150.71 123.82L135.055 108.455Z"
        fill="white"
      />
      <path
        d="M162.17 106.265C165.66 97.03 170.44 89.52 176.295 84.805C182.805 79.565 190.595 77.84 194.405 94.04C201.62 124.735 156.09 122.365 156.09 122.365L162.175 106.265H162.17Z"
        fill="white"
      />
    </svg>
  );
}
