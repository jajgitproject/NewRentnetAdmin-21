// @ts-nocheck
export class KMComparisionModel {
  g2PAppActual: number;
  p2DAppActual: number;
  d2GAppActual: number;

  g2PApp: number;
  p2DApp: number;
  d2GApp: number;

  g2PGPS: number;
  p2DGPS: number;
  d2GGPS: number;

  g2PManual: number;
  p2DManual: number;
  d2GManual: number;

  constructor(kmComparisionModel) {
    this.g2PAppActual = kmComparisionModel.g2PAppActual || '';
    this.p2DAppActual = kmComparisionModel.p2DAppActual || '';
    this.d2GAppActual = kmComparisionModel.d2GAppActual || '';

    this.g2PApp = kmComparisionModel.g2PApp || '';
    this.p2DApp = kmComparisionModel.p2DApp || '';
    this.d2GApp = kmComparisionModel.d2GApp || '';

    this.g2PGPS = kmComparisionModel.g2PGPS || '';
    this.p2DGPS = kmComparisionModel.p2DGPS || '';
    this.d2GGPS = kmComparisionModel.d2GGPS || '';

    this.g2PManual = kmComparisionModel.g2PManual || '';
    this.p2DManual = kmComparisionModel.p2DManual  ||'';
    this.d2GManual = kmComparisionModel.d2GManual || '';
  }
}

