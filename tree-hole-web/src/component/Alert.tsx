interface alertInter {
  type?: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

const Alert = ({ type = 'info', message }: alertInter) => {
  const getAlertClass = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border border-green-400 text-green-700';
      case 'warning':
        return 'bg-yellow-100 border border-yellow-400 text-yellow-700';
      case 'error':
        return 'bg-red-100 border border-red-400 text-red-700';
      default:
        return 'bg-blue-100 border border-blue-400 text-blue-700';
    }
  };

  if (!message) {
    return null;
  }

  return (
    <div
      className={`alert fixed top-5 left-1/2 transform -translate-x-1/2 p-4 rounded ${getAlertClass()}`}
      style={{ zIndex: 1000 }}
    >
      <p>{message}</p>
    </div>
  );
};

export default Alert;