import { FiCheck } from 'react-icons/fi';

const InterestCard = ({ title, icon: Icon, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-6 rounded-2xl text-left transition-all duration-300 border-2 ${
        selected
          ? 'border-amber-400 bg-amber-50 shadow-lg shadow-amber-100'
          : 'border-amber-100 bg-white hover:border-amber-200 hover:shadow-md'
      }`}
    >
      {selected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
          <FiCheck className="text-white text-sm" />
        </div>
      )}
      
      <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
        selected ? 'bg-amber-500' : 'bg-amber-100'
      }`}>
        <Icon className={selected ? 'text-white text-xl' : 'text-amber-600 text-xl'} />
      </div>
      
      <h3 className={`font-medium ${
        selected ? 'text-amber-900' : 'text-amber-700'
      }`}>
        {title}
      </h3>
    </button>
  );
};

export default InterestCard;