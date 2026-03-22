import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, userEvent, within } from 'storybook/test';
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
    onClose: fn(),
    onExplore: fn(),
    onNewAlbum: fn(),
    onSelectAlbum: fn(),
    onMyPage: fn(),
  },
  argTypes: {
    isOpen: { control: 'boolean' },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <Sidebar
        {...args}
        onClose={() => {
          args.onClose();
          updateArgs({ isOpen: false });
        }}
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

export const CloseOnButtonClick: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const closeButton = canvas.getByLabelText('사이드바 닫기');
    await userEvent.click(closeButton);
    expect(args.onClose).toHaveBeenCalled();
  },
};

export const CloseOnBackdropClick: Story = {
  play: async ({ canvasElement, args }) => {
    const body = canvasElement.ownerDocument.body;
    const backdrop = body.querySelector('[class*="Backdrop"]');
    if (backdrop) {
      await userEvent.click(backdrop as HTMLElement);
      expect(args.onClose).toHaveBeenCalled();
    }
  },
};

export const CloseOnEscKey: Story = {
  play: async ({ args }) => {
    await userEvent.keyboard('{Escape}');
    expect(args.onClose).toHaveBeenCalled();
  },
};

export const SearchFiltering: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const searchInput = canvas.getByPlaceholderText('앨범을 검색해보세요...');

    await userEvent.type(searchInput, '제주');

    expect(canvas.getByText('제주도')).toBeInTheDocument();
    expect(canvas.queryByText('일이삼사오육칠팔구십')).not.toBeInTheDocument();
  },
};

export const SearchNoResults: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const searchInput = canvas.getByPlaceholderText('앨범을 검색해보세요...');

    await userEvent.type(searchInput, '없는앨범');

    expect(canvas.getByText('검색 결과가 없습니다')).toBeInTheDocument();
  },
};

export const SearchReset: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const searchInput = canvas.getByPlaceholderText('앨범을 검색해보세요...');

    await userEvent.type(searchInput, '제주');
    expect(canvas.queryByText('일이삼사오육칠팔구십')).not.toBeInTheDocument();

    await userEvent.clear(searchInput);
    expect(canvas.getByText('일이삼사오육칠팔구십')).toBeInTheDocument();
    expect(canvas.getByText('제주도')).toBeInTheDocument();
  },
};

export const AlbumClick: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const albumItem = canvas.getByText('제주도');
    await userEvent.click(albumItem);
    expect(args.onSelectAlbum).toHaveBeenCalledWith(2);
  },
};

export const MenuClick: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByText('탐색'));
    expect(args.onExplore).toHaveBeenCalled();

    await userEvent.click(canvas.getByText('새 앨범'));
    expect(args.onNewAlbum).toHaveBeenCalled();
  },
};

export const MyPageClick: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByText('김로킷'));
    expect(args.onMyPage).toHaveBeenCalled();
  },
};
