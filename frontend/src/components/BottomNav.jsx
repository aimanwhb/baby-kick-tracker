import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, History, LogOut, LayoutGrid } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const BottomNav = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) return null;

    return (
        <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="bottom-nav"
        >
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                <LayoutGrid size={22} />
                <span>Today</span>
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <History size={22} />
                <span>History</span>
            </NavLink>
            <button
                onClick={logout}
                className="nav-item"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
                <LogOut size={22} />
                <span>Logout</span>
            </button>
        </motion.nav>
    );
};

export default BottomNav;
