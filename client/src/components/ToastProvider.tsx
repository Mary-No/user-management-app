import {createContext, useContext, useEffect, useRef, useState} from 'react';
import {Toast} from 'bootstrap';

type ToastType = 'success' | 'error';

type ToastContextType = {
    showToast: (message: string, type: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({children}: { children: React.ReactNode }) => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState<ToastType>('success');
    const [shouldShow, setShouldShow] = useState(false);
    const toastRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (shouldShow && toastRef.current) {
            const toast = new Toast(toastRef.current, {delay: 4000});
            toast.show();
            setShouldShow(false);
        }
    }, [shouldShow]);

    const showToast = (msg: string, t: ToastType) => {
        setMessage(msg);
        setType(t);
        setShouldShow(true);
    };

    return (
        <ToastContext.Provider value={{showToast}}>
            {children}
            <div className="toast-container position-fixed bottom-0 start-0 p-3" style={{zIndex: 9999}}>
                <div
                    ref={toastRef}
                    className={`toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`}
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                >
                    <div className="d-flex">
                        <div className="toast-body">{message}</div>
                        <button
                            type="button"
                            className="btn-close btn-close-white me-2 m-auto"
                            data-bs-dismiss="toast"
                            aria-label="Close"
                        ></button>
                    </div>
                </div>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
