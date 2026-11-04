import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { FileQuestion, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-indigo-400">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">404</h1>
        <h2 className="text-base font-semibold text-slate-300">Page Not Found</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          The page or route you are looking for does not exist or may have been moved.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Return to Code Converter
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
