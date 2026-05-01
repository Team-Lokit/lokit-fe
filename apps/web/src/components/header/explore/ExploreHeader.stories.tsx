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
    onClickMenu: () => console.log('사이드바 열기'),
    onClickAlarm: () => console.log('알림'),
  },
};
