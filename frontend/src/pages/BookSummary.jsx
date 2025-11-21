import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { FiArrowLeft, FiBookmark, FiShare2, FiPlay } from 'react-icons/fi';
import { documentsAPI } from '../services/api';

const BookSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchDocument();
    }
  }, [id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await documentsAPI.getDocument(id);
      setDocument(response.data);
    } catch (err) {
      setError('Failed to load document');
      console.error('Error fetching document:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-accent1/30 border-t-accent1 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text/70">Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen w-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl text-text mb-4">Document not found</h1>
            <p className="text-text/70 mb-4">{error}</p>
            <button
              onClick={() => navigate('/library')}
              className="bg-accent1 text-text px-6 py-3 rounded-xl"
            >
              Back to Library
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen w-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl text-text mb-4">Book not found</h1>
            <button
              onClick={() => navigate('/library')}
              className="bg-accent1 text-text px-6 py-3 rounded-xl"
            >
              Back to Library
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1 w-full flex flex-col px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/library')}
            className="flex items-center space-x-2 text-text/70 hover:text-text transition-colors"
          >
            <FiArrowLeft className="text-lg" />
            <span>Back to Library</span>
          </button>

          <div className="flex items-center space-x-4">
            <button className="text-text/70 hover:text-text transition-colors">
              <FiBookmark className="text-lg" />
            </button>
            <button className="text-text/70 hover:text-text transition-colors">
              <FiShare2 className="text-lg" />
            </button>
          </div>
        </div>

        {/* Book Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-text mb-3">
                {book.title}
              </h1>
              <div className="flex items-center space-x-4 text-text/70 text-sm">
                <span>By {book.author}</span>
                <span>•</span>
                <span>{book.published}</span>
                <span>•</span>
                <span>{book.pages} pages</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`text-xs font-medium px-3 py-1 rounded-full ${
                book.mode === 'story'
                  ? 'bg-gradient-to-r from-accent1 to-accent2 text-text'
                  : 'bg-primary text-text'
              }`}>
                {book.mode === 'story' ? 'Story Mode' : 'Direct Mode'}
              </div>
              <button
                onClick={() => navigate('/read', { state: { mode: book.mode, fileName: book.title } })}
                className="bg-gradient-to-r from-accent1 to-accent2 text-text px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <FiPlay className="text-lg" />
                <span>Start Reading</span>
              </button>
            </div>
          </div>

          {/* Interest Tag */}
          <div className="mb-8">
            <span className="bg-accent1/10 text-accent1 px-4 py-2 rounded-full text-sm font-medium">
              Related to your interest in {book.interest}
            </span>
          </div>
        </div>

        {/* Summary Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-border">
            <h2 className="font-serif text-2xl md:text-3xl text-text mb-6">Summary</h2>

            <div className="prose prose-lg md:prose-xl max-w-none">
              <p className="text-text/80 leading-relaxed mb-6">
                {book.summary}
              </p>
            </div>

            {/* Reading Progress */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between text-sm text-text/70 mb-4">
                <span>Your Progress</span>
                <span>0% complete</span>
              </div>
              <div className="w-full bg-border rounded-full h-3">
                <div className="bg-gradient-to-r from-accent1 to-accent2 h-3 rounded-full w-0 transition-all duration-500"></div>
              </div>

              <div className="flex items-center justify-center mt-8">
                <button
                  onClick={() => navigate('/read', { state: { mode: book.mode, fileName: book.title } })}
                  className="bg-gradient-to-r from-accent1 to-accent2 text-text px-8 py-4 rounded-xl hover:shadow-lg transition-all font-medium text-lg flex items-center space-x-2"
                >
                  <FiPlay className="text-lg" />
                  <span>Begin Reading</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSummary;
