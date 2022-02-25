import { JSDOM } from 'jsdom';

export default function (): void {
  const jsdom = new JSDOM(`
    <html>
      <head></head>
      <body></body>
    </html>
  `);
  const { window } = jsdom;

  (global as any).window = window;
  (global as any).document = window.document;
  (global as any).requestAnimationFrame = (callback: () => unknown): number => setTimeout(callback, 0) as unknown as number;
  (global as any).cancelAnimationFrame = (handle: number): void => clearTimeout(handle);
  Object.defineProperties(global, {
    ...Object.getOwnPropertyDescriptors(window),
    ...Object.getOwnPropertyDescriptors(global)
  });
}
