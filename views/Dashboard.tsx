
import React from 'react';
import Card from '../components/Card';
import { ExclamationIcon, CheckCircleIcon, PlayIcon, TargetIcon } from '../components/icons';
import { Incident } from '../types';
import { useToasts } from '../context/ToastContext';
import Button from '../components/Button';

const StatCard: React.FC<{ icon: React.FC<{className?:string}>; title: string; value: string; color: string }> = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const mockIncidents: Incident[] = [
  { id: 'INC-001', title: 'Unusual Login Activity', severity: 'High', status: 'New', detected: '2 min ago', assignedTo: 'Unassigned', system: 'AWS-Prod' },
  { id: 'INC-002', title: 'Potential Malware Detected', severity: 'Critical', status: 'In Progress', detected: '15 min ago', assignedTo: 'Alex T.', system: 'Endpoint-45' },
  { id: 'INC-003', title: 'Port Scan from Unknown IP', severity: 'Medium', status: 'New', detected: '35 min ago', assignedTo: 'Unassigned', system: 'Firewall-01' },
];

const Dashboard: React.FC = () => {
    const { addToast } = useToasts();

    const handleThreatDetect = () => {
        addToast('Threat detected: Phishing attempt in Email Gateway', 'warning');
    }

    const severityColor = (severity: Incident['severity']) => {
        switch (severity) {
            case 'Critical': return 'bg-red-100 text-red-800';
            case 'High': return 'bg-orange-100 text-orange-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-blue-100 text-blue-800';
        }
    };

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={TargetIcon} title="Active Threats" value="12" color="bg-[#F5B942]" />
        <StatCard icon={ExclamationIcon} title="Incidents Today" value="5" color="bg-red-500" />
        <StatCard icon={PlayIcon} title="Auto-Resolved" value="34" color="bg-[#17D6C9]" />
        <StatCard icon={CheckCircleIcon} title="Manual Actions" value="2" color="bg-[#035865]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Threat Map */}
        <div className="lg:col-span-2">
            <Card title="Real-time Threat Map">
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Threat Map Visualization</p>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button variant='accent' onClick={handleThreatDetect}>Simulate Threat</Button>
                </div>
            </Card>
        </div>

        {/* Threat Timeline */}
        <div className="lg:col-span-1">
          <Card title="Threat Timeline">
            <ul className="space-y-4 h-96 overflow-y-auto pr-2">
              <li className="flex items-start">
                <div className="w-3 h-3 bg-[#F5B942] rounded-full mt-1.5 mr-4"></div>
                <div>
                  <p className="font-semibold text-sm">DDoS Activity Detected</p>
                  <p className="text-xs text-gray-500">Network Segment A - 2 mins ago</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5 mr-4"></div>
                <div>
                  <p className="font-semibold text-sm">Ransomware Signature Match</p>
                  <p className="text-xs text-gray-500">Endpoint-102 - 8 mins ago</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-3 h-3 bg-[#035865] rounded-full mt-1.5 mr-4"></div>
                <div>
                  <p className="font-semibold text-sm">Policy Violation: P2P Traffic</p>
                  <p className="text-xs text-gray-500">Firewall-02 - 25 mins ago</p>
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </div>
      
      {/* Recent Incidents Table */}
      <Card title="Recent Incidents">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Incident ID</th>
                        <th scope="col" className="px-6 py-3">Title</th>
                        <th scope="col" className="px-6 py-3">Severity</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Detected</th>
                    </tr>
                </thead>
                <tbody>
                    {mockIncidents.map((incident) => (
                        <tr key={incident.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{incident.id}</td>
                            <td className="px-6 py-4">{incident.title}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${severityColor(incident.severity)}`}>
                                    {incident.severity}
                                </span>
                            </td>
                            <td className="px-6 py-4">{incident.status}</td>
                            <td className="px-6 py-4">{incident.detected}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
