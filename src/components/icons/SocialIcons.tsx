import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

export function InstagramIcon({ className, ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ className, ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78c.3 0 .59.05.86.14v-3.5a6.37 6.37 0 0 0-.86-.06A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 10.86 4.48V13a8.23 8.23 0 0 0 4.83 1.55V11.1a4.85 4.85 0 0 1-.75-.06 4.83 4.83 0 0 1-1.5-.64z" />
    </svg>
  );
}

export function YoutubeIcon({ className, ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
    </svg>
  );
}

export function FacebookIcon({ className, ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.17 2.09 15.92 2 14.79 2 11.96 2 10 3.66 10 6.79V9.5H7.5v4H10V22h4z" />
    </svg>
  );
}

export function SnapchatIcon({ className, ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.045.275 0 .054-.134.166-.498.332-.915 1.32-3.328 2.37-4.716 4.37-4.716.988 0 2.222.243 2.222 1.214 0 .424-.39.848-1.17 1.214-.78.39-1.56.78-1.56 1.56 0 .78.78 1.17 1.95 1.17 1.17 0 2.34-.39 3.12-1.17.78-.78 1.17-1.56 1.17-2.34 0-2.73-2.34-4.29-5.46-4.29-3.51 0-5.07 2.34-6.24 5.46-.39.78-.78 1.56-1.17 1.95-.39.39-.78.585-1.17.585-.39 0-.78-.195-1.17-.585-.39-.39-.78-1.17-1.17-1.95C7.476 5.853 5.916 3.513 2.406 3.513c-3.12 0-5.46 1.56-5.46 4.29 0 .78.39 1.56 1.17 2.34.78.78 1.95 1.17 3.12 1.17 1.17 0 1.95-.39 1.95-1.17 0-.78-.78-1.17-1.56-1.56-.78-.366-1.17-.79-1.17-1.214 0-.97 1.234-1.214 2.222-1.214 2 0 3.05 1.388 4.37 4.716.166.417.278.781.332.915.072.045.2.045.275 0-.008-.165-.018-.33-.03-.51l-.003-.06c-.104-1.628-.23-3.654.299-4.847C7.859 1.069 11.216.793 12.206.793z" />
    </svg>
  );
}
