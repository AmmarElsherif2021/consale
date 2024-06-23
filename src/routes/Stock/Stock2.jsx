import { useState, useEffect, useMemo } from 'react';
import { CSVLink } from 'react-csv';
import FilterComponent from '../../layout/FilterComponent/FilterComponent';
import './Stock.css';
import ItemPop from '../../layout/popups/ItemPop/ItemPop';
import DelItemPop from '../../layout/popups/DelItemPop/DelItemPop';
import AddItemPop from '../../layout/popups/AddItemPop/AddItemPop22';
import addPlus from '../../assets/add-plus.svg'
import delIcon from '../../assets/del.svg';
import editIcon from '../../assets/edit.svg';
import refresh from '../../assets/refresh.svg';
import { useDb } from '../../stockContext';
import { useLang } from '../../langContext';
//searchbar and teble import
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';

const Export = ({ onExport }) => (
    <CSVLink data={onExport()} filename={'stockData.csv'} className='export-link'>
        <small>انسخ بيانات المخزن</small>
    </CSVLink>
);

function Stock() {
    const { db, items, billsRecords, isLoading, setItems } = useDb();
    const [stockData, setStockData] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [itemPop, setItemPop] = useState({}); // Item edit popup state
    const [delItemPop, setDelItemPop] = useState({}); // Item delete popup state
    const [addedItemPop, setAddedItemPop] = useState({}); // Item add popup state
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    let { lang } = useLang();
    //Get the totals of the stock
    const [stockTotal, setStockTotal] = useState(0);
    const [stockSellPrice, setStockSellPrice] = useState(0)


    //fetch stock
    const fetchData = async () => {
        try {
            const result = await db.select("SELECT * FROM items_table");
            //setItems(result)
            setStockData(result);
        } catch (error) {
            console.error('Error fetching stock data:', error);
        }
    };


    // add item
    async function addItem(item) {
        try {
            // Check if an item with the same ID already exists
            const existingItem = await db.select(`
        SELECT id FROM items_table WHERE id = ?;
      `, [item.id]);

            if (existingItem.length > 0) {
                console.log(`Item with ID ${item.id} already exists. Skipping insertion.`);
                return; // Exit early if item exists
            }

            // Insert the new item into items_table
            await db.execute(`
        INSERT INTO items_table (id, name, description, unit, price_unit, price_import, quantity_stock)
        VALUES (?,?,?,?,?,?,?);
      `, [item.id, item.name, item.description, item.unit, item.price_unit, item.price_import, item.quantity_stock]);

            console.log('Item added successfully!');

        } catch (error) {
            console.error('Error adding item:', error);
        }
    }



    //modify rcord
    async function updateItem(itemId, newPrice, stockQty, priceStore) {

        try {
            await db.execute(`
      UPDATE items_table
      SET price_unit = ?
      ,quantity_stock=?
      ,price_import=?
      WHERE id = ?;
    `, [newPrice, stockQty, priceStore, itemId]);
            console.log('Item price updated successfully!');
        } catch (error) {
            console.error('Error updating item price:', error);
        }
    }

    //delete record
    async function deleteItem(itemId) {
        try {
            await db.execute(`
      DELETE FROM items_table
      WHERE id = ?;
    `, [itemId]);
            console.log('Item deleted successfully!');

        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }





    //.............................................................................................

    const handleOpenEdit = (e, iid) => {
        // Stop default form submission if applicable
        //fetchData();
        e.preventDefault();
        const item = stockData.filter((x) => x.id
            == iid)[0]; // Find the correct item

        if (item) {
            setItemPop({ ...item }); // Set popup state with item data
        } else {
            console.warn('Item not found:', iid); // Handle non-existent item
        }
    };

    useEffect(() => console.log(`ItemPop ----->${itemPop}`), [itemPop]);



    // cancel item pop:
    const cancelItemPop = () => {
        setItemPop({})
        console.log(`ItemPop ----->${{ ...itemPop }}`)
    };
    // Edit item (handle data validation, error handling)
    const handleItemEdit = async (iid, qty, p, pStore) => {
        if (!itemPop.id || itemPop.id !== iid) {
            console.warn('Invalid item ID or popup mismatch:', iid);
            return; // Prevent unintended updates
        }

        try {
            // Validate quantity and price data (adapt validation checks if needed)
            if (p < 0) {
                throw new Error('Invalid quantity or price (non-negative expected)');
            }

            //modify db
            updateItem(iid, p, qty, pStore);

            setItemPop({}); // Close popup

            console.log('Item updated successfully');
        } catch (error) {
            console.error('Error updating item:', error);
            // Handle update errors gracefully, e.g., display user-friendly messages
        }
        cancelItemPop();
    };

    const handleItemDel = (e, iid) => {
        e.preventDefault
        let item = items.filter((x) => x.id && x.id == iid)[0]
        setDelItemPop({ ...item })
    };
    // delete item pop:
    const cancelDelItemPop = () => {
        setDelItemPop({})
        console.log(`ItemPop ----->${{ ...delItemPop }}`)
    };
    //Delete record:

    const confirmDelItem = (e, iid) => {
        e.preventDefault();
        deleteItem(iid);
        //const newStock = stockData.filter((x) => x.id != iid);

        setDelItemPop(() => { });
        setStockData(items);
    }
    useEffect(() => delItemPop && delItemPop.id && console.log(`del item pop${delItemPop.id}`), [delItemPop]);





    // Add item pop:|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||


    const cancelAddItemPop = () => {
        setAddedItemPop({})
        setStockData([...items]);
        console.log(`AddedItemPop ----->${{ ...addedItemPop }}`)
    };


    //generate Id
    function generateRandomId() {
        return Math.random().toString(36).substring(2, 15);
    }



    const handleAddItemClick = (e) => {

        const newId = generateRandomId();
        setAddedItemPop({
            id: newId.toString(),
            name: '',
            description: '',
            quantity_stock: 0,
            price_unit: 0,
            price_import: 0,
            unit: '',

        })
    }

    //confirm add submit............................................................................................
    const handleAddSubmit = (e, newAdded) => {
        // e.preventDefault();
        // Destructure the id out of newAdded
        const { id, ...restOfNewAdded } = newAdded;
        // Update addedItemPop state
        if (id && restOfNewAdded.name && restOfNewAdded.quantity_stock && restOfNewAdded.price_unit && restOfNewAdded.price_import && restOfNewAdded.unit) {
            setAddedItemPop((prev) => ({
                id: prev.id,
                ...restOfNewAdded
            }));
            addItem({ ...newAdded });

            //setStockData(items);
            // Reset addedItemPop state
            setAddedItemPop({})
            fetchData()

        }
    };

    useEffect(() => {
        fetchData();
    }, [addedItemPop, itemPop, delItemPop]);



    //trigger changes
    useEffect(() => { console.log('refresh') }, [items, itemPop, stockData, addedItemPop]);

    //cummulatives of the stock
    useEffect(() => {
        setStockTotal(() => stockData.reduce((sum, obj) => (Number(obj.quantity_stock) * Number(obj.price_import)) + sum, 0));

        console.log(`stokTotal activated`)
    }, [stockData]);
    useEffect(() => {
        setStockSellPrice(() => stockData.reduce((sum, obj) => (Number(obj.price_unit * obj.quantity_stock)) + sum, 0));

        console.log(`stockSellPrice`)
    }, [stockData])
    //Search ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

    const filteredItems = stockData && stockData.length && stockData.filter(
        item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
    );

    const handleClear = () => {
        if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
        }
    };
    const customStyles = {
        headCells: {
            style: {
                fontWeight: '800',
                borderBottom: 'dotted'
            },
        },
    };


    const handleExport = () => {
        const csvData = stockData.map(({ id, ...rest }) => rest);
        return csvData;
    };

    const actionsMemo = useMemo(() => (
        <CSVLink data={handleExport()} filename={"my-data.csv"}>

            {lang == 'ar' ? 'تنزيل' : 'Save'}

        </CSVLink>
    ), []);


    const subHeaderComponentMemo = useMemo(() => {

        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <div className='filter'><FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} placeHolder={'ابحث باسم الصنف'} /></div>
        );
    }, [filterText, resetPaginationToggle]);

    // Define columns

    // Define columns
    const columnDefs = [
        { headerName: 'ID', field: 'id', Width: 99 },
        { headerName: lang == 'ar' ? 'اسم' : 'Name', field: 'name', width: 99 },
        { headerName: lang == 'ar' ? 'وصف' : 'Description', field: 'description', width: 99 },
        { headerName: lang == 'ar' ? 'وحدة القياس' : 'Unit', field: 'unit', width: 99 },
        { headerName: lang == 'ar' ? 'سعر المخزن' : 'Imported price', field: 'price_import', width: 99 },
        { headerName: lang == 'ar' ? 'سعر الوحدة' : 'Unit price', field: 'price_unit', width: 99 },
        { headerName: lang == 'ar' ? 'الكميةالمتاحة' : 'Stock quantity', field: 'quantity_stock', width: 99 },
        {
            headerName: '',
            field: 'actions',
            width: 90,
            cellRenderer: params => (
                <div>
                    <button
                        className='table-btn edit'
                        onClick={(e) => handleOpenEdit(e, params.data.id)}
                    >
                        <img src={editIcon} style={{ width: "20px" }} />
                    </button>

                </div>
            ),
        },
        {
            headerName: '',
            field: 'actions',
            width: 90,
            cellRenderer: params => (
                <div>

                    <button
                        className='table-btn delete'
                        onClick={(e) => handleItemDel(e, params.data.id)}
                    >
                        <img src={delIcon} style={{ width: "20px" }} />
                    </button>
                </div>
            ),
        }
    ];



    return (
        <div className="route-content stock">

            {itemPop && JSON.stringify(itemPop) != "{}" ?
                <ItemPop cancelItemPop={cancelItemPop} id={itemPop.id}
                    img={itemPop.image} name={itemPop.name} description={itemPop.description} unit={itemPop.unit}
                    priceUnit={itemPop.price_unit} priceStore={itemPop.price_import} qtyStock={itemPop.quantity_stock} handleItemEdit={handleItemEdit} />
                :
                <div></div>
            }


            {
                delItemPop && JSON.stringify(delItemPop) != "{}" ? <DelItemPop confirmDelItem={confirmDelItem}
                    cancelDelItemPop={cancelDelItemPop} name={delItemPop.name} id={delItemPop.id} /> : <div></div>
            }


            {
                addedItemPop && addedItemPop.id ?
                    <AddItemPop
                        addRecord={addItem}
                        handleAddSubmit={handleAddSubmit}
                        cancelAddItemPop={cancelAddItemPop}
                        generateRandomId={generateRandomId}
                    /> : <div></div>
            }
            <div className='header'>
                <h1>{lang == 'ar' ? 'ادارة المخزن' : ' Stock Management'} </h1>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '40vw' }}>
                    <button className='add-item-btn' onClick={(e) => handleAddItemClick(e)}>
                        <img className='add-img' src={addPlus} />
                    </button>

                    <button className='refresh-btn' onClick={() => { fetchData() }}>
                        <img className='refresh' src={refresh} />
                    </button>

                    <button className='export-btn' >
                        {actionsMemo}
                    </button>
                </div>
                <div className="filter-component">
                    <span>{stockTotal}: <small>{lang == 'ar' ? 'اجمالي قيم الشراء' : 'Total imported prices'}</small></span>
                    |

                    <span>{stockSellPrice}: <small>{lang == 'ar' ? 'اجمالي قيم البيع' : 'Total exported prices'}</small></span>
                </div>

                <div className="filter-component">
                    <FilterComponent
                        onFilter={e => setFilterText(e.target.value)}
                        onClear={handleClear}
                        filterText={filterText}
                        placeHolder={lang == 'ar' ? 'ابحث باسم الصنف' : 'Search by name'}
                    />
                </div>
            </div>

            <AgGridReact
                className='grid'

                rowData={filteredItems}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={7}
                paginationAutoPageSize={resetPaginationToggle}
                subHeaderComponent={subHeaderComponentMemo}
                rowSelection="multiple"
                rowHeight={55}
                headerHeight={40}

                domLayout='autoHeight'
                onGridReady={actionsMemo}
            />



        </div>
    );
}
export default Stock;