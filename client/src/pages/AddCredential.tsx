import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import TopBar from '../components/layout/TopBar';
import Button from '../components/ui/Button';
import Step1_Category from '../components/forms/Step1_Category';
import Step2_Fields from '../components/forms/Step2_Fields';
import Step3_Review from '../components/forms/Step3_Review';
import api from '../lib/api';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function AddCredential() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let documentUrl: string | undefined;
      let documentName: string | undefined;

      // Upload file first if exists
      if (file) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        const uploadRes = await api.post('/upload', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        documentUrl = uploadRes.data.url;
        documentName = uploadRes.data.name;
      }

      // Get date fields from formData
      const issuedDate = formData.issuedDate || formData.startDate || formData.date;
      const expiryDate = formData.expiryDate || formData.endDate;

      await api.post('/credentials', {
        category,
        title,
        issuer,
        issuedDate,
        expiryDate,
        metadata: formData,
        documentUrl,
        documentName,
      });

      setSuccess(true);
    } catch (err) {
      console.error('Failed to create credential', err);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return !!category;
    if (currentStep === 2) return !!title;
    return true;
  };

  if (success) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="w-16 h-16 rounded-full bg-sage flex items-center justify-center mb-4">
          <Check size={32} className="text-white" />
        </div>
        <h2 className="font-display text-2xl text-dark mb-2">Credential saved!</h2>
        <p className="text-sm text-dark-muted font-sans mb-6">
          Your credential has been securely stored in your wallet.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate('/wallet')}>
            View Wallet
          </Button>
          <Button onClick={() => {
            setSuccess(false);
            setCurrentStep(1);
            setCategory('');
            setTitle('');
            setIssuer('');
            setFormData({});
            setFile(null);
          }}>
            Add Another
          </Button>
        </div>
      </motion.div>
    );
  }

  const steps = [
    { num: 1, label: 'Select Category' },
    { num: 2, label: 'Fill Details' },
    { num: 3, label: 'Review & Save' },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25 }}
    >
      <TopBar title="Add Credential" />

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.num} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-sans font-medium ${
                  currentStep > step.num
                    ? 'bg-sage text-white'
                    : currentStep === step.num
                    ? 'bg-sage text-white'
                    : 'bg-beige text-dark-muted'
                }`}
              >
                {currentStep > step.num ? <Check size={16} /> : step.num}
              </div>
              <span
                className={`text-sm font-sans ${
                  currentStep >= step.num ? 'text-dark font-medium' : 'text-dark-muted'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-3 ${
                  currentStep > step.num ? 'bg-sage' : 'bg-beige'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {currentStep === 1 && (
          <Step1_Category
            selectedCategory={category}
            onSelect={setCategory}
          />
        )}
        {currentStep === 2 && (
          <Step2_Fields
            category={category}
            formData={formData}
            onChange={handleFieldChange}
            title={title}
            issuer={issuer}
            onTitleChange={setTitle}
            onIssuerChange={setIssuer}
            file={file}
            onFileSelect={setFile}
            onFileClear={() => setFile(null)}
          />
        )}
        {currentStep === 3 && (
          <Step3_Review
            category={category}
            title={title}
            issuer={issuer}
            formData={formData}
            file={file}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep((s) => s - 1)}
          disabled={currentStep === 1}
        >
          <ArrowLeft size={16} />
          Back
        </Button>

        {currentStep < 3 ? (
          <Button
            onClick={() => setCurrentStep((s) => s + 1)}
            disabled={!canProceed()}
          >
            Next
            <ArrowRight size={16} />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Credential'}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
