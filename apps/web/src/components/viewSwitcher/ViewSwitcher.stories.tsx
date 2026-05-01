import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, userEvent, within } from 'storybook/test';
import ViewSwitcher from './ViewSwitcher';

const meta: Meta<typeof ViewSwitcher> = {
  title: 'Components/ViewSwitcher',
  component: ViewSwitcher,
  tags: ['autodocs'],
  args: {
    activeView: 'map',
    onChangeView: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <ViewSwitcher
        {...args}
        onChangeView={(view) => {
          args.onChangeView(view);
          updateArgs({ activeView: view });
        }}
      />
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

export const SwitchToGrid: Story = {
  args: {
    activeView: 'map',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const gridTab = canvas.getByLabelText('격자보기');
    await userEvent.click(gridTab);
    expect(args.onChangeView).toHaveBeenCalledWith('grid');
  },
};

export const SwitchToMap: Story = {
  args: {
    activeView: 'grid',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const mapTab = canvas.getByLabelText('지도보기');
    await userEvent.click(mapTab);
    expect(args.onChangeView).toHaveBeenCalledWith('map');
  },
};
