import React, { useEffect, useState } from 'react';
import { ErrorLog } from 'src/shared/interfaces/comms';

const ErrorLogComponent = ({ isDarkMode }) => {
    const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [empty, setEmpty] = useState<boolean>(false);

    useEffect(() => {
        const fetchErrorLogs = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3001/api/chat/logs?status=error');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setErrorLogs(data);
                setEmpty(data.length === 0);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchErrorLogs();
    }, []);

    return (
        <div className={`flex flex-col h-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>  
            {loading && <div className="flex justify-center items-center h-full">Loading...</div>}
            {error && <div className="text-red-500 text-center">Error: {error}</div>}
            {empty && !loading && <div className="text-center text-gray-500">No error logs available.</div>}
            {!loading && !error && !empty && (
                <div className="p-4 bg-gray-100 dark:bg-gray-700">
                    {errorLogs.map((log) => (
                        <div key={log.id} className="p-2 border-b border-gray-300 dark:border-gray-600">
                            <strong>Error:</strong> {log.error} <span className="text-gray-400 text-sm">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ErrorLogComponent;