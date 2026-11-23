import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import Calendar from './Calendar';

const photo = (seed: number) => `https://picsum.photos/seed/lokit-${seed}/48/56`;

const days = {
  '2026-10-02': { thumbnail: photo(1) },
  '2026-10-05': { thumbnail: photo(2) },
  '2026-10-09': { thumbnail: photo(3) },
  '2026-10-11': { thumbnail: photo(4) },
  '2026-10-17': { thumbnail: photo(5) },
  '2026-10-18': { thumbnail: photo(6) },
  '2026-10-24': { thumbnail: photo(7) },
};

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
    days,
    onClickMonth: fn(),
    onClickDate: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    days: {},
  },
};

/** 100일 단위 기념일 */
export const HundredDays: Story = {
  args: {
    days: { ...days, '2026-10-17': { thumbnail: photo(5), anniversary: '100' } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('💗100')).toBeInTheDocument();
    expect(
      canvas.getByLabelText('2026년 10월 17일, 100일 기념일, 사진 있음'),
    ).toBeInTheDocument();
  },
};

/** N주년 기념일 */
export const FirstYear: Story = {
  args: {
    days: { ...days, '2026-10-17': { thumbnail: photo(5), anniversary: '1주년' } },
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
    days: { '2026-08-15': { thumbnail: photo(8) } },
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
