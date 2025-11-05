import Header from '../components/Header';
import ProgressTracker from '../components/ProgressTracker';
import { FiActivity, FiTrendingUp, FiAward } from 'react-icons/fi';

const ProgressSync = () => {
  const stats = [
    { icon: FiActivity, label: 'Reading Time', value: '12h 45m' },
    { icon: FiTrendingUp, label: 'Documents Read', value: '24' },
    { icon: FiAward, label: 'Completion Rate', value: '78%' }
  ];

  return (
    <div className="min-h-screen w-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl text-text mb-4">Reading Progress</h1>
                <p className="text-text/70 text-lg md:text-xl leading-relaxed">Track your reading journey across all devices</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 md:p-8 text-center border border-border shadow-sm">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-accent1 to-accent2 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="text-white text-xl md:text-2xl" />
                    </div>
                    <div className="text-2xl md:text-3xl font-serif text-text mb-2">{stat.value}</div>
                    <div className="text-sm md:text-base text-text/70">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Current Reading */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-border shadow-sm">
                <h3 className="font-serif text-xl md:text-2xl text-text mb-6">Currently Reading</h3>

                <div className="space-y-6">
                  {[
                    { title: 'AI in Modern Healthcare', progress: 65 },
                    { title: 'Sustainable Business Models', progress: 30 },
                    { title: 'The Future of Education', progress: 85 }
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-text mb-2 text-lg">{doc.title}</h4>
                        <div className="w-full bg-border rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-accent1 to-accent2 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${doc.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-text/70 text-sm md:text-base ml-4 font-medium">{doc.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex items-center justify-center">
              <ProgressTracker />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressSync;