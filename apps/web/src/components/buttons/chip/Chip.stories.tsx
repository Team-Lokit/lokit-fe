import Chip from '@/components/buttons/chip/Chip';
import type { Meta, StoryObj } from '@storybook/react';
import ChevronRightSvg from '@/assets/images/chevronRightSmall.svg';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: {
    text: 'Chip',
    size: 'medium',
  },
};

export const Black: Story = {
  args: {
    text: 'Black Chip',
    variant: 'black',
    size: 'medium',
  },
};

export const WithIcon: Story = {
  args: {
    text: 'Location',
    size: 'medium',
    showIcon: true,
  },
};

export const WithCancel: Story = {
  args: {
    text: 'Removable',
    size: 'medium',
    onCancel: () => {},
  },
};

export const WithIconAndCancel: Story = {
  args: {
    text: 'Filter',
    size: 'medium',
    showIcon: true,
    onCancel: () => {},
  },
};

export const Small: Story = {
  args: {
    text: 'Small Chip',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    text: 'Medium Chip',
    size: 'medium',
  },
};

export const Gray: Story = {
  args: {
    text: 'Gray Chip',
    variant: 'gray',
    size: 'medium',
  },
};

/** 우측 아이콘 + 클릭 (예: 캘린더 '오늘' 버튼) */
export const WithTrailingIcon: Story = {
  args: {
    text: '오늘',
    variant: 'gray',
    size: 'medium',
    trailingIcon: <ChevronRightSvg width={14} height={14} />,
    ariaLabel: '현재 달로 이동',
    onClick: () => {},
  },
};
