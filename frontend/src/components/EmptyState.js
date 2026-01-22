import React from 'react';
import { FiPackage, FiFileText, FiCalendar, FiTruck } from 'react-icons/fi';

const EmptyState = ({ 
  icon: Icon = FiPackage, 
  title, 
  description, 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon className="w-12 h-12 mx-auto text-gray-400" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
