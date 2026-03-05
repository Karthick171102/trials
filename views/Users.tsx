
import React, { useState, useMemo } from 'react';
import { User, UserRole, UserStatus } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useToasts } from '../context/ToastContext';
import { CheckCircleIcon, MailIcon, BanIcon, PencilIcon, UserGroupIcon } from '../components/icons';

const mockUsers: User[] = [
    { id: 'U-001', name: 'Alex Thornton', email: 'alex.thornton@soc.com', role: 'Lead Analyst', status: 'Active', lastActive: '2 min ago', avatarUrl: 'https://i.pravatar.cc/100?u=alexthornton' },
    { id: 'U-002', name: 'Jane Doe', email: 'jane.doe@soc.com', role: 'Analyst', status: 'Active', lastActive: '15 min ago', avatarUrl: 'https://i.pravatar.cc/100?u=janedoe' },
    { id: 'U-003', name: 'Bob Smith', email: 'bob.smith@client.com', role: 'Client', status: 'Active', lastActive: '1 hour ago', avatarUrl: 'https://i.pravatar.cc/100?u=bobsmith' },
    { id: 'U-004', name: 'Samantha Carter', email: 's.carter@soc.com', role: 'Admin', status: 'Disabled', lastActive: '3 days ago', avatarUrl: 'https://i.pravatar.cc/100?u=samanthacarter' },
    { id: 'U-005', name: 'new.analyst@soc.com', email: 'new.analyst@soc.com', role: 'Analyst', status: 'Invited', lastActive: 'N/A', avatarUrl: '' },
];

const userTabs: (UserStatus | 'All')[] = ['All', 'Active', 'Invited', 'Disabled'];
const userRoles: UserRole[] = ['Admin', 'Lead Analyst', 'Analyst', 'Client'];

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [activeTab, setActiveTab] = useState<UserStatus | 'All'>('All');
    
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isStatusModalOpen, setStatusModalOpen] = useState(false);

    const { addToast } = useToasts();

    const filteredUsers = useMemo(() => {
        if (activeTab === 'All') return users;
        return users.filter(u => u.status === activeTab);
    }, [users, activeTab]);

    const handleInviteClick = () => {
        setSelectedUser(null);
        setFormModalOpen(true);
    };

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setFormModalOpen(true);
    };
    
    const handleStatusClick = (user: User) => {
        setSelectedUser(user);
        setStatusModalOpen(true);
    };
    
    const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const role = formData.get('role') as UserRole;
        
        if (selectedUser) { // Editing existing user
            setUsers(users.map(u => u.id === selectedUser.id ? { ...u, name, email, role } : u));
            addToast(`User ${name} updated successfully.`, 'success');
        } else { // Inviting new user
            const newUser: User = {
                id: `U-${String(users.length + 1).padStart(3, '0')}`,
                name: name || email,
                email,
                role,
                status: 'Invited',
                lastActive: 'N/A',
                avatarUrl: ''
            };
            setUsers([...users, newUser]);
            addToast(`Invitation sent to ${email}.`, 'info');
        }
        setFormModalOpen(false);
    };
    
    const confirmStatusChange = () => {
        if (!selectedUser) return;
        const newStatus: UserStatus = selectedUser.status === 'Active' ? 'Disabled' : 'Active';
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: newStatus } : u));
        addToast(`User ${selectedUser.name} has been ${newStatus.toLowerCase()}.`, 'success');
        setStatusModalOpen(false);
    };
    
    const StatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
        const config = {
            'Active': { icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-50' },
            'Invited': { icon: MailIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
            'Disabled': { icon: BanIcon, color: 'text-gray-600', bg: 'bg-gray-100' },
        };
        const { icon: Icon, color, bg } = config[status];
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${color}`}>
                <Icon className="-ml-0.5 mr-1.5 h-4 w-4" />
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex border-b border-gray-200">
                        {userTabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${
                                    activeTab === tab 
                                    ? 'border-b-2 border-[#035865] text-[#035865]' 
                                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab} ({tab === 'All' ? users.length : users.filter(u => u.status === tab).length})
                            </button>
                        ))}
                    </div>
                </div>
                <Button variant="accent" onClick={handleInviteClick}>Invite User</Button>
            </div>
            
             <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Last Active</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-full object-cover mr-4" src={user.avatarUrl || `https://i.pravatar.cc/100?u=${user.email}`} alt={user.name} />
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                                    <td className="px-6 py-4">{user.lastActive}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <Button variant="secondary" className="text-xs py-1 px-2" onClick={() => handleEditClick(user)}>
                                                <PencilIcon className="w-4 h-4" />
                                            </Button>
                                            {user.status !== 'Invited' && (
                                                <Button 
                                                    variant="secondary" 
                                                    className={`text-xs py-1 px-2 ${user.status === 'Active' ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                                                    onClick={() => handleStatusClick(user)}
                                                >
                                                    {user.status === 'Active' ? 'Suspend' : 'Reactivate'}
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredUsers.length === 0 && (
                        <div className="text-center py-16 text-gray-500">
                            <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="font-semibold">No users found.</p>
                            <p className="text-sm">There are no users with the status "{activeTab}".</p>
                        </div>
                     )}
                </div>
            </div>

            <Modal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)} title={selectedUser ? 'Edit User' : 'Invite New User'}>
                <form onSubmit={handleSaveUser} className="space-y-4">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" id="name" defaultValue={selectedUser?.name} className="mt-1 block w-full text-base border-gray-300 focus:outline-none focus:ring-[#17D6C9] focus:border-[#17D6C9] sm:text-sm rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" name="email" id="email" required defaultValue={selectedUser?.email} className="mt-1 block w-full text-base border-gray-300 focus:outline-none focus:ring-[#17D6C9] focus:border-[#17D6C9] sm:text-sm rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                        <select id="role" name="role" defaultValue={selectedUser?.role} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#17D6C9] focus:border-[#17D6C9] sm:text-sm rounded-md">
                            {userRoles.map(role => <option key={role}>{role}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button variant="secondary" type="button" onClick={() => setFormModalOpen(false)} className="mr-2">Cancel</Button>
                        <Button variant="accent" type="submit">{selectedUser ? 'Save Changes' : 'Send Invite'}</Button>
                    </div>
                </form>
            </Modal>
            
            {selectedUser && (
                 <Modal isOpen={isStatusModalOpen} onClose={() => setStatusModalOpen(false)} title={`Confirm ${selectedUser.status === 'Active' ? 'Suspension' : 'Reactivation'}`}>
                    <p>Are you sure you want to {selectedUser.status === 'Active' ? 'suspend' : 'reactivate'} the user "{selectedUser.name}"?</p>
                    <div className="flex justify-end pt-6">
                        <Button variant="secondary" onClick={() => setStatusModalOpen(false)} className="mr-2">Cancel</Button>
                        <Button 
                            variant="primary" 
                            className={selectedUser.status === 'Active' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'} 
                            onClick={confirmStatusChange}
                        >
                           {selectedUser.status === 'Active' ? 'Confirm Suspend' : 'Confirm Reactivate'}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Users;