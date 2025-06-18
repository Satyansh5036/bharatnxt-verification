import { useState } from 'react';
import { motion } from 'framer-motion';
import OnboardingForm from './components/OnboardingForm';
import VerificationResult from './components/VerificationResult';
import './App.css';

function App() {
  const [verificationResult, setVerificationResult] = useState(null);

  return (
    <div className="app">
      <motion.header
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <h1>BharatNXT Vendor Verification</h1>
        <p>Automated supplier due diligence platform</p>
      </motion.header>

      <main>
        {!verificationResult ? (
          <OnboardingForm onVerificationComplete={setVerificationResult} />
        ) : (
          <VerificationResult 
            result={verificationResult} 
            onReset={() => setVerificationResult(null)} 
          />
        )}
      </main>

      <footer>
        <p>© 2024 BharatNXT. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;