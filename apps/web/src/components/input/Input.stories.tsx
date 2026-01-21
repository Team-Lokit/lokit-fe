import Input from '@/components/input/Input';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['input', 'search', 'textarea'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    name: 'default-input',
    placeholder: '텍스트를 입력하세요',
    max: 100,
  },
};

export const Search: Story = {
  args: {
    name: 'search-input',
    type: 'search',
    placeholder: '검색어를 입력하세요',
    max: 50,
  },
};

export const TextArea: Story = {
  args: {
    name: 'textarea-input',
    type: 'textarea',
    placeholder: '내용을 입력하세요',
    max: 500,
  },
};

export const WithError: Story = {
  args: {
    name: 'error-input',
    placeholder: '텍스트를 입력하세요',
    isError: true,
    errorMessage: '필수 입력 항목입니다.',
  },
};

export const SearchWithError: Story = {
  args: {
    name: 'search-error-input',
    type: 'search',
    placeholder: '검색어를 입력하세요',
    isError: true,
    errorMessage: '검색어를 입력해주세요.',
  },
};

export const TextAreaWithError: Story = {
  args: {
    name: 'textarea-error-input',
    type: 'textarea',
    placeholder: '내용을 입력하세요',
    isError: true,
    errorMessage: '최소 10자 이상 입력해주세요.',
  },
};
