
// Declare global window properties for image handling
interface Window {
  imageResetDone?: boolean;
  imageCacheVersion?: number;
  loadedImages?: Set<string>;
}
