import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Button from '../common/Button';

const ZoomControls = ({ onZoomIn, onZoomOut, onReset }) => {
    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg border border-slate-200 z-50">
            <Button variant="ghost" onClick={onZoomOut} className="rounded-full w-10 h-10 p-0">
                <ZoomOut size={20} />
            </Button>
            <Button variant="ghost" onClick={onReset} className="rounded-full w-10 h-10 p-0">
                <RotateCcw size={18} />
            </Button>
            <Button variant="ghost" onClick={onZoomIn} className="rounded-full w-10 h-10 p-0">
                <ZoomIn size={20} />
            </Button>
        </div>
    );
};

export default ZoomControls;
