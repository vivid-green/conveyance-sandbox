import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import checkPropTypes from 'check-prop-types';
import { findByTestAttr, checkProps, checkClass } from '../../../tests/utils';
import Gallery from './Gallery';

const setup = (props = {}) => shallow(<Gallery {...props} icon='star' />);

describe('<Gallery />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = setup();
  });

  test('renders', () => {
    const gallery = findByTestAttr(wrapper, 'gallery');
    expect(gallery.length).toBe(1);
  });

  test('renders without errors', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Gallery />, div);
  });

  test('does not throw warnings with expected props', () => {
    const expectedProps = {
      cellHeight: 5,
      className: 'test',
      cols: 3,
      spacing: 25,
      tag: 'ul'
    };

    wrapper = setup(expectedProps);
    checkProps(wrapper, expectedProps);
  });

  test('does not throw warnings without props(except `icon`)', () => {
    checkPropTypes(wrapper);
  });

  test('adds custom attributes passed as property', () => {
    wrapper = setup({ customAttr: 'custom' });

    expect(wrapper.props().customAttr).toBe('custom');
    expect(wrapper.find('[customAttr="custom"]').length).toBe(1);
  });

  describe('sets classes', () => {
    test('adds custom class passed as property', () => {
      wrapper = setup({ className: 'testClassName' });

      checkClass(wrapper, 'testClassName');
    });
  });
});
