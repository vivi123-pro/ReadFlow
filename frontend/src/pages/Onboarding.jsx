import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import InterestCard from '../components/InterestCard';
import { FiCode, FiTrendingUp, FiGlobe, FiHeart, FiMusic, FiCamera } from 'react-icons/fi';
import { authAPI } from '../services/api';

const Onboarding = () => {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [step, setStep] = useState(1);
  const [selectedTone, setSelectedTone] = useState(null);

  const interests = [
    { id: 'technology', title: 'Technology', icon: FiCode },
    { id: 'business', title: 'Business', icon: FiTrendingUp },
    { id: 'science', title: 'Science', icon: FiGlobe },
    { id: 'health', title: 'Health', icon: FiHeart },
    { id: 'arts', title: 'Arts', icon: FiMusic },
    { id: 'design', title: 'Design', icon: FiCamera }
  ];

  const tones = [
    { id: 'professional', title: 'Professional', description: 'Clean, factual, and straightforward' },
    { id: 'story', title: 'Story-Driven', description: 'Narrative, engaging, and immersive' },
    { id: 'hybrid', title: 'Hybrid', description: 'Balanced mix of professional and narrative' }
  ];

  const toggleInterest = (interestId) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-4xl">
          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-accent1 rounded-full flex items-center justify-center text-text text-sm font-medium">
                1
              </div>
              <div className="flex-1 h-1 bg-border mx-4"></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 2 ? 'bg-accent1 text-text' : 'bg-border text-text/70'
              }`}>
                2
              </div>
            </div>
          </div>

          {step === 1 ? (
            <div className="text-center">
              <h1 className="font-serif text-4xl md:text-5xl text-text mb-6">
                Let's make reading feel like your story
              </h1>
              <p className="text-text/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Select topics that interest you. We'll use these to personalize your reading experience.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                {interests.map(interest => (
                  <InterestCard
                    key={interest.id}
                    title={interest.title}
                    icon={interest.icon}
                    selected={selectedInterests.includes(interest.id)}
                    onClick={() => toggleInterest(interest.id)}
                  />
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={selectedInterests.length === 0}
                className="bg-gradient-to-r from-accent1 to-accent2 text-text px-12 py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
              >
                Continue
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="font-serif text-4xl md:text-5xl text-text mb-6">
                Choose your reading style
              </h1>
              <p className="text-text/70 text-lg md:text-xl mb-12 leading-relaxed">
                How would you like your documents transformed?
              </p>

              <div className="space-y-6 mb-12 max-w-2xl mx-auto">
                {tones.map(tone => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={`w-full text-left p-8 rounded-2xl border-2 transition-all bg-white/50 backdrop-blur-sm ${
                      selectedTone === tone.id
                        ? 'border-accent1 bg-accent1/10'
                        : 'border-border hover:border-accent1/50 hover:bg-accent1/5'
                    }`}
                  >
                    <h3 className="font-serif text-xl md:text-2xl text-text mb-3">{tone.title}</h3>
                    <p className="text-text/70 text-lg leading-relaxed">{tone.description}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={handleComplete}
                disabled={!selectedTone || isLoading}
                className="bg-gradient-to-r from-accent1 to-accent2 text-text px-12 py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-text/30 border-t-text rounded-full animate-spin"></div>
                ) : (
                  'Start Reading'
                )}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Onboarding;