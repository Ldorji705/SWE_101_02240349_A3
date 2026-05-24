import React from 'react';

const EmptyState = ({ message = 'No items found' }) => (
  <div className="empty-state">{message}</div>
);

export default EmptyState;
