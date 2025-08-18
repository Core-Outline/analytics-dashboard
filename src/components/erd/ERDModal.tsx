import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ERDCanvas } from './ERDCanvas';

interface ERDModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataSourceId?: string | number;
  onCreate?: (payload: { request: any; type?: string }) => Promise<void> | void;
}

export const ERDModal: React.FC<ERDModalProps> = ({ open, onOpenChange, dataSourceId, onCreate }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] p-0 overflow-hidden">
        <ERDCanvas dataSourceId={dataSourceId} onCreate={onCreate} />
      </DialogContent>
    </Dialog>
  );
};

export default ERDModal; 