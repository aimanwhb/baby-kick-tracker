import React, { useState, useEffect, useContext } from 'react';
import { Footprints, Clock, BarChart3, Trash2, Plus, Sparkles, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const ProgressRing = ({ count }) => {
    const target = 10;
    const percentage = Math.min((count / target) * 100, 100);
    const radius = 80;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="progress-ring-container">
            <svg height={radius * 2} width={radius * 2}>
                <circle
                    stroke="rgba(0,0,0,0.05)"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <motion.circle
                    stroke="var(--primary)"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    transform={`rotate(-90 ${radius} ${radius})`}
                />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)' }}>{count}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Kicks</span>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [kicks, setKicks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const fetchKicks = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const res = await api.get(`/kicks?date=${today}`);
            setKicks(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => { fetchKicks(); }, []);

    const handleRecordKick = async () => {
        try {
            const res = await api.post('/kicks', { timestamp: new Date() });
            setKicks([res.data, ...kicks]);
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/kicks/${id}`);
            setKicks(kicks.filter(k => k.id !== id));
        } catch (err) { console.error(err); }
    };

    const lastKickTime = kicks.length > 0 ? format(new Date(kicks[0].timestamp), 'hh:mm a') : '--:--';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="dashboard"
        >
            <header style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Hi, {user?.name || 'Mama'} ✨</h1>
                        <p>Your baby is active today!</p>
                    </div>
                    <div style={{ width: '45px', height: '45px', borderRadius: '15px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                        <Sparkles color="var(--primary)" size={20} />
                    </div>
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                <ProgressRing count={kicks.length} />
                <div className="kick-btn-container">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleRecordKick}
                        className="kick-btn"
                    >
                        <Footprints className="icon" size={48} />
                        <span className="label">TAP</span>
                    </motion.button>
                </div>
            </div>

            <div className="stat-card-row">
                <div className="stat-vibrant">
                    <span className="stat-vibrant-val">{lastKickTime}</span>
                    <span className="stat-vibrant-label">Last Movement</span>
                </div>
                <div className="stat-vibrant" style={{ background: kicks.length >= 10 ? 'var(--success)' : 'white' }}>
                    <span className="stat-vibrant-val" style={{ color: kicks.length >= 10 ? 'white' : 'var(--text)' }}>
                        {kicks.length >= 10 ? 'Goal!' : 10 - kicks.length}
                    </span>
                    <span className="stat-vibrant-label" style={{ color: kicks.length >= 10 ? 'rgba(255,255,255,0.8)' : 'var(--text-light)' }}>
                        {kicks.length >= 10 ? 'Met today' : 'To target'}
                    </span>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0 }}>Recent Movements</h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>{kicks.length} TOTAL</span>
                </div>
                <div className="activity-list">
                    <AnimatePresence>
                        {kicks.length === 0 ? (
                            <p className="text-center" style={{ color: 'var(--text-light)', padding: '20px' }}>
                                Tap the button above to record a kick.
                            </p>
                        ) : (
                            kicks.slice(0, 5).map((kick) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    key={kick.id}
                                    className="activity-item"
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                            <Footprints size={18} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Baby Moved</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                                {format(new Date(kick.timestamp), 'hh:mm:ss a')}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(kick.id)} style={{ background: 'none', border: 'none', color: '#ffaaa5', cursor: 'pointer', padding: '8px' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                    {kicks.length > 5 && (
                        <p className="text-center" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginTop: '1rem' }}>
                            + {kicks.length - 5} more today
                        </p>
                    )}
                </div>
            </div>

            <motion.div
                whileHover={{ scale: 1.02 }}
                className="guidance-box-vibrant"
            >
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}>
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '4px' }}>Helpful Tip</div>
                        <p style={{ color: 'white', fontSize: '0.9rem', opacity: 0.9 }}>
                            Aim for at least <strong>10 movements in 2 hours</strong>. If you're concerned about a decrease, call your doctor.
                        </p>
                    </div>
                </div>
            </motion.div>

            <p className="disclaimer" style={{ marginTop: '3rem' }}>
                * Information is for educational purposes and not a medical diagnosis.
            </p>
        </motion.div>
    );
};

export default Dashboard;
