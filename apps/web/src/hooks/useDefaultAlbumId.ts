import { useGetMyPage } from '@repo/api-client';

export const useDefaultAlbumId = () => {
  const { data: myPageData } = useGetMyPage();

  return myPageData?.defaultAlbumId;
};
