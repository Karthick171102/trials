import React, { useState } from 'react';
import Card from '../components/Card';
import { ExclamationIcon, CheckCircleIcon, LightBulbIcon, DownloadIcon } from '../components/icons';
import { Incident, IncidentSeverity } from '../types';
import { useToasts } from '../context/ToastContext';
import Button from '../components/Button';
import Modal from '../components/Modal';

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

const clientIncidents: Incident[] = [
  { id: 'INC-003', title: 'Port Scan from Unknown IP', severity: 'Medium', status: 'New', detected: '2024-08-01 09:45 AM', assignedTo: 'Unassigned', system: 'Firewall-01' },
  { id: 'INC-005', title: 'Phishing Email Reported', severity: 'Low', status: 'Closed', detected: '2024-07-31 04:12 PM', assignedTo: 'Alex T.', system: 'Email Gateway' },
];

const mockReports = [
    { id: 'REP-01', name: 'Q3 Incident Summary', date: '2024-07-31' },
    { id: 'REP-02', name: 'July Compliance Overview', date: '2024-07-31' },
];

const mockRecommendations = [
    "Enable Multi-Factor Authentication (MFA) on all critical accounts.",
    "Conduct quarterly phishing awareness training for all employees.",
    "Ensure all systems are patched with the latest security updates within 72 hours of release."
];

const ClientPortal: React.FC = () => {
    const { addToast } = useToasts();
    const [isReportModalOpen, setReportModalOpen] = useState(false);

    const handleDownloadReport = (reportName: string) => {
        addToast(`Downloading report: ${reportName}...`, 'info');
    };
    
    const handleScheduleReport = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setReportModalOpen(false);
        addToast('Report has been scheduled successfully.', 'success');
    };

    const severityColor = (severity: IncidentSeverity) => {
        switch (severity) {
            case 'Critical': return 'bg-red-100 text-red-800';
            case 'High': return 'bg-orange-100 text-orange-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={ExclamationIcon} title="Open Incidents" value="1" color="bg-orange-500" />
                <StatCard icon={CheckCircleIcon} title="Resolved (30d)" value="18" color="bg-green-500" />
                <StatCard icon={CheckCircleIcon} title="SLA Compliance" value="99.8%" color="bg-[#035865]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card title="Your Recent Incidents">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Incident ID</th>
                                        <th scope="col" className="px-6 py-3">Summary</th>
                                        <th scope="col" className="px-6 py-3">Severity</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Detected</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientIncidents.map((incident) => (
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

                <div className="space-y-8">
                    <Card title="Reports Center">
                        <ul className="space-y-3">
                            {mockReports.map(report => (
                                <li key={report.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-sm text-gray-800">{report.name}</p>
                                        <p className="text-xs text-gray-500">{report.date}</p>
                                    </div>
                                    <Button variant="secondary" className="text-xs !p-2" onClick={() => handleDownloadReport(report.name)}>
                                        <DownloadIcon className="w-4 h-4" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                         <div className="mt-4 border-t pt-4">
                            <Button variant="accent" className="w-full" onClick={() => setReportModalOpen(true)}>
                                Schedule a New Report
                            </Button>
                        </div>
                    </Card>
                    <Card title="Security Recommendations">
                        <ul className="space-y-4">
                            {mockRecommendations.map((rec, index) => (
                                <li key={index} className="flex items-start">
                                    <LightBulbIcon className="w-5 h-5 text-[#F5B942] mr-3 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-600">{rec}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
            
             <Modal isOpen={isReportModalOpen} onClose={() => setReportModalOpen(false)} title="Schedule a New Report">
                <form onSubmit={handleScheduleReport} className="space-y-4">
                    <div>
                        <label htmlFor="report-type" className="block text-sm font-medium text-gray-700">Report Type</label>
                        <select id="report-type" name="report-type" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#17D6C9] focus:border-[#17D6C9] sm:text-sm rounded-md">
                            <option>Incident Summary</option>
                            <option>Compliance Report</option>
                            <option>Asset Vulnerability Report</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="time-period" className="block text-sm font-medium text-gray-700">Time Period</label>
                        <select id="time-period" name="time-period" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#17D6C9] focus:border-[#17D6C9] sm:text-sm rounded-md">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>Last 90 Days</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="format" className="block text-sm font-medium text-gray-700">Format</label>
                        <select id="format" name="format" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#17D6C9] focus:border-[#17D6C9] sm:text-sm rounded-md">
                            <option>PDF</option>
                            <option>CSV</option>
                        </select>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button variant="secondary" type="button" onClick={() => setReportModalOpen(false)} className="mr-2">Cancel</Button>
                        <Button variant="accent" type="submit">Schedule Report</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ClientPortal;