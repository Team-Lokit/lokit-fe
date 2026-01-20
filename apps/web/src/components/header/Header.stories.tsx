import Header from '@/components/header/Header';
import { HEADER_TYPE } from '@/components/header/Header.constants';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    type: {
      control: 'select',
      options: [HEADER_TYPE.DEFAULT, HEADER_TYPE.EXPLORE, HEADER_TYPE.MENU],
      table: {
        type: { summary: "'default' | 'explore' | 'menu'" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    type: HEADER_TYPE.DEFAULT,
    title: '사진 선택',
    buttonText: '완료',
    disabled: false,
    onClickLeft: () => console.log('뒤로가기'),
    onClickRight: () => console.log('완료'),
  },
};

export const DefaultDisabled: Story = {
  args: {
    type: HEADER_TYPE.DEFAULT,
    title: '사진 선택',
    buttonText: '완료',
    disabled: true,
    onClickLeft: () => console.log('뒤로가기'),
    onClickRight: () => console.log('완료'),
  },
};

export const DefaultWithoutButton: Story = {
  args: {
    type: HEADER_TYPE.DEFAULT,
    title: '설정',
    onClickLeft: () => console.log('뒤로가기'),
    onClickRight: () => {},
  },
};

export const Explore: Story = {
  args: {
    type: HEADER_TYPE.EXPLORE,
    title: '서울특별시 강남구',
    onClickLeft: () => console.log('프로필'),
    onClickRight: () => console.log('탐험'),
  },
};

export const Menu: Story = {
  args: {
    type: HEADER_TYPE.MENU,
    title: '앨범 이름',
    onClickLeft: () => console.log('뒤로가기'),
    onClickRight: () => console.log('메뉴'),
  },
};
