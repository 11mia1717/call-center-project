import React from 'react';
import { Infinity } from 'lucide-react';

const Logo = ({ className = "", showSlogan = false }) => {
  return (
    <div className={`logo-container ${className}`} style={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: '4px',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap', justifyContent: 'center' }}>
        <div className="logo-icon" style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #1A73E8 0%, #0D47A1 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 16px rgba(26, 115, 232, 0.2)',
          flexShrink: 0
        }}>
          <Infinity size={26} color="white" />
        </div>
        <span style={{ 
          fontSize: '21px', 
          fontWeight: 800, 
          color: '#1A1A1A',
          letterSpacing: '-1px',
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px'
        }}>
          Continue Bank <span style={{ fontSize: '24px', color: '#1A73E8', fontWeight: 900 }}>TM</span>
        </span>
      </div>
      
      {/* Subtitle: by DAVADA */}
      <div style={{ 
        fontSize: '11px', 
        color: '#6B7280', 
        fontWeight: 600, 
        letterSpacing: '0.05em',
        marginTop: '-2px',
        opacity: 0.8
      }}>
        by DAVADA
      </div>

      {showSlogan && (
        <div style={{ 
          fontSize: '13px', 
          fontWeight: 700, 
          color: '#1A73E8', 
          marginTop: '4px',
          opacity: 0.9,
          letterSpacing: '-0.02em',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          당신의 금융은 멈추지 않도록, 보안은 계속됩니다.
        </div>
      )}
    </div>
  );
};

export default Logo;
