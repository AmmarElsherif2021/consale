import './BillPrint.css';
import { useState } from 'react';

const BillPrint = (props) => {
  const [content, setContent] = useState('This is the content that will be printed.');
  return (
    <div>
      <h1>Bill</h1>
      <h3>BID:{' '} {props.bid}</h3>
      <h4>Customer Name:{' '} {props.cName}- {' '} Phone:{' '} {props.phone}</h4>
      <h4>History:{' '} {props.history}</h4>
      <table>
        <tr>
          <td>Name</td>
          <td>Required Quantity</td>
          <td>Unit</td>
          <td>Price/Unit</td>
          <td>Total</td>
        </tr>
        {props.items.map((x) => (
          <tr>
            <td>{x.name}</td>
            <td>{x.req_qty}</td>
            <td>{x.unit}</td>
            <td>${x.price_unit}</td>
            <td>${x.total}</td>
          </tr>
        ))}
        <tr>
          <td>Bill total</td><td>{props.billTotal}</td> <td>paid</td><td>{props.paid}</td>
        </tr>
        <tr><td>Debt</td><td>{props.debt}</td></tr>
      </table>
      <h4>Bill operations history -------------------------- </h4>

      {props.records.map((y) => (
        <table>
          <tr>
            <th>History of op.</th><th>Debt</th><th>Paid</th>
          </tr>
          <tr>
            <td>{y.history}</td>{y.debt}<td>{y.paid}</td>
          </tr>
          <tr><th>Added items</th></tr>

          <tr><th>name</th><th>qty</th><th>total</th></tr>
          {y.added_items.map((z) => <tr><td>{z.name}</td><td>{z.req_qty}</td><td>{z.total}</td></tr>)}
          <tr><th>Restored items</th></tr>
          <tr><th>name</th><th>qty</th><th>total</th></tr>
          <tr><td>{y.restored_items.map((z) => <tr><td>{z.name}</td><td>{z.req_qty}</td><td>{z.total}</td></tr>)}</td></tr>
        </table>
      ))}
    </div>
  );
};
export default BillPrint;