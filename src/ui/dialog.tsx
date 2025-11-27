import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../lib/cn';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;

type DialogOverlayExtra = { offsetTop?: number };

export function DialogOverlay({
  className,
  offsetTop,
  ...props
}: DialogPrimitive.DialogOverlayProps & DialogOverlayExtra) {
  const style =
    typeof offsetTop === 'number'
      ? {
          top: offsetTop,
          left: 0,
          right: 0,
          bottom: 0,
          position: 'fixed' as const,
        }
      : undefined;
  const base =
    typeof offsetTop === 'number' ? 'bg-black/40' : 'fixed inset-0 bg-black/40';
  return (
    <DialogPrimitive.Overlay
      className={cn(base, className)}
      style={style}
      {...props}
    />
  );
}

type DialogContentExtra = {
  side?: 'center' | 'right';
  offsetTop?: number;
};

export function DialogContent({
  className,
  children,
  side = 'center',
  offsetTop,
  ...props
}: DialogPrimitive.DialogContentProps & DialogContentExtra) {
  const base = 'fixed bg-white rounded-lg shadow-lg';
  const center =
    'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[480px] p-2xl';
  const right = 'right-0 top-0 w-[88vw] max-w-[380px] p-2xl';
  const style =
    side === 'right' && typeof offsetTop === 'number'
      ? { top: offsetTop, height: `calc(100vh - ${offsetTop}px)` }
      : undefined;
  return (
    <DialogPortal>
      <DialogOverlay offsetTop={side === 'right' ? offsetTop : undefined} />
      <DialogPrimitive.Content
        className={cn(base, side === 'center' ? center : right, className)}
        style={style}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export const DialogClose = DialogPrimitive.Close;
