import type { Meta, StoryObj } from '@storybook/react';
import ExploreHeader from './ExploreHeader';

const meta: Meta<typeof ExploreHeader> = {
  title: 'Components/Header/ExploreHeader',
  component: ExploreHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof ExploreHeader>;

export const Default: Story = {
  args: {
    title: '서울특별시 강남구',
    onClickProfile: () => console.log('프로필'),
    onClickExplore: () => console.log('탐험'),
  },
};

export const WithProfileImage: Story = {
  args: {
    title: '서울특별시 강남구',
    profileImageSrc: 'https://picsum.photos/200',
    onClickProfile: () => console.log('프로필'),
    onClickExplore: () => console.log('탐험'),
  },
};
