/// <reference types="vite/client" />

declare module 'virtual:resume-catalog' {
  const files: Array<{ id: string; name: string; folder: string; url: string }>;
  export default files;
}
