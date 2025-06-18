import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { verifyGSTIN } from '../api/mockGSTIN';

const OnboardingForm = ({ onVerificationComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    vendorName: '',
    gstin: '',
    contactEmail: '',
    phone: '',
    document: null
  });
  const [errors, setErrors] = useState({});
  const [isValidGSTIN, setIsValidGSTIN] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewURL, setPreviewURL] = useState('');

  // Real-time GSTIN validation
  useEffect(() => {
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    setIsValidGSTIN(gstinRegex.test(formData.gstin));
  }, [formData.gstin]);

  const validateField = (name, value) => {
  let error = '';
  switch (name) {
    case 'vendorName':
      error = value ? '' : 'Required';
      break;
    case 'gstin':
      error = isValidGSTIN ? '' : 'Invalid format (e.g. 22ABCDE1234F1Z5)';
      break;
    case 'phone':
      error = /^[0-9]{10}$/.test(value) ? '' : '10 digits required';
      break;
    default:
      break; // Add this default case
  }
  setErrors({ ...errors, [name]: error });
};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, document: file });
    setPreviewURL(URL.createObjectURL(file));
  };

  const nextStep = () => {
    if (step === 1 && (!formData.vendorName || !isValidGSTIN)) return;
    if (step === 2 && (!formData.contactEmail || errors.phone)) return;
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const verificationResult = await verifyGSTIN(formData.gstin);
    setLoading(false);
    onVerificationComplete({
      ...formData,
      ...verificationResult,
      score: verificationResult.valid ? 78 : 30
    });
  };

  return (
    <div className="interactive-form">
      {/* Animated Stepper */}
      <div className="stepper">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`step ${i <= step ? 'active' : ''}`}
            animate={{ scale: i === step ? 1.1 : 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            {i}
          </motion.div>
        ))}
      </div>

      {/* Step 1: Company Details */}
      <AnimatePresence mode='wait'>
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="form-step"
          >
            <h2>Company Details</h2>
            <div className={`form-group ${errors.vendorName ? 'error' : ''}`}>
              <label>Vendor Name*</label>
              <input
                type="text"
                value={formData.vendorName}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                onBlur={() => validateField('vendorName', formData.vendorName)}
              />
              {errors.vendorName && <span className="error-message">{errors.vendorName}</span>}
            </div>

            <div className={`form-group ${errors.gstin ? 'error' : ''}`}>
              <label>GSTIN*</label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                onBlur={() => validateField('gstin', formData.gstin)}
                placeholder="22ABCDE1234F1Z5"
              />
              <div className="hint">
                {formData.gstin && (
                  <span className={isValidGSTIN ? 'valid' : 'invalid'}>
                    {isValidGSTIN ? '✓ Valid' : '✗ Invalid'}
                  </span>
                )}
              </div>
            </div>

            <button 
              onClick={nextStep}
              disabled={!formData.vendorName || !isValidGSTIN}
            >
              Next
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2: Contact Info */}
      {step === 2 && (
        <motion.div
          key="step2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="form-step"
        >
          <h2>Contact Information</h2>
          <div className={`form-group ${errors.contactEmail ? 'error' : ''}`}>
            <label>Email*</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              onBlur={() => validateField('contactEmail', formData.contactEmail)}
            />
          </div>

          <div className={`form-group ${errors.phone ? 'error' : ''}`}>
            <label>Phone*</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
              onBlur={() => validateField('phone', formData.phone)}
              maxLength="10"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="button-group">
            <button className="secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button onClick={nextStep} disabled={!formData.contactEmail || errors.phone}>
              Next
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Document Upload */}
      {step === 3 && (
        <motion.div
          key="step3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="form-step"
        >
          <h2>Document Verification</h2>
          
          <div className="drag-drop">
            <label htmlFor="document-upload">
              {previewURL ? (
                <img src={previewURL} alt="Document Preview" className="document-preview" />
              ) : (
                <>
                  <p>Upload PAN Card (PDF/Image)</p>
                  <p className="small">Click to browse files</p>
                </>
              )}
            </label>
            <input 
              id="document-upload"
              type="file" 
              accept=".pdf,.jpg,.png" 
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="button-group">
            <button className="secondary" onClick={() => setStep(2)}>
              Back
            </button>
            <button onClick={handleSubmit} disabled={loading || !formData.document}>
              {loading ? (
                <>
                  <span className="spinner"></span> Verifying...
                </>
              ) : (
                'Complete Verification'
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OnboardingForm;