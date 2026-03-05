
import React, { useState, useMemo } from 'react';
import { Threat, IncidentSeverity, ThreatType } from '../types';
import { TargetIcon } from '../components/icons';

const mockThreats: Threat[] = [
  { id: 'T-001', title: 'Zero-Day Exploit in Apache Struts', type: 'Vulnerability', severity: 'Critical', cvss: 9.8, source: 'CVE-2024-1234', detected: '2 hours ago', isNew: true, affectedPlatforms: ['Linux', 'Windows Server'] },
  { id: 'T-002', title: 'Phishing Campaign "Urgent Invoice"', type: 'Phishing', severity: 'High', cvss: null, source: 'Internal Report', detected: '8 hours ago', isNew: true, affectedPlatforms: ['Email Gateway'] },
  { id: 'T-003', title: 'DDoS attack on public-facing web servers', type: 'DDoS', severity: 'High', cvss: null, source: 'Cloudflare', detected: '1 day ago', isNew: false, affectedPlatforms: ['Web Servers'] },
  { id: 'T-004', title: 'Backdoor Trojan "DarkPulsar"', type: 'Malware', severity: 'Medium', cvss: 7.5, source: 'ThreatBook', detected: '3 days ago', isNew: false, affectedPlatforms: ['Windows 10', 'Windows 11'] },
  { id: 'T-005', title: 'Suspicious data access by privileged user', type: 'Insider Threat', severity: 'Medium', cvss: null, source: 'UEBA System', detected: '5 days ago', isNew: false, affectedPlatforms: ['Database-Main'] },
  { id: 'T-006', title: 'Log4Shell Vulnerability Detected', type: 'Vulnerability', severity: 'Critical', cvss: 10.0, source: 'CVE-2021-44228', detected: '6 days ago', isNew: false, affectedPlatforms: ['Java Applications'] },
  { id: 'T-007', title: 'Credential Stuffing Attack', type: 'Malware', severity: 'High', cvss: null, source: 'Dark Web Monitoring', detected: '1 week ago', isNew: false, affectedPlatforms: ['Customer Login Portal'] },
  { id: 'T-008', title: 'CEO Spear Phishing Attempt', type: 'Phishing', severity: 'Low', cvss: null, source: 'User Reported', detected: '1 week ago', isNew: false, affectedPlatforms: ['Executive Mailboxes'] },
];

const severityOptions: (IncidentSeverity | 'All')[] = ['All', 'Critical', 'High', 'Medium', 'Low'];
const typeOptions: (ThreatType | 'All')[] = ['All', 'Malware', 'Phishing', 'DDoS', 'Vulnerability', 'Insider Threat'];

const ThreatIntelligence: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSeverity, setSelectedSeverity] = useState<IncidentSeverity | 'All'>('All');
    const [selectedType, setSelectedType] = useState<ThreatType | 'All'>('All');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Threat | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'desc' });

    const severityColor = (severity: IncidentSeverity) => {
        switch (severity) {
            case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
            case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Low': return 'bg-blue-100 text-blue-800 border-blue-300';
        }
    };
    
    const sortedAndFilteredThreats = useMemo(() => {
        let filtered = mockThreats
            .filter(threat => selectedSeverity === 'All' || threat.severity === selectedSeverity)
            .filter(threat => selectedType === 'All' || threat.type === selectedType)
            .filter(threat => 
                threat.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                threat.source.toLowerCase().includes(searchTerm.toLowerCase())
            );

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aVal = a[sortConfig.key!];
                const bVal = b[sortConfig.key!];

                if (aVal === null) return 1;
                if (bVal === null) return -1;
                
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    const comparison = aVal.localeCompare(bVal);
                    return sortConfig.direction === 'asc' ? comparison : -comparison;
                }
                
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        
        return filtered;
    }, [searchTerm, selectedSeverity, selectedType, sortConfig]);
    
    const requestSort = (key: keyof Threat) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    
    const SortableHeader = ({ tkey, label }: { tkey: keyof Threat; label: string }) => (
        <th scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort(tkey)}>
            <div className="flex items-center">
                {label}
                {sortConfig.key === tkey ? (sortConfig.direction === 'asc' ? 
                    <svg className="w-3 h-3 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg> : 
                    <svg className="w-3 h-3 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                ) : <div className="w-3 h-3 ml-1.5 opacity-0 group-hover:opacity-50 transition-opacity">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                    </div>
                }
            </div>
        </th>
    );

    return (
        <div className="h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                <div className="lg:col-span-2">
                    <input
                        type="text"
                        placeholder="Search threats by title or source..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17D6C9] focus:border-transparent"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        aria-label="Search threats"
                    />
                </div>
                 <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17D6C9] focus:border-transparent bg-white"
                    value={selectedSeverity}
                    onChange={e => setSelectedSeverity(e.target.value as IncidentSeverity | 'All')}
                    aria-label="Filter by severity"
                >
                    {severityOptions.map(opt => <option key={opt} value={opt}>{opt === 'All' ? 'All Severities' : opt}</option>)}
                </select>
                <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17D6C9] focus:border-transparent bg-white"
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value as ThreatType | 'All')}
                    aria-label="Filter by threat type"
                >
                    {typeOptions.map(opt => <option key={opt} value={opt}>{opt === 'All' ? 'All Types' : opt}</option>)}
                </select>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <SortableHeader tkey="type" label="Type" />
                                <SortableHeader tkey="severity" label="Severity" />
                                <SortableHeader tkey="cvss" label="CVSS" />
                                <SortableHeader tkey="source" label="Source" />
                                <th scope="col" className="px-6 py-3">Detected</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAndFilteredThreats.map(threat => (
                                <tr key={threat.id} className="bg-white border-b hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex items-center">
                                            {threat.isNew && <span className="w-2.5 h-2.5 bg-[#17D6C9] rounded-full mr-3 flex-shrink-0" title="New threat"></span>}
                                            {threat.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{threat.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${severityColor(threat.severity)}`}>
                                            {threat.severity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono">{threat.cvss?.toFixed(1) || 'N/A'}</td>
                                    <td className="px-6 py-4">{threat.source}</td>
                                    <td className="px-6 py-4">{threat.detected}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {sortedAndFilteredThreats.length === 0 && (
                        <div className="text-center py-16 text-gray-500">
                            <TargetIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="font-semibold">No threats match your criteria.</p>
                            <p className="text-sm">Try adjusting your filters.</p>
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default ThreatIntelligence;
