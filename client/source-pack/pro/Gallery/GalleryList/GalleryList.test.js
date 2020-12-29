import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import checkPropTypes from 'check-prop-types';
import {
  findByTestAttr,
  checkProps,
  checkClass
} from '../../../../tests/utils';
import GalleryList from './GalleryList';

const setup = (props = {}) => shallow(<GalleryList {...props} icon='star' />);

describe('<GalleryList />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = setup();
  });

  test('renders', () => {
    const galleryList = findByTestAttr(wrapper, 'gallery-list');
    expect(galleryList.length).toBe(1);
  });

  test('renders without errors', () => {
    const div = document.createElement('div');
    ReactDOM.render(<GalleryList />, div);
  });

  test('does not throw warnings with expected props', () => {
    const expectedProps = {
      className: 'test',
      cols: 2,
      rows: 3,
      tag: 'li',
      elementClasses: 'test'
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
      wrapper = setup({ titleClasses: 'testTitleClassName' });

      checkClass(wrapper, 'testTitleClassName');
    });

    test('adds custom class passed as property', () => {
      wrapper = setup({ elementClasses: 'testElementClassName' });

      checkClass(wrapper, 'testElementClassName');
    });
  });
});
