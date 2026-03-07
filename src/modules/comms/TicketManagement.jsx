import React, { useEffect, useState } from 'react';
import { Ticket } from 'src/shared/interfaces/comms';

const TicketManagement = ({ isDarkMode }) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3001/tickets');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTickets(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-full">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">An error occurred: {error}</div>;
    }

    if (tickets.length === 0) {
        return <div className="text-gray-500">No tickets available.</div>;
    }

    return (
        <div className={`flex flex-col p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>  
            <h1 className="text-xl font-bold mb-4">Ticket Management</h1>
            <div className="flex flex-col">
                {tickets.map(ticket => (
                    <div key={ticket.id} className={`flex justify-between items-center p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>  
                        <div>
                            <h2 className="font-semibold">{ticket.title}</h2>
                            <p>{ticket.description}</p>
                            <p>Status: {ticket.status}</p>
                        </div>
                        <div>
                            <button className={`bg-yellow-500 text-white rounded p-2`}>Edit</button>
                            <button className={`bg-red-500 text-white rounded p-2 ml-2`}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TicketManagement;