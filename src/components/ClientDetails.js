import React, { useState } from 'react';
import axios from 'axios';

function ClientDetails({ client, addPayment, deletePayment, editPayment }) {
  console.log('Client details prop:', client); // Debug log
  
  const [startMonth, setStartMonth] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endYear, setEndYear] = useState('');
  const [amount, setAmount] = useState('');
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const startDate = new Date(startYear, startMonth - 1);
    const endDate = new Date(endYear, endMonth - 1);
    const months = [];

    while (startDate <= endDate) {
      months.push(startDate.toLocaleString('default', { month: 'long' }) + ' ' + startDate.getFullYear());
      startDate.setMonth(startDate.getMonth() + 1);
    }

    const paymentData = {
      startMonth,
      startYear,
      endMonth,
      endYear,
      amount,
      clientId: client.id,
      months,
    };

    if (editingPaymentId) {
      editPayment(editingPaymentId, paymentData);
      setEditingPaymentId(null);
    } else {
      addPayment(paymentData);
    }

    setStartMonth('');
    setStartYear('');
    setEndMonth('');
    setEndYear('');
    setAmount('');
  };

  const handleEditClick = (payment) => {
    setStartMonth(payment.startMonth);
    setStartYear(payment.startYear);
    setEndMonth(payment.endMonth);
    setEndYear(payment.endYear);
    setAmount(payment.amount);
    setEditingPaymentId(payment.id);
  };

  const handleReceiptClick = (paymentId) => {
    axios.get(`http://localhost:3001/api/payments/receipt/${paymentId}`)
      .then(response => {
        const receiptUrl = `http://localhost:3001${response.data.url}`;
        window.open(receiptUrl); // Open the receipt in a new tab
      })
      .catch(error => {
        console.error('There was an error generating the receipt!', error);
      });
  };
  

  return (
    <div className="client-details">
      <h2>{client.firstName} {client.lastName} Details</h2>
      <p>Number: {client.number}</p>
      <p>Branch: {client.branch}</p>
      <h3>Payments</h3>
      <ul>
        {client.Payments.map(payment => (
          <li key={payment.id}>
            {payment.startMonth}/{payment.startYear} to {payment.endMonth}/{payment.endYear} - {payment.amount} MAD
            <button onClick={() => handleEditClick(payment)}>Edit</button>
            <button className="danger" onClick={() => deletePayment(payment.id)}>Delete</button>
            <button onClick={() => handleReceiptClick(payment.id)}>Receipt</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={startMonth}
          onChange={(e) => setStartMonth(e.target.value)}
          placeholder="Start Month (1-12)"
          required
        />
        <input
          type="number"
          value={startYear}
          onChange={(e) => setStartYear(e.target.value)}
          placeholder="Start Year"
          required
        />
        <input
          type="number"
          value={endMonth}
          onChange={(e) => setEndMonth(e.target.value)}
          placeholder="End Month (1-12)"
          required
        />
        <input
          type="number"
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
          placeholder="End Year"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <button type="submit">{editingPaymentId ? 'Update Payment' : 'Add Payment'}</button>
      </form>
    </div>
  );
}

export default ClientDetails;
