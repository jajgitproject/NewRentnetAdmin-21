// @ts-nocheck
import { formatDate } from '@angular/common';
export class InternalNote {
   internalNoteID: number;
   internalNote: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;
   userID:number
  constructor(internalNote) {
    {
       this.internalNoteID = internalNote.internalNoteID || -1;
       this.internalNote = internalNote.internalNote || '';
       this.activationStatus = internalNote.activationStatus || '';
       this.updatedBy=internalNote.updatedBy || 10;
       this.updateDateTime = internalNote.updateDateTime;
    }
  }
  
}

