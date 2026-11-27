import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import MonthPickerModal from './MonthPickerModal';

const meta: Meta<typeof MonthPickerModal> = {
  title: 'Components/Calendar/MonthPickerModal',
  component: MonthPickerModal,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
    // 모달이 화면 전체(fixed)를 덮어 Docs에서 겹치지 않도록 스토리별 iframe으로 렌더링
    docs: { story: { inline: false, iframeHeight: 320 } },
  },
  args: {
    isOpen: true,
    initialYearMonth: { year: 2026, month: 10 },
    onClose: fn(),
    onConfirm: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof MonthPickerModal>;

export const Default: Story = {};

/** 열면 현재 보고 있는 연/월이 채워져 있고, 바꾸기 전에는 변경하기 비활성 */
export const Prefilled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    expect(canvas.getByLabelText('연도')).toHaveValue('2026');
    expect(canvas.getByLabelText('월')).toHaveValue('10');
    expect(canvas.getByRole('button', { name: '변경하기' })).toBeDisabled();
  },
};

export const Confirm: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const monthInput = canvas.getByLabelText('월');
    const confirmButton = canvas.getByRole('button', { name: '변경하기' });

    await userEvent.clear(monthInput);
    expect(confirmButton).toBeDisabled();

    await userEvent.type(monthInput, '2');
    expect(confirmButton).toBeEnabled();

    await userEvent.click(confirmButton);
    expect(args.onConfirm).toHaveBeenCalledWith({ year: 2026, month: 2 });
  },
};

export const InvalidMonth: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const monthInput = canvas.getByLabelText('월');
    await userEvent.clear(monthInput);
    await userEvent.type(monthInput, '13');
    // 12를 넘는 값은 입력되지 않음
    expect(monthInput).toHaveValue('1');
  },
};
