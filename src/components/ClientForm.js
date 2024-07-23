import React, { useState } from 'react';
import axios from 'axios';

function ClientForm({ addClient }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [number, setNumber] = useState('');
  const [branch, setBranch] = useState('TSDI');

// Function to handle form submission
const handleSubmit = async (event) => {
    event.preventDefault();

    const clientData = {
        firstName: firstName,
        lastName: lastName,
        number: number,
        branch: branch
    };

    try {
        const response = await axios.post('http://localhost:3001/api/clients', clientData);
        console.log('Client created:', response.data);
        window.location.reload();

        // Handle success (e.g., show a success message or redirect)
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Error response:', error.response.data.error);
            alert(`Error: ${error.response.data.error}`);
        } else if (error.request) {
            // Request was made but no response was received
            console.error('Error request:', error.request);
            alert('Error: No response from server.');
        } else {
            // Something happened in setting up the request
            console.error('Error message:', error.message);
            alert(`Error: ${error.message}`);
        }
    }
};

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
        required
      />
      <input
        type="text"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="Client Number"
        required
      />
      <select
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
        required
      >
        <option value="TSDI">TSDI</option>
        <option value="TSGE">TSGE</option>
      </select>
      <button type="submit">Add Client</button>
    </form>
  );
}

export default ClientForm;
