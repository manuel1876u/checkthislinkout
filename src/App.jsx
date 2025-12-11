import React, { useState, useEffect } from 'react';

export default function App() {
  const [screen, setScreen] = useState('loading');
  const [percentage, setPercentage] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');
  const [terminalText, setTerminalText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [ipAddress, setIpAddress] = useState('Fetching...');
  const [locationData, setLocationData] = useState({ city: 'logged', country: 'logged' });
  const [extractionProgress, setExtractionProgress] = useState(0);

  // Fetch real IP address and location
  useEffect(() => {
    const fetchIpData = async () => {
      try {
        // Fetch IP and location data
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        setIpAddress(data.ip || 'logged');
        setLocationData({
          city: data.city || 'logged',
          country: data.country_name || 'logged',
          region: data.region || 'logged'
        });
      } catch (error) {
        // Fallback to just IP if location API fails
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          setIpAddress(ipData.ip || 'logged');
        } catch {
          // Ultimate fallback to random IP
          setIpAddress(`${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`);
        }
      }
    };

    fetchIpData();
  }, []);

  const fullTerminalText = `> SYSTEM BREACH DETECTED 
> IP Address: ${ipAddress}
> Location: ${locationData.country}
> ISP: Tracked and logged
> Device fingerprint captured
> All activities are being monitored 
> Your identity has been compromised`;

  // Loading screen logic
  useEffect(() => {
    if (screen === 'loading') {
      const interval = setInterval(() => {
        setPercentage(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setScreen('thankyou'), 500);
            return 100;
          }
          
          // Update loading messages based on percentage
          if (prev === 30) setLoadingMessage('Turning the next dramatic page...');
          if (prev === 60) setLoadingMessage('Unfolding the tension between characters...');
          if (prev === 90) setLoadingMessage('Polishing the final comic panel...');
          
          return prev + 1;
        });
      }, 25);
      return () => clearInterval(interval);
    }
  }, [screen]);

  // Thank you screen transition
  useEffect(() => {
    if (screen === 'thankyou') {
      const timer = setTimeout(() => {
        setScreen('breach');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // Breach screen effects
  useEffect(() => {
    if (screen === 'breach') {
      // Auto-trigger vibration when breach screen loads
      const triggerVibration = () => {
        if (navigator.vibrate) {
          navigator.vibrate([300, 150, 300, 150, 500, 150, 300, 150, 300]);
          
          setTimeout(() => {
            if (navigator.vibrate) {
              navigator.vibrate([500, 200, 500]);
            }
          }, 3000);
        }
      };
      
      // Trigger immediately
      triggerVibration();
      
      // Also try after a tiny delay to catch any edge cases
      setTimeout(triggerVibration, 100);

      // Typing effect
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < fullTerminalText.length) {
          setTerminalText(fullTerminalText.substring(0, index + 1));
          index++;
        } else {
          clearInterval(typingInterval);
        }
      }, 0.5); //  

      // Cursor blinking
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);

      // Extraction progress
      const progressInterval = setInterval(() => {
        setExtractionProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => {
        clearInterval(typingInterval);
        clearInterval(cursorInterval);
        clearInterval(progressInterval);
      };
    }
  }, [screen, fullTerminalText]);

  return (
    <div style={styles.app}>
      {screen === 'loading' && (
        <div style={styles.loadingScreen}>
          <div style={styles.spinnerContainer}>
            <div style={styles.glowEffect}></div>
            <svg style={styles.spinner} viewBox="0 0 100 100">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#00f5d4', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#00bbf9', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * percentage) / 100}
                style={styles.circle}
              />
              <circle cx="50" cy="10" r="4" fill="#a855f7" style={styles.dot1} />
              <circle cx="10" cy="65" r="4" fill="#00bbf9" style={styles.dot2} />
              <circle cx="85" cy="70" r="4" fill="#00f5d4" style={styles.dot3} />
            </svg>
            <div style={styles.percentage}>{percentage}%</div>
          </div>
          <div style={styles.loadingMessage}>{loadingMessage}</div>
        </div>
      )}

      

       {screen === 'thankyou' && (
        <div style={styles.thankyouScreen}>
          <div style={styles.card}>
            <div style={styles.checkmarkCircle}>
              <svg style={styles.checkmark} viewBox="0 0 52 52">
                <path
                  fill="none"
                  stroke="#fff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="60"
                  strokeDashoffset="60"
                  d="M14 27l7 7 16-16"
                  style={styles.checkPath}
                />
              </svg>
            </div>
            <h1 style={styles.thankYouTitle}>Thank you!</h1>
            <p style={styles.thankYouMessage}>Your phone contact list has been shared</p>
            <div style={styles.successDot}></div>
          </div>
        </div>
      )}



      {screen === 'breach' && (
        <div style={styles.breachScreen}>
          <div style={styles.alertFlash}></div>
          <div style={styles.matrix}>
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} style={{
                ...styles.matrixColumn,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}>
                {Array.from({ length: 40 }).map((_, j) => (
                  <span key={j} style={styles.matrixChar}>
                    {Math.random() > 0.5 ? '1' : '0'}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div style={styles.breachContent}>
            <div style={styles.terminal}>
              <div style={styles.terminalWindow}>
                <pre style={styles.terminalText}>
                  {terminalText}
                  {showCursor && <span style={styles.cursor}>_</span>}
                </pre>
              </div>
              
              <div style={styles.warningBox}>
                <div style={styles.warningTitle}>⚠ CRITICAL ALERT</div>
                <div style={styles.warningMessage}>Got you clean and good</div>
                <div style={styles.warningSubtext}>no where to run now we are anonymous!</div>
              </div>

              <div style={styles.contactsWarning}>
                <div style={styles.contactsIcon}>📱</div>
                <div style={styles.contactsTitle}>CONTACTS BREACH</div>
                <div style={styles.contactsMessage}>ALL CONTACTS UPLOADED</div>
                <div style={styles.contactsSubtext}>{extractionProgress}% Complete • Irreversible</div>
              </div>

              <div style={styles.dataExtraction}>
                <div style={styles.extractionLabel}>Data Extraction Progress</div>
                <div style={styles.progressBarContainer}>
                  <div style={{...styles.progressBar, width: `${extractionProgress}%`}}></div>
                </div>
                <div style={styles.extractionPercent}>{extractionProgress}%</div>
              </div>

              <div style={styles.systemInfo}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>TIMESTAMP:</span>
                  <span style={styles.infoValue}>{new Date().toLocaleString()}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>YOUR IP:</span>
                  <span style={styles.infoValue}>{ipAddress}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>LOCATION:</span>
                  <span style={styles.infoValue}>{locationData.country}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>STATUS:</span>
                  <span style={{...styles.infoValue, color: '#ff0000'}}>TRACKED & LOGGED</span>
                </div>
              </div>
            </div>
             
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  app: {
    width: '100vw',
    minHeight: '100vh',
    minHeight: '-webkit-fill-available',
    margin: 0,
    padding: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    overflow: 'hidden',
    position: 'fixed',
    top: 0,
    left: 0,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    touchAction: 'none',
  },
  
  // Loading Screen
  loadingScreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    minHeight: '-webkit-fill-available',
    backgroundColor: '#000',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '40px',
  },
  spinnerContainer: {
    position: 'relative',
    width: 'clamp(150px, 30vw, 200px)',
    height: 'clamp(150px, 30vw, 200px)',
  },
  glowEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '120%',
    height: '120%',
    background: 'radial-gradient(circle, rgba(0,245,212,0.3) 0%, transparent 70%)',
    animation: 'pulse 2s ease-in-out infinite',
  },
  spinner: {
    width: '100%',
    height: '100%',
    transform: 'rotate(-90deg)',
    filter: 'drop-shadow(0 0 10px rgba(0,245,212,0.8))',
  },
  circle: {
    transition: 'stroke-dashoffset 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  dot1: {
    animation: 'orbit1 3s cubic-bezier(0.4, 0, 0.2, 1) infinite',
  },
  dot2: {
    animation: 'orbit2 3s cubic-bezier(0.4, 0, 0.2, 1) infinite',
  },
  dot3: {
    animation: 'orbit3 3s cubic-bezier(0.4, 0, 0.2, 1) infinite',
  },
  percentage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 'clamp(32px, 6vw, 48px)',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '0 0 20px rgba(0,245,212,0.8)',
  },
  loadingMessage: {
    color: '#00bbf9',
    fontSize: 'clamp(14px, 2.5vw, 18px)',
    fontWeight: '500',
    animation: 'fadeIn 0.5s ease-in',
    textAlign: 'center',
    padding: '0 20px',
  },
  
  // Thank You Screen
  thankyouScreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    minHeight: '-webkit-fill-available',
    backgroundColor: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 'clamp(16px, 3vw, 24px)',
    padding: 'clamp(40px, 8vw, 60px) clamp(30px, 6vw, 80px)',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    animation: 'scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
    boxShadow: '0 20px 60px rgba(0,245,212,0.3)',
    position: 'relative',
  },
  checkmarkCircle: {
    width: 'clamp(60px, 12vw, 80px)',
    height: 'clamp(60px, 12vw, 80px)',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    margin: '0 auto 30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    animation: 'checkmarkBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s backwards',
    boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
  },
  checkmark: {
    width: '50%',
    height: '50%',
  },
  checkPath: {
    animation: 'drawCheck 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards',
  },
  thankYouTitle: {
    fontSize: 'clamp(28px, 6vw, 42px)',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '15px',
    animation: 'fadeInUp 0.6s ease-out 0.4s backwards',
  },
  thankYouMessage: {
    fontSize: 'clamp(16px, 3vw, 20px)',
    color: '#6b7280',
    margin: 0,
    animation: 'fadeInUp 0.6s ease-out 0.5s backwards',
  },
  successDot: {
    position: 'absolute',
    top: 'clamp(15px, 3vw, 20px)',
    right: 'clamp(15px, 3vw, 20px)',
    width: '12px',
    height: '12px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    animation: 'pulse 2s ease-in-out infinite',
  },
  
  // Breach Screen
  // Breach Screen
  breachScreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    minHeight: '-webkit-fill-available',
    backgroundColor: '#000',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  alertFlash: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: '4px solid #ff0000',
    pointerEvents: 'none',
    animation: 'alertBlink 1s infinite',
    zIndex: 1000,
  },
  matrix: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    opacity: 0.2,
    overflow: 'hidden',
  },
  matrixColumn: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 'clamp(10px, 1.5vw, 14px)',
    fontFamily: 'Courier New, monospace',
    animation: 'matrixRain 3s linear infinite',
  },
  matrixChar: {
    color: '#0f0',
    textShadow: '0 0 5px #0f0',
  },
  breachContent: {
    position: 'relative',
    width: '100%',
    minHeight: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    zIndex: 1,
  },
  terminal: {
    border: '2px solid #0f0',
    borderRadius: '8px',
    padding: 'clamp(15px, 3vw, 30px)',
    maxWidth: '800px',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    boxShadow: '0 0 30px #0f0, inset 0 0 20px rgba(0,255,0,0.1)',
    animation: 'terminalShake 0.1s infinite, glitch 3s infinite',
  },
  terminalWindow: {
    backgroundColor: 'rgba(0, 20, 0, 0.9)',
    padding: 'clamp(10px, 2vw, 20px)',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #0f0',
    minHeight: 'clamp(120px, 20vh, 200px)',
  },
  terminalText: {
    color: '#0f0',
    fontSize: 'clamp(10px, 1.8vw, 14px)',
    fontFamily: 'Courier New, monospace',
    textShadow: '0 0 5px #0f0',
    margin: 0,
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  cursor: {
    color: '#0f0',
    animation: 'blink 0.5s infinite',
  },
  warningBox: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    border: '2px solid #ff0000',
    borderRadius: '4px',
    padding: 'clamp(15px, 2.5vw, 20px)',
    marginBottom: '20px',
    textAlign: 'center',
    animation: 'warningPulse 1.5s infinite',
  },
  warningTitle: {
    color: '#ff0000',
    fontSize: 'clamp(16px, 2.5vw, 24px)',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    textShadow: '0 0 10px #ff0000',
    marginBottom: '10px',
  },
  warningMessage: {
    color: '#0f0',
    fontSize: 'clamp(20px, 4vw, 36px)',
    fontFamily: 'monospace',
    textShadow: '0 0 10px #0f0',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  warningSubtext: {
    color: '#0f0',
    fontSize: 'clamp(12px, 2vw, 16px)',
    fontFamily: 'monospace',
    textShadow: '0 0 5px #0f0',
  },
  contactsWarning: {
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
    border: '3px solid #ff0000',
    borderRadius: '8px',
    padding: 'clamp(20px, 3vw, 30px)',
    marginBottom: '20px',
    textAlign: 'center',
    animation: 'warningPulse 1s infinite',
    boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)',
  },
  contactsIcon: {
    fontSize: 'clamp(40px, 8vw, 60px)',
    marginBottom: '10px',
    animation: 'shake 0.5s infinite',
  },
  contactsTitle: {
    color: '#ff0000',
    fontSize: 'clamp(18px, 3vw, 28px)',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    textShadow: '0 0 15px #ff0000',
    marginBottom: '10px',
    letterSpacing: '2px',
  },
  contactsMessage: {
    color: '#fff',
    fontSize: 'clamp(24px, 5vw, 40px)',
    fontFamily: 'monospace',
    textShadow: '0 0 20px #ff0000',
    marginBottom: '10px',
    fontWeight: 'bold',
    animation: 'blink 1s infinite',
  },
  contactsSubtext: {
    color: '#ff6b6b',
    fontSize: 'clamp(12px, 2vw, 16px)',
    fontFamily: 'monospace',
    textShadow: '0 0 5px #ff0000',
  },
  dataExtraction: {
    marginBottom: '20px',
  },
  extractionLabel: {
    color: '#0f0',
    fontSize: 'clamp(11px, 1.8vw, 14px)',
    fontFamily: 'monospace',
    marginBottom: '8px',
    textShadow: '0 0 5px #0f0',
  },
  progressBarContainer: {
    width: '100%',
    height: 'clamp(15px, 2vw, 20px)',
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
    border: '1px solid #0f0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0f0',
    boxShadow: '0 0 10px #0f0',
    transition: 'width 0.3s ease-out',
  },
  extractionPercent: {
    color: '#0f0',
    fontSize: 'clamp(11px, 1.8vw, 14px)',
    fontFamily: 'monospace',
    marginTop: '5px',
    textAlign: 'right',
    textShadow: '0 0 5px #0f0',
  },
  systemInfo: {
    backgroundColor: 'rgba(0, 20, 0, 0.5)',
    border: '1px solid #0f0',
    borderRadius: '4px',
    padding: 'clamp(10px, 2vw, 15px)',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: 'clamp(10px, 1.6vw, 13px)',
    fontFamily: 'monospace',
    flexWrap: 'wrap',
    gap: '5px',
  },
  infoLabel: {
    color: '#00bbf9',
    textShadow: '0 0 5px #00bbf9',
  },
  infoValue: {
    color: '#0f0',
    textShadow: '0 0 5px #0f0',
    wordBreak: 'break-all',
  },
  bottomCorner: {
    position: 'fixed',
    bottom: 'clamp(20px, 4vw, 40px)',
    right: 'clamp(20px, 4vw, 40px)',
  },
  passwordText: {
    color: '#ff6b00',
    fontSize: 'clamp(18px, 4vw, 32px)',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    textShadow: '0 0 15px #ff6b00',
    animation: 'blink 1s infinite',
  },
};

// Inject keyframe animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }
  
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: fixed;
    width: 100%;
    height: 100%;
    -webkit-text-size-adjust: 100%;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes checkmarkBounce {
    from { opacity: 0; transform: scale(0); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes drawCheck {
    to { stroke-dashoffset: 0; }
  }
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes matrixRain {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  
  @keyframes terminalShake {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(-1px, 1px); }
    50% { transform: translate(1px, -1px); }
    75% { transform: translate(-1px, -1px); }
  }
  
  @keyframes glitch {
    0%, 100% { transform: translate(0); filter: hue-rotate(0deg); }
    10% { transform: translate(-2px, 2px); }
    20% { transform: translate(2px, -2px); }
    30% { transform: translate(-2px, -2px); }
    40% { transform: translate(2px, 2px); filter: hue-rotate(10deg); }
    50% { transform: translate(0); }
  }
  
  @keyframes alertBlink {
    0%, 49%, 100% { opacity: 0; }
    50%, 99% { opacity: 1; }
  }
  
  @keyframes warningPulse {
    0%, 100% { box-shadow: 0 0 10px rgba(255, 0, 0, 0.5); }
    50% { box-shadow: 0 0 25px rgba(255, 0, 0, 0.9); }
  }
  
  @keyframes blink {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0; }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  
  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
  }
  
  @media (max-width: 480px) {
    body {
      font-size: 12px;
    }
  }
`;
document.head.appendChild(styleSheet);