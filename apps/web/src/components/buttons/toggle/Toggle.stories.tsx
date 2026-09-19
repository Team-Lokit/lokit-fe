import type { Meta, StoryObj } from '@storybook/react';
import Toggle from '@/components/buttons/toggle/Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Checked: Story = {
  args: {
    checked: true,
    onChange: () => {},
  },
};

export const UnChecked: Story = {
  args: {
    checked: false,
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    checked: true,
    disabled: true,
    onChange: () => {},
  },
};
