import React from 'react';

const ConfirmModal = ({ open, title, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="confirm-modal">
      <h4>{title}</h4>
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default ConfirmModal;
