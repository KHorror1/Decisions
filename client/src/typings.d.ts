export {};

declare global {
  interface Window {
    electronAPI: {
      getPresets: () => Promise<{ [key: string]: string[] }>;
      savePresets: (presets: { [key: string]: string[] }) => void;
    };
  }
}