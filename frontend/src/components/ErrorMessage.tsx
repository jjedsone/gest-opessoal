import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
}

function ErrorMessage({ message, onDismiss, type = 'error' }: ErrorMessageProps) {
  return (
    <div className={`error-message error-${type}`}>
      <span className="error-icon">
        {type === 'error' ? '⚠️' : type === 'warning' ? '⚠️' : 'ℹ️'}
      </span>
      <span className="error-text">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="error-dismiss" aria-label="Fechar">
          ×
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;

