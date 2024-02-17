import './FilterComponent.css';
import cancelIcon from '../../assets/cancel.svg';
const FilterComponent = ({ filterText, onFilter, onClear }) => {
  return (
    <div className='filter-component' >
      <input className="search-table input" id="search" type="text" aria-label="Search Input" value={filterText} onChange={onFilter} />
      <button className='cancel' onClick={onClear}><img className='cancel-icon' src={cancelIcon} /></button>

    </div>
  )
}
export default FilterComponent;
