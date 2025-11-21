import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ModeToggle from '../components/ModeToggle';
import { FiBookmark, FiShare2, FiSettings, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { documentsAPI } from '../services/api';

const ReadingInterface = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState('story');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [document, setDocument] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentChunk, setCurrentChunk] = useState(0);

  useEffect(() => {
    if (id) {
      fetchDocument();
    }
  }, [id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const [docResponse, chunksResponse] = await Promise.all([
        documentsAPI.getDocument(id),
        documentsAPI.getChunks(id)
      ]);
      setDocument(docResponse.data);
      setChunks(chunksResponse.data);
      setMode(docResponse.data.reading_mode);
    } catch (err) {
      setError('Failed to load document');
      console.error('Error fetching document:', err);
    } finally {
      setLoading(false);
    }
  };

  const sampleContent = {
    direct: `Artificial Intelligence has transformed how we process information. Machine learning algorithms can now analyze complex datasets and extract meaningful patterns that were previously inaccessible to human researchers.

The development of neural networks has enabled significant advances in natural language processing, allowing systems to understand and generate human-like text with remarkable accuracy.`,

    story: `In the digital renaissance of our time, a quiet revolution was unfolding. Artificial Intelligence emerged not as cold machinery, but as a curious apprentice to human knowledge, learning to read between the lines of our collective wisdom.

Like an archaeologist brushing dust from ancient scrolls, machine learning algorithms began uncovering hidden patterns in vast digital libraries. They revealed connections that had eluded even the most brilliant minds, turning raw data into meaningful insights that felt almost like intuition.`
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1 w-full flex flex-col px-4 sm:px-6 lg:px-8 py-8">
        {/* Reading Controls */}
        <div className="flex items-center justify-between mb-8">
          <button className="flex items-center space-x-2 text-text/70 hover:text-text transition-colors">
            <FiArrowLeft className="text-lg" />
            <span>Back to Library</span>
          </button>

          <ModeToggle mode={mode} onModeChange={setMode} />

          <div className="flex items-center space-x-4">
            <button className="text-text/70 hover:text-text transition-colors">
              <FiBookmark className="text-lg" />
            </button>
            <button className="text-text/70 hover:text-text transition-colors">
              <FiShare2 className="text-lg" />
            </button>
            <button className="text-text/70 hover:text-text transition-colors">
              <FiSettings className="text-lg" />
            </button>
          </div>
        </div>

        {/* Reading Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className={`max-w-4xl w-full transition-all duration-500 ${
            mode === 'story' ? 'bg-accent2/10' : 'bg-white'
          } rounded-3xl p-8 md:p-12 shadow-sm border border-border`}>
            <article className={`prose prose-lg md:prose-xl max-w-none ${
              mode === 'story'
                ? 'prose-headings:font-serif prose-headings:text-text prose-p:text-text/80 prose-p:leading-relaxed'
                : 'prose-headings:text-text prose-p:text-text/70'
            }`}>
              <h1 className={`text-3xl md:text-4xl font-light mb-8 ${
                mode === 'story' ? 'font-serif' : 'font-sans'
              }`}>
                {mode === 'story' ? 'The Dawn of Intelligent Reading' : 'Advances in Artificial Intelligence'}
              </h1>

              <p className="text-lg md:text-xl leading-relaxed mb-8">
                {sampleContent[mode]}
              </p>

              <p className="text-lg md:text-xl leading-relaxed">
                {mode === 'story'
                  ? "As these systems grew more sophisticated, they began to understand not just words, but context, emotion, and the subtle rhythms of human communication. What once felt like science fiction was becoming our new reality—one where every document could tell its own unique story."
                  : "Recent studies demonstrate that transformer-based models have achieved human-level performance on various language understanding tasks. This represents a significant milestone in the field of computational linguistics and artificial intelligence research."
                }
              </p>
            </article>

            {/* Reading Progress */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between text-sm text-text/70 mb-4">
                <span>Chapter 1 of 8</span>
                <span>45% complete</span>
              </div>
              <div className="w-full bg-border rounded-full h-3">
                <div className="bg-gradient-to-r from-accent1 to-accent2 h-3 rounded-full w-2/5 transition-all duration-500"></div>
              </div>

              <div className="flex items-center justify-between mt-8">
                <button className="flex items-center space-x-2 text-text/70 hover:text-text transition-colors">
                  <FiArrowLeft className="text-lg" />
                  <span>Previous</span>
                </button>

                <button className="flex items-center space-x-2 bg-gradient-to-r from-accent1 to-accent2 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all">
                  <span>Continue Reading</span>
                  <FiArrowRight className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingInterface;
