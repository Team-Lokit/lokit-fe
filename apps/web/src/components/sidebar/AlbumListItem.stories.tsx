import type { Meta, StoryObj } from '@storybook/react';
import AlbumListItem from './AlbumListItem';

const meta: Meta<typeof AlbumListItem> = {
  title: 'Components/Sidebar/AlbumListItem',
  component: AlbumListItem,
  tags: ['autodocs'],
  args: {
    title: '전체사진',
    totalCount: 55,
  },
};

export default meta;

type Story = StoryObj<typeof AlbumListItem>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    isSelected: true,
  },
};

export const WithMenu: Story = {
  args: {
    title: '제주도 여행',
    totalCount: 22,
    showMenu: true,
  },
};

export const LongTitle: Story = {
  args: {
    title: '일이삼사오육칠팔구십일이삼사오육칠팔구십',
    totalCount: 999,
    showMenu: true,
  },
};
