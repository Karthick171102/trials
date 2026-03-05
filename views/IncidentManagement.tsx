
import React, { useState } from 'react';
import { Incident, IncidentSeverity, IncidentStatus } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useToasts } from '../context/ToastContext';

const allIncidents: Incident[] = [
  { id: 'INC-001', title: 'Unusual Login Activity', severity: 'High', status: 'New', detected: '2024-08-01 10:20 AM', assignedTo: 'Unassigned', system: 'AWS-Prod' },
  { id: 'INC-002', title: 'Potential Malware Detected', severity: 'Critical', status: 'In Progress', detected: '2024-08-01 10:05 AM', assignedTo: 'Alex T.', system: 'Endpoint-45' },
  { id: 'INC-003', title: 'Port Scan from Unknown IP', severity: 'Medium', status: 'New', detected: '2024-08-01 09:45 AM', assignedTo: 'Unassigned', system: 'Firewall-01' },
  { id: 'INC-004', title: 'Data Exfiltration Anomaly', severity: 'Critical', status: 'Resolved', detected: '2024-07-31 08:00 PM', assignedTo: 'Jane D.', system: 'Database-Main' },
  { id: 'INC-005', title: 'Phishing Email Reported', severity: 'Low', status: 'Closed', detected: '2024-07-31 04:12 PM', assignedTo: 'Alex T.', system: 'Email Gateway' },
];

const IncidentManagement: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isAssignModalOpen, setAssignModalOpen] = useState(false);
  const { addToast } = useToasts();

  const openAssignModal = (incident: Incident) => {
    setSelectedIncident(incident);
    setAssignModalOpen(true);
  };
  
  const handleAssign = () => {
    addToast(`Incident ${selectedIncident?.id} assigned to SOC Team`, 'info');
    setAssignModalOpen(false);
  }

  const severityColor = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const statusColor = (status: IncidentStatus) => {
    switch (status) {
      case 'New': return 'text-blue-600';
      case 'In Progress': return 'text-purple-600';
      case 'Resolved': return 'text-green-600';
      case 'Closed': return 'text-gray-500';
      default: return 'text-gray-600';
    }
  };


  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#035865]">Incident Queue</h2>
        <Button variant="accent">Create Incident</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Severity</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">System</th>
              <th className="px-6 py-3">Assigned To</th>
              <th className="px-6 py-3">Detected</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allIncidents.map((incident) => (
              <tr key={incident.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-xs text-[#035865]">{incident.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{incident.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${severityColor(incident.severity)}`}>
                    {incident.severity}
                  </span>
                </td>
                <td className={`px-6 py-4 font-semibold ${statusColor(incident.status)}`}>{incident.status}</td>
                <td className="px-6 py-4">{incident.system}</td>
                <td className="px-6 py-4">{incident.assignedTo}</td>
                <td className="px-6 py-4 text-gray-500">{incident.detected}</td>
                <td className="px-6 py-4">
                  <Button variant="primary" className="text-xs py-1 px-2" onClick={() => openAssignModal(incident)}>
                    Assign
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {selectedIncident && (
        <Modal isOpen={isAssignModalOpen} onClose={() => setAssignModalOpen(false)} title={`Assign Incident ${selectedIncident.id}`}>
          <div className="space-y-4">
            <p><span className="font-semibold">Title:</span> {selectedIncident.title}</p>
            <p><span className="font-semibold">Severity:</span> {selectedIncident.severity}</p>
            <div>
              <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">Assign to Team/User</label>
              <select id="assignee" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#17D6C9] focus:border-[#17D6C9] sm:text-sm rounded-md">
                <option>SOC Team</option>
                <option>Alex Thornton</option>
                <option>Jane Doe</option>
              </select>
            </div>
            <div className="flex justify-end pt-4">
                <Button variant="secondary" onClick={() => setAssignModalOpen(false)} className="mr-2">Cancel</Button>
                <Button variant="accent" onClick={handleAssign}>Confirm Assignment</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default IncidentManagement;
