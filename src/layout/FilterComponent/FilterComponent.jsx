import './FilterComponent.css';
import cancelIcon from '../../assets/cancel.svg';
const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <div className='filter-component'>

    <input className="search-table input" id="search" type="text" placeholder="ابحث باسم العميل" aria-label="Search Input" value={filterText} onChange={onFilter} />
    <button className='cancel' onClick={onClear}><img className='cancel-icon' src={cancelIcon} /></button>

  </div>
);
export default FilterComponent;