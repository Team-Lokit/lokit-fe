'use client';

import { useMutation } from '@tanstack/react-query';
import { useGetPresignedUrl, useCreate1 } from '@repo/api-client';
import type { SelectedPhoto } from '../../../add/_types/photo';

interface UploadPhotoParams {
  photo: SelectedPhoto;
  description?: string;
  albumId?: number;
  userId: number;
}

const dataUrlToBlob = (dataUrl: string): Blob => {
  const [header, base64] = dataUrl.split(',');
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch?.[1] ?? 'image/jpeg';
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }

  return new Blob([array], { type: mime });
};

const getMimeType = (dataUrl: string): string => {
  const match = dataUrl.match(/data:(.*?);/);
  return match?.[1] ?? 'image/jpeg';
};

export const usePhotoUpload = () => {
  const { mutateAsync: getPresignedUrl } = useGetPresignedUrl();
  const { mutateAsync: createPhoto } = useCreate1();

  return useMutation({
    mutationFn: async ({ photo, description, albumId, userId }: UploadPhotoParams) => {
      const contentType = getMimeType(photo.uri);

      // 1. Presigned URL 발급
      const presignedUrlResponse = await getPresignedUrl({
        data: {
          fileName: photo.filename,
          contentType,
        },
        params: { userId },
      });

      if (!presignedUrlResponse.presignedUrl || !presignedUrlResponse.objectUrl) {
        throw new Error('Failed to get presigned URL');
      }

      // 2. S3에 이미지 업로드
      const blob = dataUrlToBlob(photo.uri);
      const uploadResponse = await fetch(presignedUrlResponse.presignedUrl, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': contentType,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image to S3');
      }

      // 3. POST /photos로 메타데이터 저장
      const createResponse = await createPhoto({
        data: {
          url: presignedUrlResponse.objectUrl,
          albumId,
          longitude: photo.location?.longitude,
          latitude: photo.location?.latitude,
          description,
        },
        params: { userId },
      });

      return createResponse;
    },
  });
};
