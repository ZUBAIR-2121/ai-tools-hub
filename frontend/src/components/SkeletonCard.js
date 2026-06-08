import React from 'react';
import './ToolCard.css';

export default function SkeletonCard() {
  return (
    <div className="card-skeleton">
      <div className="sk-top">
        <div className="sk-row">
          <div className="sk-circle skeleton" />
          <div className="sk-line skeleton" />
          <div className="sk-line short skeleton" />
        </div>
        <div className="sk-line full skeleton" />
        <div className="sk-line full skeleton" />
        <div className="sk-line short skeleton" />
      </div>
      <div className="sk-footer">
        <div className="sk-btn skeleton" />
        <div className="sk-btn skeleton" />
        <div className="sk-btn skeleton" />
      </div>
    </div>
  );
}
