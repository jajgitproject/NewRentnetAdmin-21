export interface CallMaskHistoryRow {
  callMaskID: number;
  reservationID: number;
  driverMobile: string;
  guestMobile: string;
  virtualNumber: string;
  tripStatus: string;
  isActive: boolean;
  createdAt: string | null;
  releasedAt: string | null;
  releaseReason: string | null;
  releasedByName: string | null;
}

export interface CallMaskHistoryPage {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  rows: CallMaskHistoryRow[];
}
