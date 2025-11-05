import Header from '../components/Header';
import DocumentCard from '../components/DocumentCard';
import UploadArea from '../components/UploadArea';
import { FiSearch, FiPlus, FiFilter, FiUpload, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Library = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const documents = [
    {
      id: 1,
      title: "The Future of Machine Learning in Healthcare",
      progress: 75,
      mode: 'story',
      interest: 'Technology',
      lastRead: '2 hours ago'
    },
    {
      id: 2,
      title: "Quarterly Business Analysis Report Q3 2024",
      progress: 30,
      mode: 'direct',
      interest: 'Business',
      lastRead: '1 day ago'
    },
    {
      id: 3,
      title: "Climate Change and Sustainable Development",
      progress: 100,
      mode: 'story',
      interest: 'Science',
      lastRead: '3 days ago'
    },
    {
      id: 4,
      title: "Digital Transformation in Education",
      progress: 45,
      mode: 'hybrid',
      interest: 'Technology',
      lastRead: '1 week ago'
    }
  ];

  return (
    <div className="min-h-screen w-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full flex flex-col px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-text mb-2">Your Library</h1>
            <p className="text-text/70 text-lg">Your personalized collection of transformed documents</p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-to-r from-accent1 to-accent2 text-text px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <FiPlus className="text-lg" />
            <span>Add Document</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent1" />
            <input
              type="text"
              placeholder="Search your library..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-border focus:border-accent1 focus:ring-2 focus:ring-accent1/20 transition-all outline-none"
            />
          </div>

          <button className="flex items-center space-x-2 px-6 py-4 bg-white rounded-2xl border border-border hover:border-accent1/50 transition-colors">
            <FiFilter className="text-text/70" />
            <span className="text-text/70">Filter</span>
          </button>
        </div>

        {/* Documents Grid */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {documents.map(doc => (
                <DocumentCard
                  key={doc.id}
                  id={doc.id}
                  title={doc.title}
                  progress={doc.progress}
                  mode={doc.mode}
                  interest={doc.interest}
                  lastRead={doc.lastRead}
                />
              ))}
            </div>

            {/* AI Suggestions */}
            <div className="bg-accent1/5 rounded-3xl p-8 md:p-12 border border-border">
              <h2 className="font-serif text-2xl md:text-3xl text-text mb-4">AI Suggestions</h2>
              <p className="text-text/70 text-lg mb-6">
                Based on your reading patterns, you might enjoy these related topics:
              </p>

              <div className="flex flex-wrap gap-3">
                {['Artificial Intelligence Ethics', 'Sustainable Tech', 'Digital Health Innovations', 'Future of Work'].map((topic, index) => (
                  <span
                    key={index}
                    className="bg-white text-text/70 px-4 py-2 rounded-full border border-border hover:border-accent1/50 transition-colors cursor-pointer"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-accent1 to-accent2 rounded-xl flex items-center justify-center">
                    <FiUpload className="text-white text-xl" />
                  </div>
                  <h2 className="font-serif text-2xl text-text">Add New Document</h2>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-text/50 hover:text-text transition-colors"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>

              <UploadArea />

              <div className="mt-6 text-center">
                <p className="text-text/70 text-sm">
                  Supported formats: PDF, DOC, DOCX, TXT (Max 50MB)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;