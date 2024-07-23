import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function ClientList({ clients, selectClient, setClients, editClient }) {
  const [search, setSearch] = useState('');
  const [clientData, setClientData] = useState({
    firstName: '',
    lastName: '',
    number: '',
    branch: 'TSDI',
  });
  const [editingClientId, setEditingClientId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [unpaidClients, setUnpaidClients] = useState([]);

  const filteredClients = clients.filter(client => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      client.number.includes(search)
    );
  });

  const handleDelete = (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      axios.delete(`http://localhost:3001/api/clients/${clientId}`)
        .then(() => {
          setClients(clients.filter(client => client.id !== clientId));
        })
        .catch(error => {
          console.error('There was an error deleting the client!', error);
        });
    }
  };

  const handleEditClick = (client) => {
    setClientData({
      firstName: client.firstName,
      lastName: client.lastName,
      number: client.number,
      branch: client.branch
    });
    setEditingClientId(client.id);
  };

  const handleSave = () => {
    if (editingClientId) {
      editClient(editingClientId, clientData);
      setEditingClientId(null);
      setClientData({
        firstName: '',
        lastName: '',
        number: '',
        branch: 'TSDI',
      });
    }
  };

  const openUnpaidClientsModal = () => {
    axios.get('http://localhost:3001/api/clients/unpaid/currentMonth')
      .then(response => {
        setUnpaidClients(response.data);
        setModalIsOpen(true);
      })
      .catch(error => {
        console.error('There was an error fetching unpaid clients!', error);
      });
  };

  return (
    <div className="client-list">
      <h2>Client List</h2>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or number"
      />
      <button onClick={openUnpaidClientsModal}>Show Unpaid Clients</button>
      <ul>
        {filteredClients.map(client => (
          <li key={client.id} onClick={() => {
            console.log('Client ID clicked:', client.id);
            selectClient(client);
          }}>
            <span>
              {client.firstName} {client.lastName} - {client.number} ({client.branch})
            </span>
            <button onClick={(e) => {
              e.stopPropagation();
              handleEditClick(client);
            }}>Edit</button>
            <button className="danger" onClick={(e) => {
              e.stopPropagation();
              handleDelete(client.id);
            }}>Delete</button>
          </li>
        ))}
      </ul>
      {editingClientId && (
        <div className="edit-client-form">
          <h3>Edit Client</h3>
          <input
            type="text"
            value={clientData.firstName}
            onChange={(e) => setClientData({ ...clientData, firstName: e.target.value })}
            placeholder="First Name"
          />
          <input
            type="text"
            value={clientData.lastName}
            onChange={(e) => setClientData({ ...clientData, lastName: e.target.value })}
            placeholder="Last Name"
          />
          <input
            type="text"
            value={clientData.number}
            onChange={(e) => setClientData({ ...clientData, number: e.target.value })}
            placeholder="Number"
          />
          <select
            value={clientData.branch}
            onChange={(e) => setClientData({ ...clientData, branch: e.target.value })}
          >
            <option value="TSDI">TSDI</option>
            <option value="TSGE">TSGE</option>
          </select>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => {
            setEditingClientId(null);
            setClientData({
              firstName: '',
              lastName: '',
              number: '',
              branch: 'TSDI',
            });
          }}>Cancel</button>
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Unpaid Clients"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Unpaid Clients</h2>
        <ul>
          {unpaidClients.map(client => (
            <li key={client.id}>
              {client.firstName} {client.lastName} - {client.number} ({client.branch})
            </li>
          ))}
        </ul>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>
    </div>
  );
}

export default ClientList;
