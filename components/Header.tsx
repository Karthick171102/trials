
import React, { useState, useRef, useEffect } from 'react';
import { BellIcon, LogoutIcon, ExclamationIcon, InfoCircleIcon, TargetIcon, SettingsIcon, UserIcon } from './icons';
import { useToasts } from '../context/ToastContext';
import type { View } from '../App';

interface HeaderProps {
    onLogout: () => void;
    setCurrentView: (view: View) => void;
    currentView: View;
}

type Notification = {
    id: number;
    type: 'critical' | 'warning' | 'info' | 'threat';
    title: string;
    timestamp: string;
    read: boolean;
};

const Header: React.FC<HeaderProps> = ({ onLogout, setCurrentView, currentView }) => {
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Read'>('All');
    const { addToast } = useToasts();
    
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 1, type: 'critical', title: 'New critical incident detected: INC-002', timestamp: '5m ago', read: false },
        { id: 2, type: 'warning', title: 'Unusual login activity from new IP', timestamp: '2h ago', read: false },
        { id: 3, type: 'info', title: 'System maintenance scheduled for tonight', timestamp: '1d ago', read: true },
        { id: 4, type: 'threat', title: 'Playbook "Block Malicious IP" executed', timestamp: '2d ago', read: true },
        { id: 5, type: 'warning', title: 'Firewall policy updated automatically', timestamp: '3h ago', read: false },
    ]);

    const profileRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const hasUnread = notifications.some(n => !n.read);
    
    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'Unread') return !n.read;
        if (activeTab === 'Read') return n.read;
        return true;
    });

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'critical': return <ExclamationIcon className="w-6 h-6 text-red-500" />;
            case 'warning': return <ExclamationIcon className="w-6 h-6 text-yellow-500" />;
            case 'info': return <InfoCircleIcon className="w-6 h-6 text-blue-500" />;
            case 'threat': return <TargetIcon className="w-6 h-6 text-purple-500" />;
            default: return <BellIcon className="w-6 h-6 text-gray-400" />;
        }
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        addToast('All notifications marked as read.', 'success');
    };

    return (
        <header className="flex items-center justify-between h-20 px-6 md:px-8 bg-white border-b border-gray-200">
            <div>
                <h1 className="text-2xl font-bold text-[#035865]">{currentView}</h1>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative" ref={notificationRef}>
                    <button onClick={() => setNotificationOpen(!isNotificationOpen)} className="relative text-gray-500 hover:text-[#035865] transition-colors p-2 rounded-full hover:bg-gray-100">
                        <BellIcon className="w-6 h-6" />
                        {hasUnread && <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>}
                    </button>
                    {isNotificationOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-10 overflow-hidden animate-fade-in-down">
                            <div className="p-3 border-b">
                                <h3 className="text-md font-semibold text-gray-800">Notifications</h3>
                            </div>
                            <div className="p-2 border-b">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setActiveTab('All')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                                            activeTab === 'All' ? 'bg-[#035865] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('Unread')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                                            activeTab === 'Unread' ? 'bg-[#035865] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        Unread
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('Read')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                                            activeTab === 'Read' ? 'bg-[#035865] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        Read
                                    </button>
                                </div>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {filteredNotifications.length > 0 ? filteredNotifications.map(n => (
                                    <div key={n.id} className="flex items-start p-3 hover:bg-gray-50 border-b last:border-b-0">
                                        {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0 mr-3"></div>}
                                        <div className={`flex-shrink-0 ${n.read ? 'ml-5' : ''}`}>{getNotificationIcon(n.type)}</div>
                                        <div className="ml-3 w-full">
                                            <p className="text-sm text-gray-800">{n.title}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{n.timestamp}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-center text-gray-500 py-8">No notifications</p>
                                )}
                            </div>
                            <div className="flex items-center justify-between p-2 border-t bg-gray-50">
                                <button onClick={handleMarkAllAsRead} className="text-xs text-[#035865] hover:underline">Mark all as read</button>
                                <a href="#" className="text-xs text-[#035865] font-semibold hover:underline">View all</a>
                            </div>
                        </div>
                    )}
                </div>
                <div className="relative" ref={profileRef}>
                    <button 
                        onClick={() => setProfileOpen(!isProfileOpen)} 
                        className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#035865]"
                        aria-haspopup="true"
                        aria-expanded={isProfileOpen}
                    >
                        <img
                            className="h-10 w-10 rounded-full object-cover"
                            src="https://i.pravatar.cc/100?u=alexthornton"
                            alt="User avatar"
                        />
                        <div className="text-left">
                            <div className="text-sm font-semibold text-gray-800">Alex Thornton</div>
                            <div className="text-xs text-gray-500">Lead Analyst</div>
                        </div>
                    </button>
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-10 overflow-hidden animate-fade-in-down">
                            <div className="p-3 border-b border-gray-200 bg-gray-50">
                                <p className="font-semibold text-sm text-gray-800">Alex Thornton</p>
                                <p className="text-xs text-gray-500">analyst@soc.com</p>
                            </div>
                            <div className="py-1">
                                <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                    <UserIcon className="w-4 h-4 mr-2" />
                                    View Profile
                                </a>
                                <button
                                    onClick={() => {
                                        setCurrentView('Settings');
                                        setProfileOpen(false);
                                    }}
                                    className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <SettingsIcon className="w-4 h-4 mr-2" />
                                    Settings
                                </button>
                            </div>
                            <div className="py-1 border-t border-gray-200">
                                <button onClick={onLogout} className="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                    <LogoutIcon className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;