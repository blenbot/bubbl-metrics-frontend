import React, { useState, useEffect } from 'react';
import { metricsAPI } from '../services/api';
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
                <div className="text-xl font-bold text-red-400">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="pt-32 px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard 
                    title="Total Users" 
                    value={metrics.totalUsers} 
                    bgColor="bg-blue-300"
                />
                <MetricCard 
                    title="Active Users (7 days)" 
                    value={metrics.activeUsers} 
                    bgColor="bg-green-300"
                />
                <MetricCard 
                    title="User Retention Rate" 
                    value={`${metrics.userRetention}%`} 
                    bgColor="bg-purple-300"
                />
                <MetricCard 
                    title="Total Groups" 
                    value={metrics.totalGroups} 
                    bgColor="bg-yellow-300"
                />
                <MetricCard 
                    title="Active Groups (7 days)" 
                    value={metrics.activeGroups} 
                    bgColor="bg-pink-300"
                />
                <MetricCard 
                    title="Total Messages" 
                    value={metrics.totalMessages} 
                    bgColor="bg-indigo-300"
                />
                <MetricCard 
                    title="Messages Today" 
                    value={metrics.dailyMessages} 
                    bgColor="bg-red-300"
                />
            </div>
        </div>
    );
}

function MetricCard({ title, value, bgColor }) {
    return (
        <div className={`${bgColor} rounded-lg p-6 shadow-md`}>
            <h3 className="font-bold text-lg text-gray-800 mb-2">{title}</h3>
            <p className="font-black text-3xl text-gray-900">{value || '-'}</p>
        </div>
    );
}