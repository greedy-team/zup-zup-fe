/// <reference types="vite/client" />
/// <reference types="vitest" />
/// <reference types="kakaomaps" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg?component' {
  import * as React from 'react';
  const C: React.FC<React.SVGProps<SVGSVGElement>>;
  export default C;
}

declare module '*.svg' {
  const url: string;
  export default url;
}
