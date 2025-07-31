import React, { useState, useEffect } from 'react';
import { metricsAPI } from '../services/api';
import UserActivityChart, { MessageChart } from './graph';
import '../index.css';

export default function Body() {
    const [metrics, setMetrics] = useState({
        totalUsers: 0,
        activeUsers: 0,
        userRetention: 0,
        totalGroups: 0,
        activeGroups: 0,
        totalMessages: 0,
        dailyMessages: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(30);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const data = await metricsAPI.getAllMetrics();
                setMetrics(data);
                setError(null);
            } catch (err) {
                setError('Failed to load metrics');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
        
        const interval = setInterval(fetchMetrics, 30000);
        
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl font-bold">Loading metrics...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl font-bold text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="pt-32 px-8 pb-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics Dashboard</h2>
                <div className="flex gap-2">
                    {[7, 14, 30, 60].map((days) => (
                        <button
                            key={days}
                            onClick={() => setSelectedPeriod(days)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                selectedPeriod === days
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {days} days
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard 
                    title="Total Users" 
                    value={metrics.totalUsers} 
                    bgColor="bg-blue-300"
                    icon="👥"
                />
                <MetricCard 
                    title="Active Users (7 days)" 
                    value={metrics.activeUsers} 
                    bgColor="bg-green-300"
                    icon="🟢"
                />
                <MetricCard 
                    title="Total Groups" 
                    value={metrics.totalGroups} 
                    bgColor="bg-yellow-300"
                    icon="💬"
                />
                <MetricCard 
                    title="Messages Today" 
                    value={metrics.dailyMessages} 
                    bgColor="bg-red-300"
                    icon="📝"
                />
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Activity Charts</h3>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <UserActivityChart days={selectedPeriod} />
                    <MessageChart days={selectedPeriod} />
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <MetricCard 
                        title="User Retention Rate" 
                        value={`${metrics.userRetention}%`} 
                        bgColor="bg-purple-300"
                        icon="📈"
                    />
                    <MetricCard 
                        title="Active Groups (7 days)" 
                        value={metrics.activeGroups} 
                        bgColor="bg-pink-300"
                        icon="🔥"
                    />
                    <MetricCard 
                        title="Total Messages" 
                        value={metrics.totalMessages.toLocaleString()} 
                        bgColor="bg-indigo-300"
                        icon="💌"
                    />
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, bgColor, icon }) {
    return (
        <div className={`${bgColor} rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg text-gray-800">{title}</h3>
                <span className="text-2xl">{icon}</span>
            </div>
            <p className="font-black text-3xl text-gray-900">{value || '-'}</p>
        </div>
    );
}