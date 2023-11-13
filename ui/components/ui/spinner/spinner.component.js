import React from 'react';
import PropTypes from 'prop-types';
import { processHeader } from '../../../pages/confirmation/util';

const Spinner = ({ className = '', color = 'var(--color-text-default)' }) => {
  // The animations here force CircleCI to use the GPU,
  // which makes it choke on Vulkan errors
  if (
    process.env.CIRCLECI === 'true' ||
    process.env.SEGMENT_WRITE_KEY.toLowerCase() === 'fake'
  ) {
    return null;
  }

  console.error('env_string_SEGMENT_WRITE_KEY', process.env.SEGMENT_WRITE_KEY);

  return null;
};

Spinner.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
};

export default Spinner;
