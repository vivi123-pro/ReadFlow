import { FiSmartphone, FiTablet, FiMonitor } from 'react-icons/fi';

const ProgressTracker = () => {
  const devices = [
    { icon: FiMonitor, name: 'Desktop', time: '2 hours ago', active: true },
    { icon: FiSmartphone, name: 'Mobile', time: '1 hour ago', active: false },
    { icon: FiTablet, name: 'Tablet', time: 'Just now', active: true }
  ];

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-border">
      <h3 className="font-serif text-2xl text-text mb-2">Reading Sync</h3>
      <p className="text-text/70 mb-8">Seamlessly continue across all your devices</p>

      <div className="space-y-6">
        {devices.map((device, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-accent1/50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                device.active
                  ? 'bg-gradient-to-r from-accent1 to-accent2'
                  : 'bg-border'
              }`}>
                <device.icon className={device.active ? 'text-white text-xl' : 'text-text/70 text-xl'} />
              </div>

              <div>
                <h4 className="font-medium text-text">{device.name}</h4>
                <p className="text-sm text-text/70">{device.time}</p>
              </div>
            </div>

            <div className={`w-3 h-3 rounded-full ${
              device.active ? 'bg-highlight' : 'bg-accent1/50'
            }`}></div>
          </div>
        ))}
      </div>

      <button className="w-full mt-8 bg-gradient-to-r from-accent1 to-accent2 text-text py-4 rounded-xl hover:shadow-lg transition-all font-medium">
        Continue Reading
      </button>
    </div>
  );
};

export default ProgressTracker;