import React, { useState, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

interface DrawerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  minWidth?: number;
  maxWidth?: number;
  title: string;
  description?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  children,
  isOpen,
  onClose,
  minWidth = 200,
  maxWidth = 600,
  title,
  description,
}) => {
  const [width, setWidth] = useState(500);
  const drawerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const drawer = drawerRef.current;
    const resizeHandle = resizeHandleRef.current;
    if (!drawer || !resizeHandle) return;

    let startX: number;
    let startWidth: number;

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startX;
      const newWidth = Math.min(Math.max(startWidth - dx, minWidth), maxWidth);
      setWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    const onMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      startWidth = drawer.offsetWidth;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    resizeHandle.addEventListener('mousedown', onMouseDown);

    return () => {
      resizeHandle.removeEventListener('mousedown', onMouseDown);
    };
  }, [minWidth, maxWidth]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* <Dialog.Overlay className="fixed inset-0 bg-black/50" /> */}
        <Dialog.Content
          ref={drawerRef}
          aria-describedby="drawer-description"
          className="fixed top-0 right-0 h-full bg-white shadow-lg focus:outline-none overflow-y-auto"
          style={{ width: `${width}px` }}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          {description && <Dialog.Description className="sr-only">{description}</Dialog.Description>}
          <div
            ref={resizeHandleRef}
            className="absolute top-0 left-0 w-1 h-full cursor-ew-resize bg-gray-200 hover:bg-gray-300"
          />
          <div className="p-4">
            <Dialog.Close asChild>
              <button
                className="absolute top-2 right-2 inline-flex items-center justify-center rounded-full w-8 h-8 focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Drawer;