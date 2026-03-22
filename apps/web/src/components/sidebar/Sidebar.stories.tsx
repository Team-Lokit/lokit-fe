import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from 'storybook/preview-api';
import Sidebar from './Sidebar';

const mockAlbums = [
  { id: 0, title: '전체사진', photoCount: 55, thumbnailUrls: [] },
  { id: 1, title: '일이삼사오육칠팔구십', photoCount: 11, thumbnailUrls: [] },
  { id: 2, title: '제주도', photoCount: 22, thumbnailUrls: [] },
];

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  args: {
    isOpen: true,
    albums: mockAlbums,
    nickname: '김로킷',
    dDay: 66,
  },
  argTypes: {
    isOpen: { control: 'boolean' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <Sidebar
        {...args}
        onClose={() => updateArgs({ isOpen: false })}
        onExplore={() => alert('탐색')}
        onNewAlbum={() => alert('새 앨범')}
        onSelectAlbum={(id) => alert(`앨범 ${id} 선택`)}
        onMyPage={() => alert('마이페이지')}
      />
    );
  },
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};

export const Closed: Story = {
  args: {
    isOpen: false,
  },
};

export const EmptyAlbums: Story = {
  args: {
    albums: [{ id: 0, title: '전체사진', photoCount: 0, thumbnailUrls: [] }],
  },
};

export const ManyAlbums: Story = {
  args: {
    albums: [
      { id: 0, title: '전체사진', photoCount: 120, thumbnailUrls: [] },
      ...Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        title: `앨범 ${i + 1}`,
        photoCount: Math.floor(Math.random() * 100),
        thumbnailUrls: [],
      })),
    ],
  },
};
