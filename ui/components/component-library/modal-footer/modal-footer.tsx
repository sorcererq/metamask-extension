import React from 'react';
import classnames from 'classnames';
import {
  BlockSize,
  Display,
  FlexWrap,
} from '../../../helpers/constants/design-system';
import { Box, Button, ButtonSize } from '..';
import type { PolymorphicRef, BoxProps } from '../box';
import type { ButtonProps } from '../button';
import { ButtonVariant } from '../button';

import { ModalFooterProps, ModalFooterComponent } from './modal-footer.types';

export const ModalFooter: ModalFooterComponent = React.forwardRef(
  <C extends React.ElementType = 'div'>(
    {
      className = '',
      children,
      buttonPropsArray,
      confirmButtonProps,
      onConfirm,
      cancelButtonProps,
      onCancel,
      ...props
    }: ModalFooterProps<C>,
    ref?: PolymorphicRef<C>,
  ) => (
    <Box
      className={classnames('mm-modal-footer', className)}
      ref={ref}
      paddingLeft={4}
      paddingRight={4}
      paddingBottom={4}
      paddingTop={2}
      display={Display.Grid}
      gap={4}
      // flexWrap={FlexWrap.Wrap}
      {...(props as BoxProps<C>)}
    >
      {children}
      {onCancel && (
        <Button
          onClick={onCancel}
          children="CancelCancelCancelCancelCancelCancelCancel"
          variant={ButtonVariant.Secondary}
          block
          {...(cancelButtonProps as ButtonProps<'button'>)}
          size={ButtonSize.Lg} // TODO: There is a type issue with using variant, size and spreading props after size
        />
      )}
      {onConfirm && (
        <Button
          size={ButtonSize.Lg}
          onClick={onConfirm}
          children="Confirm"
          block
          {...confirmButtonProps}
        />
      )}
      {buttonPropsArray &&
        buttonPropsArray.map(
          (buttonProp: ButtonProps<'button'>, index: number) => (
            <Button key={index} size={ButtonSize.Lg} {...buttonProp} />
          ),
        )}
    </Box>
  ),
);

export default ModalFooter;
