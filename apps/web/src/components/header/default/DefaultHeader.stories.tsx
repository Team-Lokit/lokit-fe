import type { Meta, StoryObj } from '@storybook/react';
import DefaultHeader from './DefaultHeader';

const meta: Meta<typeof DefaultHeader> = {
  title: 'Components/Header/DefaultHeader',
  component: DefaultHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof DefaultHeader>;

export const Default: Story = {
  args: {
    title: '사진 선택',
    buttonText: '완료',
    disabled: false,
    onClickBack: () => console.log('뒤로가기'),
    onClickButton: () => console.log('완료'),
  },
};

export const Disabled: Story = {
  args: {
    title: '사진 선택',
    buttonText: '완료',
    disabled: true,
    onClickBack: () => console.log('뒤로가기'),
    onClickButton: () => console.log('완료'),
  },
};

export const WithoutButton: Story = {
  args: {
    title: '설정',
    onClickBack: () => console.log('뒤로가기'),
  },
};
