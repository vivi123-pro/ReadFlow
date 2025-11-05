import { FiBook, FiFeather } from 'react-icons/fi';

const ModeToggle = ({ mode, onModeChange }) => {
  return (
    <div className="bg-white rounded-2xl p-2 shadow-sm border border-border inline-flex">
      <button
        onClick={() => onModeChange('direct')}
        className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 ${
          mode === 'direct'
            ? 'bg-primary text-white shadow-sm'
            : 'text-text/70 hover:text-text'
        }`}
      >
        <FiBook className="text-lg" />
        <span className="font-medium">Direct Mode</span>
      </button>

      <button
        onClick={() => onModeChange('story')}
        className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 ${
          mode === 'story'
            ? 'bg-gradient-to-r from-accent1 to-accent2 text-white shadow-sm'
            : 'text-text/70 hover:text-text'
        }`}
      >
        <FiFeather className="text-lg" />
        <span className="font-medium">Story Mode</span>
      </button>
    </div>
  );
};

export default ModeToggle;
