'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import InfoIcon from '@/assets/images/info.svg';
import SuccessIcon from '@/assets/images/success.svg';
import WarningIcon from '@/assets/images/warning.svg';
import * as S from './Toast.styles';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  /** message 아래 두 번째 줄 (예: 푸시 알림 body) */
  description?: string;
  /** 토스트 전체를 눌렀을 때 동작 (예: 푸시 알림 탭 시 이동). 누르면 토스트는 닫힌다. */
  onClick?: () => void;
}

export interface ToastMessage extends ToastOptions {
  id: string;
  message: string;
  variant?: 'default' | 'info' | 'warn' | 'success';
  isExiting?: boolean;
  action?: ToastAction;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss?: (id: string) => void;
}

const Toast = ({ toasts, onDismiss }: ToastProps) => {
  const [toastRoot, setToastRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let root = document.getElementById('toast-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'toast-root';
      document.body.appendChild(root);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 클라이언트 전용 DOM 접근을 위해 필요
    setToastRoot(root);
  }, []);

  const getIcon = (variant?: 'default' | 'info' | 'warn' | 'success') => {
    switch (variant) {
      case 'info':
        return <InfoIcon width={20} height={20} />;
      case 'warn':
        return <WarningIcon width={20} height={20} />;
      case 'success':
        return <SuccessIcon width={20} height={20} />;
      default:
        return null;
    }
  };

  if (!toastRoot || toasts.length === 0) return null;

  return createPortal(
    <S.ToastContainer>
      {toasts.map((toast) => (
        <S.ToastItem
          key={toast.id}
          isExiting={toast.isExiting}
          isClickable={!!toast.onClick}
          {...(toast.onClick && {
            role: 'button',
            tabIndex: 0,
            onClick: () => {
              toast.onClick?.();
              onDismiss?.(toast.id);
            },
          })}
        >
          {toast.variant && toast.variant !== 'default' && (
            <S.ToastIcon>{getIcon(toast.variant)}</S.ToastIcon>
          )}
          <S.ToastContent>
            <S.ToastText>{toast.message}</S.ToastText>
            {toast.description && (
              <S.ToastDescription>{toast.description}</S.ToastDescription>
            )}
          </S.ToastContent>
          {toast.action && (
            <S.ToastAction
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toast.action?.onClick();
                onDismiss?.(toast.id);
              }}
            >
              {toast.action.label}
            </S.ToastAction>
          )}
        </S.ToastItem>
      ))}
    </S.ToastContainer>,
    toastRoot,
  );
};

export default Toast;
