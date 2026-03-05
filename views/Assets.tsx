
import React, { useState, useMemo } from 'react';
import { Asset, AssetStatus, AssetType, Incident } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useToasts } from '../context/ToastContext';
import { ShieldCheckIcon, ShieldExclamationIcon, BanIcon, PuzzleIcon } from '../components/icons';

const mockAssets: Asset[] = [
    { id: 'ASSET-001', name: 'Workstation-101', status: 'Secure', type: 'Workstation', ipAddress: '192.168.1.101', lastCheckin: '5 min ago', tags: ['finance', 'critical'] },
    { id: 'ASSET-002', name: 'DC-SRV-01', status: 'Secure', type: 'Server', ipAddress: '10.0.0.5', lastCheckin: '2 min ago', tags: ['domain-controller'] },
    { id: 'ASSET-003', name: 'Endpoint-45', status: 'Threat Detected', type: 'Workstation', ipAddress: '192.168.2.45', lastCheckin: '15 min ago', tags: ['marketing'] },
    { id: 'ASSET-004', name: 'SecurityCam-Lobby', status: 'Isolated', type: 'IoT', ipAddress: '192.168.5.12', lastCheckin: '1 hour ago', tags: ['facilities'] },
    { id: 'ASSET-005', name: 'iPhone-CEO', status: 'Secure', type: 'Mobile', ipAddress: '172.16.10.5', lastCheckin: '25 min ago', tags: ['executive', 'critical'] },
    { id: 'ASSET-006', name: 'WebApp-Prod-01', status: 'Threat Detected', type: 'Server', ipAddress: '10.0.1.20', lastCheckin: '8 min ago', tags: ['web-app', 'production'] },
];

const mockIncidents: Incident[] = [
  { id: 'INC-002', title: 'Potential Malware Detected', severity: 'Critical', status: 'In Progress', detected: '2024-08-01 10:05 AM', assignedTo: 'Alex T.', system: 'Endpoint-45' },
  { id: 'INC-003', title: 'Port Scan from Unknown IP', severity: 'Medium', status: 'New', detected: '2024-08-01 09:45 AM', assignedTo: 'Unassigned', system: 'Firewall-01' },
];

const assetStatuses: (AssetStatus | 'All')[] = ['All', 'Secure', 'Threat Detected', 'Isolated'];
const assetTypes: (AssetType | 'All')[] = ['All', 'Workstation', 'Server', 'IoT', 'Mobile'];

