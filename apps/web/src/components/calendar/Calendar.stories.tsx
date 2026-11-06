import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import Calendar from './Calendar';

const photo = (seed: number) => `https://picsum.photos/seed/lokit-${seed}/48/56`;

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360, backgroundColor: '#000' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    yearMonth: { year: 2026, month: 10 },
    todayKey: '2026-10-18',
    thumbnails: {
      '2026-10-02': photo(1),
      '2026-10-05': photo(2),
      '2026-10-09': photo(3),
      '2026-10-11': photo(4),
      '2026-10-17': photo(5),
      '2026-10-18': photo(6),
      '2026-10-24': photo(7),
    },
    onClickMonth: fn(),
    onClickDate: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    thumbnails: {},
  },
};

/** 커플이 된 날(2026-07-10)을 1일째로 계산해 10/17이 100일 */
export const HundredDays: Story = {
  args: {
    firstMetDate: '2026-07-10',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('💗100')).toBeInTheDocument();
    expect(
      canvas.getByLabelText('2026년 10월 17일, 100일 기념일, 사진 있음'),
    ).toBeInTheDocument();
  },
};

/** 같은 월·일에 매년 N주년 */
export const FirstYear: Story = {
  args: {
    firstMetDate: '2025-10-17',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('💗1주년')).toBeInTheDocument();
  },
};

/** 오늘이 포함되지 않은 달 (6주) */
export const SixWeeks: Story = {
  args: {
    yearMonth: { year: 2026, month: 8 },
    thumbnails: { '2026-08-15': photo(8) },
  },
};

export const ClickDate: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByLabelText('2026년 10월 18일, 사진 있음'));
    expect(args.onClickDate).toHaveBeenCalledWith('2026-10-18');
  },
};

export const ClickMonth: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /2026 10월/ }));
    expect(args.onClickMonth).toHaveBeenCalled();
  },
};
