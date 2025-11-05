import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { FiArrowLeft, FiBookmark, FiShare2, FiPlay } from 'react-icons/fi';

const BookSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data based on document ID
  const bookData = {
    1: {
      title: "The Future of Machine Learning in Healthcare",
      summary: `This comprehensive analysis explores how artificial intelligence is revolutionizing healthcare delivery. From diagnostic imaging to personalized treatment plans, machine learning algorithms are transforming patient outcomes and medical research.

The document examines current applications of AI in medical imaging, predictive analytics for patient care, and the ethical considerations surrounding automated decision-making in healthcare settings. It presents case studies from leading medical institutions and discusses the future implications for healthcare professionals and patients alike.

Key insights include the potential for early disease detection, optimized treatment protocols, and the integration of AI with existing healthcare infrastructure. The analysis concludes with recommendations for healthcare organizations looking to implement AI solutions responsibly.`,
      author: "Dr. Sarah Chen",
      published: "2024",
      pages: 45,
      mode: 'story',
      interest: 'Technology'
    },
    2: {
      title: "Quarterly Business Analysis Report Q3 2024",
      summary: `This detailed quarterly report provides comprehensive insights into business performance metrics for Q3 2024. The analysis covers revenue trends, market positioning, competitive landscape, and strategic recommendations for the upcoming quarter.

Key findings include strong growth in digital services, challenges in supply chain management, and emerging opportunities in sustainable business practices. The report includes detailed financial projections, risk assessments, and actionable strategies for maintaining competitive advantage.

Executive summaries highlight the most critical data points, while detailed appendices provide supporting documentation and methodology. The report serves as a strategic planning tool for senior management and board members.`,
      author: "Financial Analytics Team",
      published: "Q3 2024",
      pages: 67,
      mode: 'direct',
      interest: 'Business'
    },
    3: {
      title: "Climate Change and Sustainable Development",
      summary: `This comprehensive study examines the intersection of climate change mitigation and sustainable development goals. Through extensive research and data analysis, it explores how global warming affects economic development, social equity, and environmental health.

The document presents scientific evidence of climate patterns, economic impacts of extreme weather events, and successful case studies of sustainable development initiatives worldwide. It discusses policy frameworks, technological innovations, and community-based solutions that are proving effective in addressing climate challenges.

Particular attention is given to developing nations and vulnerable populations, with recommendations for international cooperation and local implementation strategies. The study concludes with a roadmap for achieving sustainable development while mitigating climate change impacts.`,
      author: "Dr. Michael Rodriguez",
      published: "2024",
      pages: 89,
      mode: 'story',
      interest: 'Science'
    },
    4: {
      title: "Digital Transformation in Education",
      summary: `This forward-thinking analysis explores how digital technologies are reshaping educational systems worldwide. From online learning platforms to AI-powered tutoring systems, the document examines the transformative potential of technology in education.

The study covers successful implementations of digital learning tools, challenges in equitable access, and the evolving role of educators in technology-enhanced classrooms. It includes case studies from pioneering educational institutions and discusses the skills students need to thrive in a digital economy.

Key topics include personalized learning algorithms, virtual reality classrooms, and the integration of artificial intelligence in curriculum development. The analysis provides practical guidance for educational institutions navigating digital transformation.`,
      author: "Prof. Lisa Thompson",
      published: "2024",
      pages: 52,
      mode: 'hybrid',
      interest: 'Technology'
    }
  };

  const book = bookData[id];

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
