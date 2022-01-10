import React, { ReactNode } from 'react';

interface LogoProps {
  href: string;
  className?: string;
  size?: number;
  children?: ReactNode | undefined;
}

export function GitHubLogo({ href, className, size = 20, children }: LogoProps) {
  return (
    <div className={className}>
      <a href={href} target="_blank" rel="noreferrer" className="block no-underline hover:underline">
        <svg viewBox="0 0 16 16" width={size} height={size} className="inline-block">
          <path
            fill="white"
            fillRule="evenodd"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          ></path>
        </svg>{' '}
        {children}
      </a>
    </div>
  );
}

export function TwitchLogo({ href, className, size = 20, children }: LogoProps) {
  return (
    <div className={className}>
      <a href={href} target="_blank" rel="noreferrer" className="block no-underline hover:underline">
        <svg x="0px" y="0px" viewBox="0 0 2400 2800" width={size} height={size} className="inline-block">
          <g fill="white">
            <path d="M500,0L0,500v1800h600v500l500-500h400l900-900V0H500z M2200,1300l-400,400h-400l-350,350v-350H600V200h1600 V1300z" />
            <rect x="1700" y="550" width="200" height="600" />
            <rect x="1150" y="550" width="200" height="600" />
          </g>
        </svg>{' '}
        {children}
      </a>
    </div>
  );
}
