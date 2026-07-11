'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/buttons/button/Button';
import Input from '@/components/input/Input';
import ProfileImageUpload from '../_components/ProfileImageUpload/ProfileImageUpload';
import { useProfileUpload } from '../_hooks/useProfileUpload';
import { useOnboardingContext } from '../_contexts/OnboardingContext';
import { ROUTES } from '@/constants/routes';
import { track } from '@/lib/analytics';
import { useTrackPage } from '@/hooks/analytics/useTrackPage';
import * as S from './page.styles';
import { getGetMyPageQueryKey, useGetMyPage } from '@repo/api-client/src/generated';
import { useQueryClient } from '@tanstack/react-query';

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [nickname, setNickname] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: myPageData } = useGetMyPage();
  const { uploadImage, saveProfile, isUploading } = useProfileUpload();
  const { setProfileData, markStepCompleted, completedSteps } = useOnboardingContext();

  useTrackPage('screen_view_profile_setup', {
    is_first_setup: !completedSteps.profile,
  });

  const handleImageSelect = useCallback((file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!myPageData) return;

    setNickname(myPageData.myName ?? '');
    setPreviewUrl(myPageData.myProfileImageUrl ?? null);
  }, [myPageData]);

  const handleSubmit = useCallback(async () => {
    if (!nickname.trim()) return;

    setIsSubmitting(true);

    try {
      let uploadedUrl: string | null = null;

      // 이미지가 있으면 업로드
      if (imageFile) {
        uploadedUrl = await uploadImage(imageFile);
        if (!uploadedUrl) {
          setIsSubmitting(false);
          return;
        }
      }

      // 프로필 저장
      const success = await saveProfile(nickname, uploadedUrl);
      if (success) {
        await queryClient.invalidateQueries({
          queryKey: getGetMyPageQueryKey(),
        });

        track('profile_setup_complete', {
          has_profile_image: !!uploadedUrl,
        });

        setProfileData({ nickname, profileImageUrl: uploadedUrl });
        markStepCompleted('profile');
        router.push(ROUTES.ONBOARDING.CONNECT);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    nickname,
    imageFile,
    uploadImage,
    saveProfile,
    setProfileData,
    markStepCompleted,
    router,
  ]);

  const isValid = nickname.trim().length > 0;
  const isLoading = isUploading || isSubmitting;

  return (
    <S.Wrapper>
      <S.Content>
        <S.Title>나를 어떻게 나타낼까요?</S.Title>
        <S.Description>로킷에서 보여질 프로필을 설정해주세요</S.Description>
        <S.ProfileContainer>
          <ProfileImageUpload
            imageUrl={previewUrl}
            onImageSelect={handleImageSelect}
            isUploading={isUploading}
          />
          <S.InputWrapper>
            <Input
              value={nickname}
              onChange={setNickname}
              max={10}
              showCharCount={false}
            />
          </S.InputWrapper>
        </S.ProfileContainer>
      </S.Content>
      <S.ButtonWrapper>
        <Button
          text="확인"
          variant="highlight"
          size="large"
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          style={{ width: '100%' }}
        />
      </S.ButtonWrapper>
    </S.Wrapper>
  );
}
