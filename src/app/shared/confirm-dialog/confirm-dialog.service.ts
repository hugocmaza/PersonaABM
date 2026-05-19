import { Injectable, signal } from '@angular/core';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private resolveFn?: (value: boolean) => void;

  readonly isOpen = signal(false);
  readonly data = signal<ConfirmDialogData>({ title: '', message: '' });

  open(data: ConfirmDialogData): Promise<boolean> {
    this.data.set(data);
    this.isOpen.set(true);
    return new Promise(resolve => (this.resolveFn = resolve));
  }

  confirm(): void {
    this.isOpen.set(false);
    this.resolveFn?.(true);
  }

  cancel(): void {
    this.isOpen.set(false);
    this.resolveFn?.(false);
  }
}
