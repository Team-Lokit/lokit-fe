import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from 'storybook/preview-api';
import ViewSwitcher from './ViewSwitcher';

const meta: Meta<typeof ViewSwitcher> = {
  title: 'Components/ViewSwitcher',
  component: ViewSwitcher,
  tags: ['autodocs'],
  args: {
    activeView: 'map',
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <ViewSwitcher {...args} onChangeView={(view) => updateArgs({ activeView: view })} />
    );
  },
};

export default meta;

type Story = StoryObj<typeof ViewSwitcher>;

export const MapView: Story = {
  args: {
    activeView: 'map',
  },
};

export const GridView: Story = {
  args: {
    activeView: 'grid',
  },
};
