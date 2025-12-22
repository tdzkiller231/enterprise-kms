import React, { ReactNode } from 'react';
import { DocStatus } from '../types';
import { X, Loader2 } from 'lucide-react';

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading, className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";
  const variants = {
    primary: "border-transparent text-white bg-orange-500 hover:bg-orange-600 focus:ring-orange-500",
    secondary: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-orange-500",
    danger: "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
    ghost: "border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} disabled={isLoading} {...props}>
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

// --- BADGE ---
export const StatusBadge: React.FC<{ status: DocStatus }> = ({ status }) => {
  const styles = {
    [DocStatus.APPROVED]: 'bg-green-100 text-green-800',
    [DocStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [DocStatus.REJECTED]: 'bg-red-100 text-red-800',
    [DocStatus.DRAFT]: 'bg-gray-100 text-gray-800',
    [DocStatus.EXPIRED]: 'bg-orange-100 text-orange-800',
    [DocStatus.ARCHIVED]: 'bg-slate-200 text-slate-600',
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};

// --- MODAL ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">{title}</h3>
              <button onClick={onClose} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4">
              {children}
            </div>
          </div>
          {footer && <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end gap-3">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

// --- DRAWER (SLIDE-OVER) ---
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children, footer, width = 'max-w-2xl' }) => {
  return (
    <div className={`fixed inset-0 overflow-hidden z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className="absolute inset-0 overflow-hidden">
        {/* Overlay */}
        <div 
           className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
           onClick={onClose} 
           aria-hidden="true"
        ></div>

        <div className={`fixed inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform duration-300 ease-in-out sm:pl-16 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className={`w-screen ${width}`}>
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between border-b pb-4 mb-4">
                  <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">
                    {title}
                  </h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button
                      type="button"
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close panel</span>
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                {/* Content */}
                <div className="relative flex-1">
                  {children}
                </div>
              </div>
              
              {/* Footer */}
              {footer && (
                <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                   {footer}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CARD ---
export const Card: React.FC<{ children: ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
    {title && <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 font-medium text-gray-700">{title}</div>}
    <div className="px-4 py-4 sm:p-6">{children}</div>
  </div>
);