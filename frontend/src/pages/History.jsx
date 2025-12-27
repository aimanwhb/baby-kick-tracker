import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../api';
import { format, parseISO } from 'date-fns';
import { Calendar, Download, Trophy, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/kicks/stats');
                setHistory(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const downloadCSV = () => {
        const headers = ['Date', 'Kick Count'];
        const rows = history.map(h => [`"${h.date}"`, h.count]);
        const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `kick_history.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (loading) return <div className="text-center" style={{ padding: '50px' }}>Loading...</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="history-page"
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <h1>History 📊</h1>
                    <p>Tracking the journey</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadCSV}
                    className="btn btn-ghost"
                    style={{ fontSize: '0.8rem', gap: '8px', padding: '10px 16px', borderRadius: '12px' }}
                >
                    <Download size={16} /> Export
                </motion.button>
            </div>

            <div className="card" style={{ height: '350px', padding: '24px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', padding: '0 12px' }}>
                    <TrendingUp size={20} color="var(--primary)" />
                    <h2 style={{ margin: 0 }}>Daily Trends</h2>
                </div>
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={history}>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                                <stop offset="100%" stopColor="var(--secondary)" stopOpacity={1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(str) => format(parseISO(str), 'MMM d')}
                            tick={{ fontSize: 11, fill: 'var(--text-light)' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: 'var(--text-light)' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                            contentStyle={{
                                borderRadius: '16px',
                                border: 'none',
                                boxShadow: 'var(--shadow-lg)',
                                padding: '12px'
                            }}
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={24}>
                            {history.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.count < 10 ? 'var(--danger)' : 'url(#barGradient)'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                    <Calendar size={20} color="var(--primary)" />
                    <h2 style={{ margin: 0 }}>Recent Logs</h2>
                </div>
                <div className="history-list">
                    {history.length === 0 ? (
                        <p className="text-center" style={{ color: 'var(--text-light)', padding: '20px' }}>No history yet.</p>
                    ) : (
                        [...history].reverse().map((day) => (
                            <div
                                key={day.date}
                                className="activity-item"
                                style={{ background: 'white' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', background: 'var(--bg-top)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {day.count >= 10 ? <Trophy size={18} color="#f1c40f" /> : <Calendar size={18} color="var(--text-light)" />}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{format(parseISO(day.date), 'EEEE, MMM d')}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                            Daily Summary
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    background: day.count < 10 ? 'rgba(255, 118, 117, 0.1)' : 'rgba(0, 184, 148, 0.1)',
                                    color: day.count < 10 ? 'var(--danger)' : 'var(--success)',
                                    padding: '6px 14px',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    fontWeight: 800
                                }}>
                                    {day.count}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default History;
