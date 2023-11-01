import React from 'react';
import configureStore from '../../../../store/store';
import mockState from '../../../../../test/data/mock-state.json';
import { renderWithProvider } from '../../../../../test/jest';
import { Footer } from '.';

const render = () => {
  const store = configureStore({
    metamask: {
      ...mockState.metamask,
    },
    confirm: {
      currentConfirmation: {
        msgParams: {
          from: '0x0dcd5d886577d5081b0c52e242ef29e70be3e7bc',
        },
      },
    },
  });

  return renderWithProvider(<Footer />, store);
};

describe('ConfirmFooter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', async () => {
    const { container } = render();
    expect(container).toMatchSnapshot();
  });

  it('renders the correct text', () => {
    const { getAllByRole, getByText } = render();
    expect(getAllByRole('button')[0]).toBeInTheDocument();
    expect(getAllByRole('button')[1]).toBeInTheDocument();
    expect(getByText('Confirm')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });
});
