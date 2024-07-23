import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import ClientDetails from './components/ClientDetails';
import './App.css';

// Set the app root element for react-modal
Modal.setAppElement('#root');

function App() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/api/clients')
      .then(response => {
        setClients(response.data);
      });
  }, []);

  const addClient = (client) => {
    axios.post('http://localhost:3001/api/clients', client)
      .then(response => {
        setClients([...clients, response.data]);
      });
  };

  const selectClient = (client) => {
    console.log('Selecting client:', client); // Debug log
    axios.get(`http://localhost:3001/api/clients/${client.id}`)
      .then(response => {
        console.log('Client details:', response.data); // Debug log
        setSelectedClient(response.data);
        setModalIsOpen(true); // Open the modal when a client is selected
      })
      .catch(error => {
        console.error('There was an error selecting the client!', error);
      });
  };

  const addPayment = (payment) => {
    axios.post('http://localhost:3001/api/payments', payment)
      .then(response => {
        setSelectedClient({
          ...selectedClient,
          Payments: [...selectedClient.Payments, response.data]
        });
      });
  };

  const deletePayment = (paymentId) => {
    axios.delete(`http://localhost:3001/api/payments/${paymentId}`)
      .then(() => {
        setSelectedClient({
          ...selectedClient,
          Payments: selectedClient.Payments.filter(payment => payment.id !== paymentId)
        });
      });
  };

  const editPayment = (paymentId, updatedPayment) => {
    axios.put(`http://localhost:3001/api/payments/${paymentId}`, updatedPayment)
      .then(response => {
        setSelectedClient({
          ...selectedClient,
          Payments: selectedClient.Payments.map(p => 
            p.id === paymentId ? response.data : p
          )
        });
      })
      .catch(error => {
        console.error('There was an error editing the payment!', error);
      });
  };

  const editClient = (clientId, editedClient) => {
    axios.put(`http://localhost:3001/api/clients/${clientId}`, editedClient)
      .then(response => {
        setClients(clients.map(client => 
          client.id === clientId ? response.data : client
        ));
        if (selectedClient && selectedClient.id === clientId) {
          setSelectedClient(response.data);
        }
      })
      .catch(error => {
        console.error('There was an error editing the client!', error);
        alert(error.response?.data?.error || 'There was an error editing the client!');
      });
  };

  return (
    <div className="App">
      <h1>Client Dashboard</h1>
      <ClientForm addClient={addClient} />
      <ClientList clients={clients} selectClient={selectClient} setClients={setClients} editClient={editClient} />
      
      {/* Modal for ClientDetails */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Client Details"
        className="modal"
        overlayClassName="overlay"
      >
        <button className="close" onClick={() => setModalIsOpen(false)}>Close</button>
        {selectedClient && (
          <ClientDetails 
            client={selectedClient} 
            addPayment={addPayment} 
            deletePayment={deletePayment} 
            editPayment={editPayment} 
          />
        )}
        
      </Modal>
    </div>
  );
}

export default App;