const Assets: React.FC = () => {
    const [assets, setAssets] = useState<Asset[]>(mockAssets);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<AssetStatus | 'All'>('All');
    const [selectedType, setSelectedType] = useState<AssetType | 'All'>('All');

    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [isIsolateModalOpen, setIsolateModalOpen] = useState(false);
    const [isTagModalOpen, setTagModalOpen] = useState(false);
    const [isLinkModalOpen, setLinkModalOpen] = useState(false);
    
    const { addToast } = useToasts();

    const filteredAssets = useMemo(() => {
        return assets
            .filter(a => selectedStatus === 'All' || a.status === selectedStatus)
            .filter(a => selectedType === 'All' || a.type === selectedType)
            .filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [assets, searchTerm, selectedStatus, selectedType]);

    const handleIsolateClick = (asset: Asset) => {
        setSelectedAsset(asset);
        setIsolateModalOpen(true);
    };
    
    const handleTagClick = (asset: Asset) => {
        setSelectedAsset(asset);
        setTagModalOpen(true);
    }
    
    const handleLinkClick = (asset: Asset) => {
        setSelectedAsset(asset);
        setLinkModalOpen(true);
    }

    const confirmIsolate = () => {
        if (!selectedAsset) return;
        const newStatus: AssetStatus = selectedAsset.status === 'Isolated' ? 'Secure' : 'Isolated';
        setAssets(assets.map(a => a.id === selectedAsset.id ? { ...a, status: newStatus } : a));
        addToast(`Asset ${selectedAsset.name} has been ${newStatus.toLowerCase()}.`, 'success');
        setIsolateModalOpen(false);
    };

    const confirmTag = () => {
        addToast(`Tags for ${selectedAsset?.name} updated.`, 'info');
        setTagModalOpen(false);
    }
    
    const confirmLink = () => {
        addToast(`Asset ${selectedAsset?.name} linked to incident.`, 'info');
        setLinkModalOpen(false);
    }
    
    const StatusBadge: React.FC<{ status: AssetStatus }> = ({ status }) => {
        const config = {
            'Secure': { icon: ShieldCheckIcon, color: 'text-green-600', bg: 'bg-green-50' },
            'Threat Detected': { icon: ShieldExclamationIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
            'Isolated': { icon: BanIcon, color: 'text-red-600', bg: 'bg-red-50' },
        };
        const { icon: Icon, color, bg } = config[status];
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${color}`}>
                <Icon className={`-ml-0.5 mr-1.5 h-4 w-4`} />
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                    <input
                        type="text"
                        placeholder="Search by name or IP..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17D6C9] focus:border-transparent"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17D6C9] focus:border-transparent bg-white"
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value as any)}
                >
                    {assetStatuses.map(opt => <option key={opt} value={opt}>{opt === 'All' ? 'All Statuses' : opt}</option>)}
                </select>
                <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17D6C9] focus:border-transparent bg-white"
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value as any)}
                >
                    {assetTypes.map(opt => <option key={opt} value={opt}>{opt === 'All' ? 'All Types' : opt}</option>)}
                </select>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Asset Name</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">IP Address</th>
                                <th className="px-6 py-3">Tags</th>
                                <th className="px-6 py-3">Last Check-in</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssets.map(asset => (
                                <tr key={asset.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{asset.name}</td>
                                    <td className="px-6 py-4"><StatusBadge status={asset.status} /></td>
                                    <td className="px-6 py-4">{asset.type}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{asset.ipAddress}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {asset.tags.map(tag => <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">{tag}</span>)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{asset.lastCheckin}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <Button variant="secondary" className="text-xs py-1 px-2" onClick={() => handleIsolateClick(asset)}>
                                                {asset.status === 'Isolated' ? 'Restore' : 'Isolate'}
                                            </Button>
                                             <Button variant="secondary" className="text-xs py-1 px-2" onClick={() => handleTagClick(asset)}>Tag</Button>
                                             <Button variant="secondary" className="text-xs py-1 px-2" onClick={() => handleLinkClick(asset)}>Link</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredAssets.length === 0 && (
                        <div className="text-center py-16 text-gray-500">
                            <PuzzleIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="font-semibold">No assets match your criteria.</p>
                            <p className="text-sm">Try adjusting your filters.</p>
                        </div>
                     )}
                </div>
            </div>

            {selectedAsset && (
                <>
                    <Modal isOpen={isIsolateModalOpen} onClose={() => setIsolateModalOpen(false)} title={`${selectedAsset.status === 'Isolated' ? 'Restore' : 'Isolate'} Asset`}>
                        <p>Are you sure you want to {selectedAsset.status === 'Isolated' ? 'restore' : 'isolate'} the asset "{selectedAsset.name}"? This will {selectedAsset.status === 'Isolated' ? 'reconnect it to the network' : 'disconnect it from the network'}.</p>
                        <div className="flex justify-end pt-6">
                            <Button variant="secondary" onClick={() => setIsolateModalOpen(false)} className="mr-2">Cancel</Button>
                            <Button variant={selectedAsset.status === 'Isolated' ? 'primary' : 'primary'} className={selectedAsset.status !== 'Isolated' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : ''} onClick={confirmIsolate}>
                                {selectedAsset.status === 'Isolated' ? 'Confirm Restore' : 'Confirm Isolate'}
                            </Button>
                        </div>
                    </Modal>

                     <Modal isOpen={isTagModalOpen} onClose={() => setTagModalOpen(false)} title={`Tag Asset: ${selectedAsset.name}`}>
                         <div className="space-y-4">
                            <p className="text-gray-600">Add or remove tags for this asset. Enter a tag and press Enter.</p>
                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
                                <input id="tags" type="text" className="mt-1 block w-full text-base border-gray-300 focus:outline-none focus:ring-[#17D6C9] focus:border-[#17D6C9] sm:text-sm rounded-md" placeholder="e.g., critical, finance"/>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedAsset.tags.map(tag => <span key={tag} className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800 flex items-center">{tag} <button className="ml-1.5 text-blue-500 hover:text-blue-700">&times;</button></span>)}
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button variant="secondary" onClick={() => setTagModalOpen(false)} className="mr-2">Cancel</Button>
                                <Button variant="accent" onClick={confirmTag}>Save Tags</Button>
                            </div>
                        </div>
                    </Modal>

                    <Modal isOpen={isLinkModalOpen} onClose={() => setLinkModalOpen(false)} title={`Link Asset to Incident: ${selectedAsset.name}`}>
                         <div className="space-y-4">
                            <p className="text-gray-600">Choose an existing incident to associate with this asset.</p>
                            <div>
                                <label htmlFor="incident" className="block text-sm font-medium text-gray-700">Available Incidents</label>
                                <select id="incident" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#17D6C9] focus:border-[#17D6C9] sm:text-sm rounded-md">
                                    {mockIncidents.map(inc => <option key={inc.id}>{inc.id}: {inc.title}</option>)}
                                </select>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button variant="secondary" onClick={() => setLinkModalOpen(false)} className="mr-2">Cancel</Button>
                                <Button variant="accent" onClick={confirmLink}>Link Incident</Button>
                            </div>
                        </div>
                    </Modal>
                </>
            )}

        </div>
    );
};

export default Assets;
