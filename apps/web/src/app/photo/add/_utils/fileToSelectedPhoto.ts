import type { SelectedPhoto } from '../_types/photo';

/**
 * File 객체에서 SelectedPhoto 생성
 *
 * 1. FileReader로 파일을 data URL로 읽음
 * 2. Image로 로드해서 width/height 추출
 * 3. SelectedPhoto 형태로 조합
 */
export const fileToSelectedPhoto = (file: File): Promise<SelectedPhoto | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();

      img.onload = () => {
        resolve({
          id: crypto.randomUUID(),
          uri: dataUrl,
          filename: file.name,
          createdAt: new Date(file.lastModified).toISOString(),
          width: img.width,
          height: img.height,
        });
      };

      img.onerror = () => resolve(null);
      img.src = dataUrl;
    };

    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};
