import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from '../../../Select';
import SelectInput from '../../../Select/SelectInput';
import SelectOptions from '../../../Select/SelectOptions';
import SelectOption from '../../../Select/SelectOption';

const DataTableSelect = ({ value, onChange, entries, label, barReverse }) => (
  <div
    data-test='datatable-select'
    className={classNames(
      'mdb-datatable-length',
      'd-flex',
      'flex-row',
      'align-items-center',
      barReverse && 'justify-content-end'
    )}
  >
    <label className='p-0 m-0' style={{ minWidth: 100, fontSize: '.9rem' }}>
      {label}
    </label>
    <Select getValue={onChange} className='my-0'>
      <SelectInput
        selected={value}
        className='my-0'
        style={{ maxWidth: 35, borderBottom: 'none', fontSize: '.9rem', paddingLeft: 5, paddingBottom: 2 }}
      />
      <SelectOptions>
        {entries.map((entry, index) => (
          <SelectOption checked={index === 0} key={entry} value={entry}>
            {entry}
          </SelectOption>
        ))}
      </SelectOptions>
    </Select>
  </div>
);

DataTableSelect.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.number).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  barReverse: PropTypes.bool
};

export default DataTableSelect;
export { DataTableSelect as MDBDataTableSelect };
