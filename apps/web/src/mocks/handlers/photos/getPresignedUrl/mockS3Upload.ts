import { http, HttpResponse, delay } from 'msw';
import { presigned_url_발급_성공 } from './mockData';

const getS3UrlPattern = () => {
  const url = new URL(presigned_url_발급_성공.presignedUrl!);
  return `${url.origin}/*`;
};

export const s3UploadHandler = http.put(getS3UrlPattern(), async () => {
  await delay(500);
  return new HttpResponse(null, { status: 200 });
});
