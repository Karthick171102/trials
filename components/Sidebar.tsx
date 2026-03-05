import React, { useState } from 'react';
import { View } from '../App';
import { ShieldIcon, DashboardIcon, ExclamationIcon, TargetIcon, PlayIcon, PuzzleIcon, UserGroupIcon, DocumentReportIcon, ChevronDoubleLeftIcon } from './icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const navItems: { view: View; icon: React.FC<{className?: string}> }[] = [
  { view: 'Dashboard', icon: DashboardIcon },
  { view: 'Incidents', icon: ExclamationIcon },
  { view: 'Threat Intelligence', icon: TargetIcon },
  { view: 'Playbooks', icon: PlayIcon },
  { view: 'Assets', icon: PuzzleIcon },
  { view: 'Users', icon: UserGroupIcon },
  { view: 'Client Portal', icon: DocumentReportIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className={`flex flex-col bg-white border-r border-gray-200 shadow-md transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`flex items-center h-20 shrink-0 border-b border-gray-200 ${isCollapsed ? 'justify-center' : 'px-4'}`}>
        {!isCollapsed && (
          <a href="#" className="flex items-center flex-1 overflow-hidden">
            <ShieldIcon className="w-10 h-10 text-[#17D6C9] flex-shrink-0" />
            <span className="ml-2 font-bold text-lg text-[#035865] whitespace-nowrap">Cyber-Shield</span>
          </a>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors duration-200"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronDoubleLeftIcon className={`w-6 h-6 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
        <div className={isCollapsed ? 'px-2' : 'px-4'}>
            {navItems.map((item) => {
                const isActive = currentView === item.view;
                
                let buttonClasses;
                if (isCollapsed) {
                    buttonClasses = `flex items-center justify-center h-12 w-12 mx-auto rounded-lg transition-colors duration-200 ${isActive ? 'bg-[#035865] text-white' : 'text-gray-500 hover:bg-gray-100'}`;
                } else {
                    buttonClasses = `flex items-center w-full py-3 px-4 rounded-lg transition-colors duration-200 text-sm font-medium ${isActive ? 'bg-[#035865] text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-[#035865]'}`;
                }

                return (
                    <button
                        key={item.view}
                        onClick={() => setCurrentView(item.view)}
                        className={buttonClasses}
                        title={item.view}
                    >
                        <item.icon className="w-6 h-6 flex-shrink-0" />
                        {!isCollapsed && <span className="ml-4 whitespace-nowrap">{item.view}</span>}
                    </button>
                );
            })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;