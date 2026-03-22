import styled from '@emotion/styled';
import HeartIcon from '@/assets/images/heart.svg';
import DefaultProfileIcon from '@/assets/images/defaultProfile.svg';

interface SidebarMyProps {
  nickname: string;
  dDay: number;
  profileImageUrl?: string;
  onClick: () => void;
}

const SidebarMy = ({ nickname, dDay, profileImageUrl, onClick }: SidebarMyProps) => {
  return (
    <Container onClick={onClick}>
      <ProfileCircle>
        {profileImageUrl ? (
          <ProfileImage src={profileImageUrl} alt={nickname} />
        ) : (
          <DefaultProfileIcon />
        )}
      </ProfileCircle>
      <InfoGroup>
        <Nickname>{nickname}</Nickname>
        <DdayBadge>
          <HeartIconWrapper>
            <HeartIcon />
          </HeartIconWrapper>
          <DdayText>{dDay}일</DdayText>
        </DdayBadge>
      </InfoGroup>
    </Container>
  );
};

export default SidebarMy;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.blueWhite.bg8};
  }
`;

const ProfileCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.blueWhite.bg8};
  backdrop-filter: ${({ theme }) => theme.effects.backdropBlur[25]};
  border: 1px solid ${({ theme }) => theme.colors.blueWhite.border10};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ProfileImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  object-fit: cover;
`;

const InfoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Nickname = styled.span`
  ${({ theme }) => theme.typography.body16Medium};
  color: ${({ theme }) => theme.colors.gray[100]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DdayBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.blueWhite.bg8};
`;

const HeartIconWrapper = styled.div`
  width: 12px;
  height: 12px;
  flex-shrink: 0;
`;

const DdayText = styled.span`
  ${({ theme }) => theme.typography.body15Medium};
  color: ${({ theme }) => theme.colors.gray[300]};
  white-space: nowrap;
`;
