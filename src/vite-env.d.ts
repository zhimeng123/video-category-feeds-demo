/// <reference types="vite/client" />


// 给ts识别.mp4格式
declare module '*.mp4' {
  const src: string;
  export default src;
}