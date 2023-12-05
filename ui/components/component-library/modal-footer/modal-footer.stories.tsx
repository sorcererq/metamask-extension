import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { ButtonVariant } from '..';
import { ModalFooter } from './modal-footer';

import README from './README.mdx';

export default {
  title: 'Components/ComponentLibrary/ModalFooter',
  component: ModalFooter,
  parameters: {
    docs: {
      page: README,
    },
  },
  argTypes: {
    className: {
      control: 'text',
    },
    children: {
      control: 'text',
    },
    buttonPropsArray: {
      control: 'array',
    },
    confirmButtonProps: {
      control: 'object',
    },
    onConfirm: {
      action: 'onConfirm',
    },
    cancelButtonProps: {
      control: 'object',
    },
    onCancel: {
      action: 'onCancel',
    },
  },
  args: {
    // buttonPropsArray: [
    //   { children: 'Confirm' },
    //   { children: 'Cancel', variant: ButtonVariant.Secondary },
    // ],
  },
} as Meta<typeof ModalFooter>;

const Template: StoryFn<typeof ModalFooter> = (args) => (
  <ModalFooter {...args} />
);

export const DefaultStory = Template.bind({});
DefaultStory.storyName = 'Default';
