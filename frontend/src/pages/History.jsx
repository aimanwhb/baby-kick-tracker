import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../api';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, subMonths, eachMonthOfInterval } from 'date-fns';
import { Calendar, Download, Trophy, TrendingUp, Clock, ChevronRight, ArrowLeft, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [dayKicks, setDayKicks] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Month Filter State
    const [filterMonth, setFilterMonth] = useState('all');

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await api.get('/kicks/stats');
            setHistory(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // Generate list of available months directly from the data
    const availableMonths = useMemo(() => {
        if (history.length === 0) return [];

        const monthsMap = new Map();
        history.forEach(day => {
            const monthKey = format(parseISO(day.date), 'yyyy-MM');
            if (!monthsMap.has(monthKey)) {
                monthsMap.set(monthKey, parseISO(day.date));
            }
        });

        // Sort months in descending order (most recent first)
        return Array.from(monthsMap.values()).sort((a, b) => b - a);
    }, [history]);

    // Filtered History
    const filteredHistory = useMemo(() => {
        if (filterMonth === 'all') return history;

        return history.filter(day => {
            return day.date.startsWith(filterMonth);
        });
    }, [history, filterMonth]);

    const fetchDayDetails = async (date) => {
        try {
            setLoadingDetails(true);
            setSelectedDate(date);
            const res = await api.get(`/kicks?date=${date}`);
            setDayKicks(res.data);
            setLoadingDetails(false);
        } catch (err) {
            console.error(err);
            setLoadingDetails(false);
        }
    };

    const downloadCSV = () => {
        const dataToExport = filteredHistory;
        const headers = ['Date', 'Kick Count'];
        const rows = dataToExport.map(h => [`"${h.date}"`, h.count]);
        const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `kick_history_${filterMonth}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (loading && !selectedDate) return <div className="text-center" style={{ padding: '50px' }}>Loading...</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="history-page"
        >
            <AnimatePresence mode="wait">
                {!selectedDate ? (
                    <motion.div
                        key="summary"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
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

                        {/* Month Filter Dropdown */}
                        <div className="card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: 'var(--bg-top)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Filter size={20} color="var(--primary)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>
                                    Filter by Month
                                </label>
                                <select
                                    value={filterMonth}
                                    onChange={(e) => setFilterMonth(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 0',
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: '2px solid var(--bg-top)',
                                        fontFamily: 'inherit',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        color: 'var(--text)',
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="all">📅 All Time History</option>
                                    {availableMonths.map(month => (
                                        <option key={format(month, 'yyyy-MM')} value={format(month, 'yyyy-MM')}>
                                            🌙 {format(month, 'MMMM yyyy')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="card" style={{ height: '350px', padding: '24px 12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', padding: '0 12px' }}>
                                <TrendingUp size={20} color="var(--primary)" />
                                <h2 style={{ margin: 0 }}>Daily Trends</h2>
                            </div>
                            <ResponsiveContainer width="100%" height="80%">
                                <BarChart data={filteredHistory}>
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
                                    <Bar
                                        dataKey="count"
                                        radius={[6, 6, 0, 0]}
                                        barSize={24}
                                        onClick={(data) => fetchDayDetails(data.date)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {filteredHistory.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.count < 10 ? 'var(--danger)' : 'url(#barGradient)'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                            <p className="text-center" style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                                Displaying {filteredHistory.length} days
                            </p>
                        </div>

                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <Calendar size={20} color="var(--primary)" />
                                <h2 style={{ margin: 0 }}>Logs for {filterMonth === 'all' ? 'All Time' : format(parseISO(filterMonth), 'MMMM yyyy')}</h2>
                            </div>
                            <div className="history-list">
                                {filteredHistory.length === 0 ? (
                                    <p className="text-center" style={{ color: 'var(--text-light)', padding: '20px' }}>No records found for this period.</p>
                                ) : (
                                    [...filteredHistory].reverse().map((day) => (
                                        <motion.div
                                            whileTap={{ scale: 0.98 }}
                                            key={day.date}
                                            className="activity-item"
                                            style={{ background: 'white', cursor: 'pointer' }}
                                            onClick={() => fetchDayDetails(day.date)}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', background: 'var(--bg-top)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {day.count >= 10 ? <Trophy size={18} color="#f1c40f" /> : <Calendar size={18} color="var(--text-light)" />}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700 }}>{format(parseISO(day.date), 'EEEE, MMM d')}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                                        {day.count} movements recorded
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{
                                                    background: day.count < 10 ? 'rgba(255, 118, 117, 0.1)' : 'rgba(0, 184, 148, 0.1)',
                                                    color: day.count < 10 ? 'var(--danger)' : 'var(--success)',
                                                    padding: '4px 10px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 800
                                                }}>
                                                    {day.count}
                                                </div>
                                                <ChevronRight size={18} color="#ccc" />
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="details"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <button
                            onClick={() => setSelectedDate(null)}
                            className="btn btn-ghost"
                            style={{ padding: '0', marginBottom: '2rem', gap: '8px' }}
                        >
                            <ArrowLeft size={20} /> Back to History
                        </button>

                        <header style={{ marginBottom: '2.5rem' }}>
                            <h1 style={{ marginBottom: '4px' }}>{format(parseISO(selectedDate), 'MMMM d, yyyy')}</h1>
                            <p>{format(parseISO(selectedDate), 'EEEE')}</p>
                        </header>

                        <div className="stat-card-row">
                            <div className="stat-vibrant">
                                <span className="stat-vibrant-val">{dayKicks.length}</span>
                                <span className="stat-vibrant-label">Total Kicks</span>
                            </div>
                            <div className="stat-vibrant">
                                <span className="stat-vibrant-val" style={{ color: dayKicks.length >= 10 ? 'var(--success)' : 'var(--text)' }}>
                                    {dayKicks.length >= 10 ? 'GOAL MET' : 'ACTIVE'}
                                </span>
                                <span className="stat-vibrant-label">Status</span>
                            </div>
                        </div>

                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                <Clock size={20} color="var(--primary)" />
                                <h2 style={{ margin: 0 }}>Timeline</h2>
                            </div>

                            {loadingDetails ? (
                                <p className="text-center">Loading times...</p>
                            ) : (
                                <div className="history-list">
                                    {dayKicks.length === 0 ? (
                                        <p className="text-center" style={{ color: 'var(--text-light)', padding: '20px' }}>No kicks recorded this day.</p>
                                    ) : (
                                        dayKicks.map((kick, index) => (
                                            <div
                                                key={kick.id}
                                                className="activity-item"
                                                style={{ background: 'white', border: 'none', borderLeft: '3px solid var(--primary)', borderRadius: '0 12px 12px 0', marginLeft: '10px' }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                    <div style={{ fontWeight: 800, color: 'var(--primary)', width: '30px', textAlign: 'right', fontSize: '0.8rem' }}>
                                                        #{dayKicks.length - index}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>{format(new Date(kick.timestamp), 'hh:mm:ss a')}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Movement recorded</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default History;
