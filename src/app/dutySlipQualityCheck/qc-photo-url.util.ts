import { GeneralService } from '../general/general.service';

export class QcPhotoSlot {
  rawPath: string | null;
  displayUrl: string | null;

  constructor(rawPath: string | null | undefined, generalService: GeneralService) {
    this.rawPath = rawPath == null || String(rawPath).trim() === '' ? null : String(rawPath).trim();
    this.displayUrl = generalService.qcPhotoInitialDisplayUrl(this.rawPath);
  }

  hasImage(): boolean {
    return this.rawPath != null && this.rawPath !== '';
  }

  advanceOnFailed(generalService: GeneralService): boolean {
    const next = generalService.qcPhotoNextDisplayUrl(this.displayUrl, this.rawPath);
    if (next && next !== this.displayUrl) {
      this.displayUrl = next;
      return true;
    }
    return false;
  }
}

export interface QcPhotoRawPaths {
  selfie: string | null | undefined;
  front: string | null | undefined;
  interiors: string | null | undefined;
}

export function bindQcPhotoSlots(
  generalService: GeneralService,
  raw: QcPhotoRawPaths
): { selfie: QcPhotoSlot; front: QcPhotoSlot; interiors: QcPhotoSlot } {
  return {
    selfie: new QcPhotoSlot(raw.selfie, generalService),
    front: new QcPhotoSlot(raw.front, generalService),
    interiors: new QcPhotoSlot(raw.interiors, generalService),
  };
}
