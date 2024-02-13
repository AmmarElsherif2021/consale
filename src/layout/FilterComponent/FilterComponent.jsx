import './FilterComponent.css';
import cancelIcon from '../../assets/cancel.svg';
const FilterComponent = (props) => {
  const { filterText, onFilter, onClear } = props;

  (

    <div className='filter-component'>

      <input className="search-table input" id="search" type="text" placeholder={props.placeHolder} aria-label="Search Input" value={filterText} onChange={onFilter} />
      <button className='cancel' onClick={onClear}><img className='cancel-icon' src={cancelIcon} /></button>

    </div>
  );
}
export default FilterComponent;
