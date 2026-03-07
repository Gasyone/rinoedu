import React, { useEffect, useState } from 'react';
import { OpenAIProxy, OpenAILog } from 'src/shared/interfaces/comms';

interface ProxyConfigurationScreenProps {
    isDarkMode: boolean;
}

const ProxyConfigurationScreen: React.FC<ProxyConfigurationScreenProps> = ({ isDarkMode }) => {
    const [proxyConfig, setProxyConfig] = useState<OpenAIProxy | null>(null);
    const [logs, setLogs] = useState<OpenAILog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProxyConfig = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/openai/proxy', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch proxy configuration');
                }
                const data: OpenAIProxy = await response.json();
                setProxyConfig(data);
                fetchLogs();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchLogs = async () => {
            try {
                const response = await fetch('http://localhost:3001/comms_logs');
                if (!response.ok) {
                    throw new Error('Failed to fetch logs');
                }
                const data: OpenAILog[] = await response.json();
                setLogs(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProxyConfig();
    }, []);

    if (loading) {
        return <div className={`flex justify-center items-center h-full`}>
            <div className="spinner"></div>
        </div>;
    }

    if (error) {
        return <div className={`text-red-500`}>{error}</div>;
    }

    if (!proxyConfig) {
        return <div className={`text-center text-gray-500`}>No data available</div>;
    }

    return (
        <div className={`flex flex-col h-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}> 
            <form className="p-4">
                <label className={`text-gray-700 ${isDarkMode ? 'dark:text-gray-300' : ''}`}>Proxy URL:</label>
                <input type="text" value={proxyConfig.url} className={`border ${isDarkMode ? 'dark:border-gray-600' : 'border-gray-300'} rounded p-2`} readOnly />
                <button type="button" className={`bg-blue-500 text-white rounded p-2 hover:bg-blue-600`}>Update Proxy</button>
            </form>
            <div className={`overflow-y-auto p-4`}> 
                <h2 className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Logs:</h2>
                {logs.length > 0 ? logs.map((log, index) => (
                    <div key={index} className={`text-red-500`}>{log.timestamp}: {log.message}</div>
                )) : <div className={`text-gray-500`}>No logs available</div>}
            </div>
        </div>
    );
};

export default ProxyConfigurationScreen;