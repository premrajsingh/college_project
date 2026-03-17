import React, { useState, useRef, useEffect } from 'react';
import { Lightbulb, Users, Calendar, UploadCloud, ArrowRight, BrainCircuit, ShieldAlert, CheckCircle, Activity, ChevronRight, File, Image as ImageIcon } from 'lucide-react';
import { estimatePlanning, getPlanningDetails } from '../services/api';

const ProjectPlanning = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    teamSize: '1',
    experience: 'Intermediate',
    description: '',
    expectedDays: '30'
  });
  const [file, setFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [planningId, setPlanningId] = useState(null);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setStep(4); // Moving to Analyzing Step
    
    try {
      const data = new FormData();
      data.append('team_size', formData.teamSize);
      data.append('experience', formData.experience);
      data.append('description', formData.description || 'Not provided');
      data.append('expected_days', formData.expectedDays);
      if (file) {
        data.append('file', file);
      }
      
      const res = await estimatePlanning(data);
      if (res && res.planning_id) {
        setPlanningId(res.planning_id);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to initiate planning analysis.");
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (planningId && !result && loading) {
      const fetchResult = async () => {
        try {
          const data = await getPlanningDetails(planningId);
          if (data && data.status === 'completed' && data.estimation) {
            setResult(data.estimation);
            setLoading(false);
            clearInterval(interval);
          } else if (data && data.status === 'failed') {
             setError(data.error_message || "Analysis failed.");
             setLoading(false);
             clearInterval(interval);
          }
        } catch (err) {
          console.error("Error polling", err);
        }
      };
      fetchResult();
      interval = setInterval(fetchResult, 3000);
    }
    return () => clearInterval(interval);
  }, [planningId, result, loading]);

  return (
    <div className="animate-fade-in pb-12 text-slate-800 dark:text-slate-200">
      <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <Lightbulb className="h-8 w-8 text-amber-500" /> Idea Estimator
        </h1>
        <p className="text-slate-500 mt-2">Blueprint your next big project and predict development efforts before writing a single line of code.</p>
      </div>

      <div className="max-w-4xl mx-auto">
        
        {/* Step Indicator */}
        {step < 5 && result == null && (
          <div className="flex justify-between items-center mb-10 px-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                  {s}
                </div>
                <span className={`text-[10px] uppercase font-bold mt-2 tracking-widest ${step >= s ? 'text-indigo-500' : 'text-slate-400'}`}>
                  {s === 1 ? 'Team' : s === 2 ? 'Idea' : s === 3 ? 'Specs' : 'Analyze'}
                </span>
              </div>
            ))}
            {/* Progress line */}
            <div className="absolute left-0 top-4 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10 px-12">
               <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden min-h-[400px] flex flex-col relative group p-8">
           
          {step === 1 && (
             <div className="flex-1 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Who is building this?</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2"><Users className="w-4 h-4"/> Team Size</label>
                        <input type="number" min="1" max="100" value={formData.teamSize} onChange={e => setFormData({...formData, teamSize: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0B1120] border border-slate-300 dark:border-slate-700 rounded-lg py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2"><BrainCircuit className="w-4 h-4"/> Average Experience Level</label>
                        <select value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0B1120] border border-slate-300 dark:border-slate-700 rounded-lg py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors">
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                            <option>Expert</option>
                        </select>
                    </div>
                </div>
                <div className="mt-10 flex justify-end">
                    <button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">Next Step <ArrowRight className="w-4 h-4"/></button>
                </div>
             </div>
          )}

          {step === 2 && (
             <div className="flex-1 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">What are you building?</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4"/> Project Description</label>
                        <textarea rows="4" placeholder="Describe the app you want to build (e.g., 'A social media platform for pet owners...')" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0B1120] border border-slate-300 dark:border-slate-700 rounded-lg py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4"/> Expected Completion (Days)</label>
                        <input type="number" min="1" value={formData.expectedDays} onChange={e => setFormData({...formData, expectedDays: e.target.value})} className="w-full bg-slate-50 dark:bg-[#0B1120] border border-slate-300 dark:border-slate-700 rounded-lg py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" />
                    </div>
                </div>
                <div className="mt-10 flex justify-between">
                    <button onClick={handleBack} className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-6 py-2.5 rounded-lg font-medium transition-all">Back</button>
                    <button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2" disabled={!formData.description}>Next Step <ArrowRight className="w-4 h-4"/></button>
                </div>
             </div>
          )}

          {step === 3 && (
            <div className="flex-1 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Upload Requirements</h2>
                <p className="text-slate-500 mb-6 text-sm">Upload a PDF specification document or an image of your Figma design to give the AI more context (Optional).</p>
                <div className="border-2 border-dashed border-indigo-500/30 rounded-xl p-10 flex flex-col items-center justify-center bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors cursor-pointer group" onClick={() => fileInputRef.current.click()}>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,image/png,image/jpeg,image/webp" onChange={handleFileChange} />
                    {file ? (
                        <>
                            {file.type.includes('pdf') ? <File className="w-16 h-16 text-indigo-400 mb-4" /> : <ImageIcon className="w-16 h-16 text-indigo-400 mb-4" />}
                            <span className="text-slate-900 dark:text-white font-bold">{file.name}</span>
                            <span className="text-slate-500 text-sm mt-1">Click to change file</span>
                        </>
                    ) : (
                        <>
                            <UploadCloud className="w-16 h-16 text-slate-400 group-hover:text-indigo-400 transition-colors mb-4" />
                            <span className="text-slate-700 dark:text-slate-300 font-bold">Click to browse formats</span>
                            <span className="text-slate-500 text-sm mt-1">PDF, PNG, JPG supported.</span>
                        </>
                    )}
                </div>
                <div className="mt-10 flex justify-between">
                    <button onClick={handleBack} className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-6 py-2.5 rounded-lg font-medium transition-all">Back</button>
                    <button onClick={handleSubmit} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-8 py-2.5 rounded-lg font-black tracking-widest uppercase shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center gap-2 border border-cyan-400">Generate Blueprint <BrainCircuit className="w-5 h-5"/></button>
                </div>
            </div>
          )}

          {step === 4 && result == null && !error && (
            <div className="flex-1 animate-fade-in flex flex-col items-center justify-center py-10">
                <Activity className="h-16 w-16 text-cyan-400 animate-pulse mb-6" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-widest uppercase mb-2">Analyzing Architecture</h2>
                <p className="text-slate-500 font-mono text-sm max-w-sm text-center">Neural agents are currently tearing down requirements and synthesizing development models...</p>
            </div>
          )}

          {error && step === 4 && (
             <div className="flex-1 animate-fade-in flex flex-col items-center justify-center py-10 text-center">
                 <ShieldAlert className="h-16 w-16 text-red-500 mb-4"/>
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Analysis Failed</h2>
                 <p className="text-slate-500 mb-6">{error}</p>
                 <button onClick={() => setStep(1)} className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white px-6 py-2 rounded-lg font-medium">Try Again</button>
             </div>
          )}

          {result && (
            <div className="flex-1 animate-fade-in text-left">
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl mb-6 flex gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold mb-1">Blueprint Generated Successfully</h3>
                        <p className="text-sm opacity-90">{result.summary}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-50 dark:bg-[#0B1120] p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">AI Estimated Timeline</span>
                        <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 mb-2">{result.estimated_days} <span className="text-xl text-slate-500 font-normal">days</span></div>
                        <p className="text-sm text-slate-500">Based on a team of {formData.teamSize} {formData.experience} engineers.</p>
                        {formData.expectedDays < result.estimated_days && (
                             <div className="mt-3 text-xs text-amber-500 border border-amber-500/30 bg-amber-500/10 p-2 rounded">
                                 <strong>Warning:</strong> This exceeds your target timeline of {formData.expectedDays} days.
                             </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-rose-500"/> Core Risks Identified</h3>
                        <div className="grid gap-3">
                            {result.risks?.map((risk, i) => (
                                <div key={i} className="bg-rose-500/5 border border-rose-500/20 p-3 rounded-lg flex items-start gap-3">
                                     <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0 text-rose-500 text-xs font-bold">{i+1}</div>
                                     <p className="text-sm text-rose-700 dark:text-rose-300 pt-0.5">{risk}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-indigo-500"/> Expected Technical Challenges</h3>
                        <div className="grid gap-3">
                            {result.challenges?.map((challenge, i) => (
                                <div key={i} className="bg-indigo-500/5 border border-indigo-500/20 p-3 rounded-lg flex items-start gap-3">
                                     <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 text-indigo-500 text-xs font-bold"><ChevronRight className="w-4 h-4"/></div>
                                     <p className="text-sm text-indigo-800 dark:text-indigo-300 pt-0.5">{challenge}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex justify-center">
                    <button onClick={() => { setStep(1); setResult(null); setFormData({...formData, description: ''}); setFile(null); }} className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-6 py-2.5 rounded-lg font-medium transition-all">Plan Another Project</button>
                </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProjectPlanning;
