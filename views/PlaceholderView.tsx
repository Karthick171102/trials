
import React from 'react';
import { ShieldIcon } from '../components/icons';
import Button from '../components/Button';

interface PlaceholderViewProps {
  title: string;
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
      <ShieldIcon className="w-24 h-24 text-gray-300 mb-6" />
      <h1 className="text-3xl font-bold text-[#035865]">{title}</h1>
      <p className="mt-2 text-lg text-gray-500 max-w-md">
        This module is currently under construction. Check back soon for exciting new features and capabilities!
      </p>
      <div className="mt-8">
        <Button variant="primary" onClick={() => alert('Feature coming soon!')}>
          Request Feature Update
        </Button>
      </div>
    </div>
  );
};

export default PlaceholderView;
