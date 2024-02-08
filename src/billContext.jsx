import { createContext,useState,useContext } from "react";
// Create a context object with a default value
export const BillContext = createContext({});


export const useBill = () => {
  const { newBill, setNewBill } = useContext(BillContext);
  return { newBill, setNewBill };
};


// Create a context provider component that uses the custom hook
export const BillProvider=({ children })=> {
  // Use the custom hook to get the newBill state 
  const [newBill, setNewBill] = useState({
    bid: ``,
    c_name: "",
    c_phone: "",
    b_total: 0,
    discount: 0,
    items: [],
    paid:0,
    debt: 0,
    date:'',
    records: [
      {
        date: '',
        paid: 0,
        debt: 0,
        added_items: [],
        restored_items: [],
      },
    ],
  })
  // Return the context provider component with the context value
  return (
    <BillContext.Provider value={{ newBill,setNewBill }}>
      {children}
    </BillContext.Provider>
  );
}