import React from 'react';

import type {
  StyleUtilityProps,
  PolymorphicComponentPropWithRef,
} from '../box';
import type { ButtonProps } from '../button';

export interface ModalFooterStyleUtilityProps extends StyleUtilityProps {
  /**
   * Additional className to add to the ModalFooter
   */
  className?: string;
  /**
   * The custom content of the ModalFooter
   */
  children?: React.ReactNode;
  /**
   * Array of buttons that will be displayed in the footer
   */
  buttonPropsArray?: ButtonProps<'button'>[];
  /**
   * The confirm button click event handler if this exists the confirm button will be displayed
   */
  onConfirm?: () => void;
  /**
   * Additional props to pass to the confirm button
   */
  confirmButtonProps?: ButtonProps<'button'>;
  /**
   * The cancel button click event handler if this exists the cancel button will be displayed
   */
  onCancel?: () => void;
  /**
   * Additional props to pass to the cancel button
   */
  cancelButtonProps?: ButtonProps<'button'>;
}

export type ModalFooterProps<C extends React.ElementType> =
  PolymorphicComponentPropWithRef<C, ModalFooterStyleUtilityProps>;

export type ModalFooterComponent = <C extends React.ElementType = 'span'>(
  props: ModalFooterProps<C>,
) => React.ReactElement | null;
