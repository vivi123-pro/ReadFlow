import { FiBook, FiClock, FiStar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const DocumentCard = ({ id, title, progress, mode, interest, lastRead }) => {
  const navigate = useNavigate();

  const getModeColor = () => {
    return mode === 'story' ? 'from-accent1 to-accent2' : 'from-accent1 to-primary';
  };

  const handleClick = () => {
    navigate(`/book/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-border hover:border-accent1/50 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-accent1 to-accent2 flex items-center justify-center">
          <FiBook className="text-white text-xl" />
        </div>

        <div className={`text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r ${getModeColor()} text-white`}>
          {mode === 'story' ? 'Story' : 'Direct'}
        </div>
      </div>

      <h3 className="font-serif text-lg text-text mb-2 line-clamp-2">
        {title}
      </h3>

      <p className="text-text/70 text-sm mb-4">
        Related to your interest in {interest}
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-text/70">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="w-full bg-border rounded-full h-2">
          <div
            className="bg-gradient-to-r from-accent1 to-accent2 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-xs text-text/60">
          <div className="flex items-center space-x-1">
            <FiClock className="text-xs" />
            <span>{lastRead}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FiStar className="text-xs" />
            <span>Continue</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;