import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

const noopSub = { subscribe: () => ({ unsubscribe: () => undefined }) };

const matDialogRefStub = {
  close: (): void => undefined,
  updateSize: (): void => undefined,
  updatePosition: (): void => undefined,
  addPanelClass: (): void => undefined,
  removePanelClass: (): void => undefined,
  keydownEvents: () => noopSub,
  backdropClick: () => noopSub,
  beforeClosed: () => noopSub,
  afterClosed: () => noopSub,
};

/** Use in TestBed for dialog-hosted components (MatDialogRef / MAT_DIALOG_DATA). */
export function matDialogTestProviders(): unknown[] {
  return [
    { provide: MatDialogRef, useValue: matDialogRefStub },
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ];
}
