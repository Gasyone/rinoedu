import React, { useEffect, useState } from 'react';
import { ChatMessage, ScreenContext } from 'src/shared/interfaces/comms';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const SquareHomepage = ({ isDarkMode }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const userId = 'user_123'; // Example user ID

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3001/api/chat/messages?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch messages');
                }
                const data = await response.json();
                setMessages(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [userId]);

    const screenContext: ScreenContext = {
        currentModule: 'chat',
        activeTabs: ['Home'],
        visibleFeatures: ['Send Message', 'View History'],
        uiState: {
            isTyping: false,
            lastActive: new Date().toISOString(),
        },
    };

    return (
        <div className={`flex flex-col h-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}> 
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-700">
                    {loading && <div className="flex justify-center items-center h-full">Loading...</div>}
                    {error && <div className="text-red-500">{error}</div>}
                    {!loading && !error && messages.length === 0 && <div className="text-center text-gray-500">No messages available.</div>}
                    {!loading && !error && messages.length > 0 && <MessageList messages={messages} />}
                </div>
                <div className="p-4">
                    <MessageInput userId={userId} screenContext={screenContext} />
                </div>
            </div>
        </div>
    );
};

export default SquareHomepage;
