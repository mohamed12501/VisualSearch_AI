import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import PipelineStatus from './PipelineStatus';
import CaptionCard from './CaptionCard';
import ResultsList from './ResultsList';
import SummaryCard from './SummaryCard';
import { Sparkles, LogOut, User as UserIcon } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const [currentStep, setCurrentStep] = useState('upload');
  const [pipelineStatus, setPipelineStatus] = useState({
    upload: 'pending',
    caption: 'pending',
    search: 'pending',
    summarize: 'pending',
  });
  
  const [data, setData] = useState({
    caption: '',
    searchQuery: '',
    results: [],
    summary: '',
  });

  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      localStorage.removeItem('user');
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const startAnalysis = async (imageUrl, publicId) => {
    setPipelineStatus({
      upload: 'done',
      caption: 'pending',
      search: 'pending',
      summarize: 'pending',
    });
    setCurrentStep('caption');
    setError(null);

    try {
      // Use the Django Orchestrator (Polyglot Microservices)
      const response = await axios.post('/api/analyze/', { 
        imageUrl: imageUrl 
      });

      const { caption, searchQuery, results, summary } = response.data;
      
      // Update all results at once
      setData({
        caption,
        searchQuery,
        results,
        summary
      });

      // Mark everything as done
      setPipelineStatus({
        upload: 'done',
        caption: 'done',
        search: 'done',
        summarize: 'done',
      });
      setCurrentStep('done');

      // Step 5: Clean up (Delete from Cloudinary)
      try {
        await axios.post('/api/delete-image', { publicId });
        console.log('Temporary image deleted from Cloudinary.');
      } catch (deleteErr) {
        console.warn('Failed to delete temporary image:', deleteErr);
      }

    } catch (err) {
      console.error('Django Pipeline Error:', err);
      setError("The analysis pipeline is unavailable. Please check if the backend services are running in the container.");
    }
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-4">
      <div className="max-w-[900px] mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-[32px] font-bold text-primary mb-2">VisualSearch AI</h1>
            <p className="text-text-muted text-[15px]">Upload a product image to discover research, pricing, and details.</p>
          </div>
          
          <div className="flex items-center justify-center md:justify-end gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-full shadow-sm">
              <UserIcon size={14} className="text-secondary" />
              <span className="text-xs font-bold text-primary">{user || 'Loading...'}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-full bg-white border border-border text-text-muted hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-12">
          {/* Left Column: Input & Status */}
          <div className="space-y-8">
            <ImageUploader 
              onUploadSuccess={startAnalysis} 
              isAnalyzing={currentStep !== 'upload' && currentStep !== 'done'} 
            />
            
            <PipelineStatus 
              currentStep={currentStep} 
              status={pipelineStatus} 
            />

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="space-y-8">
            {(currentStep === 'caption' || data.caption) && (
              <CaptionCard 
                caption={data.caption} 
                searchQuery={data.searchQuery} 
                isLoading={currentStep === 'caption'} 
              />
            )}

            {(currentStep === 'search' || data.results.length > 0) && (
              <ResultsList 
                results={data.results} 
                isLoading={currentStep === 'search'} 
              />
            )}

            {(currentStep === 'summarize' || data.summary) && (
              <SummaryCard 
                summary={data.summary} 
                isLoading={currentStep === 'summarize'} 
              />
            )}

            {currentStep === 'upload' && !data.caption && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border rounded-2xl bg-white/50">
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center text-text-muted mb-4 opacity-50">
                  <Sparkles size={32} />
                </div>
                <p className="text-text-muted text-sm max-w-[200px]">
                  Analysis results will appear here after you upload an image.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
