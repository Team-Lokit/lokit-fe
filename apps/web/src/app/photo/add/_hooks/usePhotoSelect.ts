'use client';

import { useCallback, useRef, useState } from 'react';
import type { PickImageSource } from '@repo/webview-bridge';
import type { SelectedPhoto } from '../_types/photo';
import { fileToSelectedPhoto } from '../_utils/fileToSelectedPhoto';
import { ALLOWED_IMAGE_MIME_TYPES, isAllowedImageType } from '@/constants/image';
import { requestImageFromBridge } from '@/utils/bridge/requestImageFromBridge';
import { checkIsInWebView } from '@/utils/environment';

interface UsePhotoSelectOptions {
  onPhotosSelected?: (photos: SelectedPhoto[]) => void;
}

interface UsePhotoSelectReturn {
  /** 로딩 중 여부 */
  isLoading: boolean;
  /** 갤러리에서 사진 선택 */
  selectPhotosFromLibrary: () => void;
  /** 카메라로 사진 촬영 */
  selectPhotosFromCamera: () => void;
}

export const usePhotoSelect = (options?: UsePhotoSelectOptions): UsePhotoSelectReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const processFiles = useCallback(async (files: File[]) => {
    const validFiles = files.filter(isAllowedImageType);
    const photoPromises = validFiles.map((file) => fileToSelectedPhoto(file));
    const results = await Promise.all(photoPromises);
    const newPhotos = results.filter((photo): photo is SelectedPhoto => photo !== null);

    optionsRef.current?.onPhotosSelected?.(newPhotos);
  }, []);

  const selectPhotosFromBridge = useCallback(
    async (source: PickImageSource) => {
      setIsLoading(true);
      try {
        const picked = await requestImageFromBridge({ source, selectionLimit: 1 });
        if (!picked || picked.length === 0) return;
        await processFiles(picked.map((p) => p.file));
      } finally {
        setIsLoading(false);
      }
    },
    [processFiles],
  );

  const selectPhotosFromInput = useCallback(
    (source: PickImageSource) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = ALLOWED_IMAGE_MIME_TYPES.join(',');
      input.multiple = false;
      if (source === 'camera') {
        // 모바일 웹 브라우저에서 후면 카메라로 촬영 모드 유도 (지원하지 않으면 일반 파일 선택으로 폴백)
        input.capture = 'environment';
      }
      input.style.display = 'none';
      document.body.appendChild(input);

      const cleanup = () => {
        document.body.removeChild(input);
      };

      input.onchange = async (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (!files || files.length === 0) {
          cleanup();
          return;
        }

        setIsLoading(true);
        try {
          await processFiles(Array.from(files));
        } finally {
          setIsLoading(false);
          cleanup();
        }
      };

      input.oncancel = cleanup;

      input.click();
    },
    [processFiles],
  );

  const selectPhotos = useCallback(
    (source: PickImageSource) => {
      if (checkIsInWebView()) {
        void selectPhotosFromBridge(source);
      } else {
        selectPhotosFromInput(source);
      }
    },
    [selectPhotosFromBridge, selectPhotosFromInput],
  );

  const selectPhotosFromLibrary = useCallback(
    () => selectPhotos('library'),
    [selectPhotos],
  );
  const selectPhotosFromCamera = useCallback(
    () => selectPhotos('camera'),
    [selectPhotos],
  );

  return {
    isLoading,
    selectPhotosFromLibrary,
    selectPhotosFromCamera,
  };
};
