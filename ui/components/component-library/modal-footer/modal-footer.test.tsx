import React from 'react';
import { getByTestId, render } from '@testing-library/react';

import { ModalFooter } from './modal-footer';

describe('ModalFooter', () => {
  it('should render ModalFooter without error', () => {
    const { getByTestId } = render(<ModalFooter data-testid="modal-footer" />);
    expect(getByTestId('modal-footer')).toBeDefined();
    expect(getByTestId('modal-footer')).toHaveClass('mm-modal-footer');
  });
  it('should match snapshot', () => {
    const { container } = render(<ModalFooter />);
    expect(container).toMatchSnapshot();
  });
  it('should render with and additional className', () => {
    const { getByTestId } = render(
      <ModalFooter data-testid="modal-footer" className="test-class" />,
    );
    expect(getByTestId('modal-footer')).toHaveClass('test-class');
  });
  it('should fire the onConfirm function when clicked and pass additional props to the confirm button', () => {
    const onConfirm = jest.fn();
    const { getByText, getByTestId } = render(
      <ModalFooter
        onConfirm={onConfirm}
        confirmButtonProps={{ 'data-testid': 'confirm-button' }}
      />,
    );
    getByText('Confirm').click();
    expect(onConfirm).toHaveBeenCalled();
    expect(getByTestId('confirm-button')).toBeDefined();
  });
  it('should fire the onCancel function when clicked and pass additional props to the cancel button', () => {
    const onCancel = jest.fn();
    const { getByText, getByTestId } = render(
      <ModalFooter
        onCancel={onCancel}
        cancelButtonProps={{ 'data-testid': 'cancel-button' }}
      />,
    );
    getByText('Cancel').click();
    expect(onCancel).toHaveBeenCalled();
    expect(getByTestId('cancel-button')).toBeDefined();
  });
});
