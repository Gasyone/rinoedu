import React, { useEffect, useState } from 'react';
import { ChatMessage, ErrorLog } from 'src/shared/interfaces/comms';

const ChatWindow = ({ isDarkMode }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [empty, setEmpty] = useState<boolean>(false);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3001/api/chat/messages?userId=user123');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setMessages(data);
                setEmpty(data.length === 0);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div className={`flex flex-col h-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>  
            {loading && <div className="flex justify-center items-center h-full">Loading...</div>}
            {error && <div className="text-red-500 text-center">Error: {error}</div>}
            {empty && !loading && <div className="text-center text-gray-500">No messages available.</div>}
            {!loading && !error && !empty && (
                <div className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-700">
                    {messages.map((msg) => (
                        <div key={msg.id} className="p-2 border-b border-gray-300 dark:border-gray-600">
                            <strong>{msg.userId}:</strong> {msg.message} <span className="text-gray-400 text-sm">{new Date(msg.timestamp).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatWindow;