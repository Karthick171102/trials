
import React, { useState, useMemo } from 'react';
import { Playbook, PlaybookAutomationLevel, PlaybookTaskType, Incident } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useToasts } from '../context/ToastContext';
import { PlayIcon, PencilIcon, TrashIcon, TargetIcon } from '../components/icons';

const mockPlaybooks: Playbook[] = [
    { id: 'PB-001', name: 'Isolate Endpoint', description: 'Automatically isolates an endpoint when high-severity malware is detected.', lastUpdated: '2 days ago', timesTriggered: 15, automationLevel: 'Fully Automated', taskType: 'Containment', steps: [] },
    { id: 'PB-002', name: 'Phishing Email Triage', description: 'Analyzes reported phishing emails, extracts IOCs, and blocks malicious domains.', lastUpdated: '1 week ago', timesTriggered: 42, automationLevel: 'Fully Automated', taskType: 'Investigation', steps: [] },
    { id: 'PB-003', name: 'Brute-Force Login Response', description: 'Notifies an analyst and temporarily locks an account after multiple failed login attempts.', lastUpdated: '3 hours ago', timesTriggered: 8, automationLevel: 'Semi-Automated', taskType: 'Remediation', steps: [] },
    { id: 'PB-004', name: 'New User Onboarding', description: 'A manual checklist for provisioning a new SOC analyst account and permissions.', lastUpdated: '1 month ago', timesTriggered: 5, automationLevel: 'Manual', taskType: 'Notification', steps: [] },
    { id: 'PB-005', name: 'Critical Vulnerability Scan', description: 'Scans critical assets for a newly disclosed vulnerability and reports findings.', lastUpdated: '5 days ago', timesTriggered: 2, automationLevel: 'Semi-Automated', taskType: 'Investigation', steps: [] },
];

const mockIncidents: Incident[] = [
  { id: 'INC-002', title: 'Potential Malware Detected', severity: 'Critical', status: 'In Progress', detected: '2024-08-01 10:05 AM', assignedTo: 'Alex T.', system: 'Endpoint-45' },
  { id: 'INC-003', title: 'Port Scan from Unknown IP', severity: 'Medium', status: 'New', detected: '2024-08-01 09:45 AM', assignedTo: 'Unassigned', system: 'Firewall-01' },
];

const automationLevels: (PlaybookAutomationLevel | 'All')[] = ['All', 'Fully Automated', 'Semi-Automated', 'Manual'];
const taskTypes: (PlaybookTaskType | 'All')[] = ['All', 'Containment', 'Investigation', 'Remediation', 'Notification'];


const Playbooks: React.FC = () => {
    const [playbooks, setPlaybooks] = useState<Playbook[]>(mockPlaybooks);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAutomation, setSelectedAutomation] = useState<PlaybookAutomationLevel | 'All'>('All');
    const [selectedTaskType, setSelectedTaskType] = useState<PlaybookTaskType | 'All'>('All');
    
    const [isRunModalOpen, setRunModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isFormModalOpen, setFormModalOpen] = useState(false);

    const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
    const { addToast } = useToasts();

    const filteredPlaybooks = useMemo(() => {
        return playbooks
            .filter(p => selectedAutomation === 'All' || p.automationLevel === selectedAutomation)
            .filter(p => selectedTaskType === 'All' || p.taskType === selectedTaskType)
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [playbooks, searchTerm, selectedAutomation, selectedTaskType]);

    const handleRunClick = (playbook: Playbook) => {
        setSelectedPlaybook(playbook);
        setRunModalOpen(true);
    };

    const handleDeleteClick = (playbook: Playbook) => {
        setSelectedPlaybook(playbook);
        setDeleteModalOpen(true);
    };

    const handleEditClick = (playbook: Playbook) => {
        setSelectedPlaybook(playbook);
        setFormModalOpen(true);
    };

    const handleCreateClick = () => {
        setSelectedPlaybook(null);
        setFormModalOpen(true);
    };

    const confirmRun = () => {
        addToast(`Playbook "${selectedPlaybook?.name}" initiated.`, 'success');
        setRunModalOpen(false);
    };

    const confirmDelete = () => {
        setPlaybooks(playbooks.filter(p => p.id !== selectedPlaybook!.id));
        addToast(`Playbook "${selectedPlaybook?.name}" deleted.`, 'info');
        setDeleteModalOpen(false);
    };
    
    const automationLevelColors: Record<PlaybookAutomationLevel, string> = {
        'Fully Automated': 'bg-green-100 text-green-800',
        'Semi-Automated': 'bg-yellow-100 text-yellow-800',
        'Manual': 'bg-gray-100 text-gray-800',
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="w-full">
                    <input
                        type="text"
                        placeholder="Search playbooks..."
                        className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17D6C9] focus:border-transparent"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                     <select
                        className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17D6C9] focus:border-transparent bg-white"
                        value={selectedAutomation}
                        onChange={e => setSelectedAutomation(e.target.value as any)}
                    >
                        {automationLevels.map(opt => <option key={opt} value={opt}>{opt === 'All' ? 'All Automation Levels' : opt}</option>)}
                    </select>
                     <select
                        className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17D6C9] focus:border-transparent bg-white"
                        value={selectedTaskType}
                        onChange={e => setSelectedTaskType(e.target.value as any)}
                    >
                        {taskTypes.map(opt => <option key={opt} value={opt}>{opt === 'All' ? 'All Task Types' : opt}</option>)}
                    </select>
                    <Button variant="accent" onClick={handleCreateClick}>Create Playbook</Button>
                </div>
            </div>

            {filteredPlaybooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlaybooks.map(playbook => (
                        <div key={playbook.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-[#035865]">{playbook.name}</h3>
                                <p className="text-sm text-gray-500 mt-1 h-10">{playbook.description}</p>
                                <div className="mt-4 flex items-center space-x-2">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${automationLevelColors[playbook.automationLevel]}`}>{playbook.automationLevel}</span>
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{playbook.taskType}</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 px-5 py-3 text-xs text-gray-500 flex justify-between items-center">
                                <span>Triggered: {playbook.timesTriggered} times</span>
                                <span>Updated: {playbook.lastUpdated}</span>
                            </div>
                            <div className="border-t border-gray-200 p-3 flex justify-end items-center space-x-2 bg-gray-50 rounded-b-xl">
                                <Button variant="secondary" className="text-xs py-1 px-2" onClick={() => handleEditClick(playbook)}>
                                    <PencilIcon className="w-4 h-4" />
                                </Button>
                                <Button variant="secondary" className="text-xs py-1 px-2 text-red-500 hover:bg-red-100" onClick={() => handleDeleteClick(playbook)}>
                                    <TrashIcon className="w-4 h-4" />
                                </Button>
                                <Button variant="primary" className="text-xs py-1 px-2 flex items-center" onClick={() => handleRunClick(playbook)}>
                                    <PlayIcon className="w-4 h-4 mr-1" />
                                    Run
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
             ) : (
                <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
                    <TargetIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-semibold">No playbooks match your criteria.</p>
                    <p className="text-sm">Try adjusting your search or filters.</p>
                </div>
             )}
            
            {selectedPlaybook && (
                <>
                    <Modal isOpen={isRunModalOpen} onClose={() => setRunModalOpen(false)} title={`Run Playbook: ${selectedPlaybook.name}`}>
                         <div className="space-y-4">
                            <p className="text-gray-600">Select an incident to run this playbook against.</p>
                            <div>
                                <label htmlFor="incident" className="block text-sm font-medium text-gray-700">Target Incident</label>
                                <select id="incident" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#17D6C9] focus:border-[#17D6C9] sm:text-sm rounded-md">
                                    {mockIncidents.map(inc => <option key={inc.id}>{inc.id}: {inc.title}</option>)}
                                </select>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button variant="secondary" onClick={() => setRunModalOpen(false)} className="mr-2">Cancel</Button>
                                <Button variant="accent" onClick={confirmRun}>Confirm & Run</Button>
                            </div>
                        </div>
                    </Modal>
                    <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Deletion">
                        <p>Are you sure you want to delete the playbook "{selectedPlaybook.name}"? This action cannot be undone.</p>
                        <div className="flex justify-end pt-6">
                            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)} className="mr-2">Cancel</Button>
                            <Button variant="primary" className="bg-red-600 hover:bg-red-700 focus:ring-red-500" onClick={confirmDelete}>Delete</Button>
                        </div>
                    </Modal>
                </>
            )}

            <Modal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)} title={selectedPlaybook ? 'Edit Playbook' : 'Create New Playbook'}>
                <p>Playbook editor functionality is under construction. This modal serves as a placeholder for creating and editing playbooks.</p>
                <div className="flex justify-end pt-6">
                    <Button variant="secondary" onClick={() => setFormModalOpen(false)}>Close</Button>
                </div>
            </Modal>
        </div>
    );
};

export default Playbooks;
