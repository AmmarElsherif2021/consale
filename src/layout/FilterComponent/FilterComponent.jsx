import './FilterComponent.css';
import cancelIcon from '../../assets/cancel.svg';
const FilterComponent = ({ filterText, onFilter, onClear, placeHolder }) => {
  return (
    <div className='filter-component' >
      <input className="search-table input" id="search" type="text" aria-label="Search Input" value={filterText} onChange={onFilter} placeholder={placeHolder} />
      <button className='cancel' onClick={onClear}><img className='cancel-icon' src={cancelIcon} style={{ width: '3vw' }} /></button>

    </div>
  )
}
export default FilterComponent;
