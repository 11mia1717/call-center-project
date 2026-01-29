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
        <span className="logo-text" style={{
          fontSize: '21px',
          fontWeight: 'bold',
          color: '#1A1A1A',
          letterSpacing: '-1px'
        }}>
          Continue Card <span style={{ color: '#1A73E8' }}>콜센터</span>
        </span>
      </div>
      {showSlogan && (
        <div className="logo-slogan" style={{
          fontSize: '13px',
          fontWeight: '700',
          color: '#1A73E8',
          letterSpacing: '-0.2px',
          marginTop: '4px',
          opacity: 0.9
        }}>
          당신의 금융은 멈추지 않도록, 보안은 계속됩니다.
        </div>
      )}
    </div>
  );
};

export default Logo;
