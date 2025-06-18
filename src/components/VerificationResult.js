import { motion } from 'framer-motion';

const VerificationResult = ({ result, onReset }) => {
  const getScoreColor = (score) => {
    if (score >= 70) return '#27ae60';
    if (score >= 40) return '#f39c12';
    return '#e74c3c';
  };

  const downloadReport = () => {
    // In a real app, generate PDF here
    alert('PDF report downloaded!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="result-container"
    >
      <h2>Verification Complete</h2>
      
      <div className="score-card" style={{ borderColor: getScoreColor(result.score) }}>
        <div className="score-circle" style={{ background: getScoreColor(result.score) }}>
          {result.score}
        </div>
        <p>Trust Score</p>
      </div>

      <div className="result-details">
        <div className="detail-row">
          <span>Vendor Name:</span>
          <strong>{result.vendorName}</strong>
        </div>
        <div className="detail-row">
          <span>GSTIN:</span>
          <strong className={result.valid ? 'valid' : 'invalid'}>
            {result.gstin} {result.valid ? '✓' : '✗'}
          </strong>
        </div>
        <div className="detail-row">
          <span>Last GST Filed:</span>
          <strong>{result.lastFiled}</strong>
        </div>
        <div className="detail-row">
          <span>Reputation Score:</span>
          <strong>{result.reputationScore}/5</strong>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={downloadReport} className="download-btn">
          Download Full Report
        </button>
        <button onClick={onReset} className="reset-btn">
          Verify Another Vendor
        </button>
      </div>
    </motion.div>
  );
};

export default VerificationResult;