// @ts-nocheck
import { formatDate } from '@angular/common';
export class InternalNoteDetails {
  reservationInternalNoteID: number;
  reservationID: number;
  reservationInternalNote:string;
  firstName:string;
  lastName:string;
  reservationInternalNoteAttachment:string;
  reservationInternalNoteByEmployeeID:number;
  reservationInternalNoteByEmployee:string;
   activationStatus: boolean;
    userID:number;
  constructor(internalNoteDetails) {
    {
      this.reservationInternalNoteID = internalNoteDetails.reservationInternalNoteID || -1;
      this.reservationID = internalNoteDetails.reservationID || '';
      this.reservationInternalNote = internalNoteDetails.reservationInternalNote || '';
      this.reservationInternalNoteAttachment = internalNoteDetails.reservationInternalNoteAttachment || '';
      this.reservationInternalNoteByEmployeeID = internalNoteDetails.reservationInternalNoteByEmployeeID || '';
     
      this.activationStatus = internalNoteDetails.activationStatus || '';
    }
  }
  
}

export class InternalNote {
  reservationInternalNoteID: number;
  reservationID: number;
  reservationInternalNote:string;
  reservationInternalNoteAttachment:string;
  reservationInternalNoteByEmployeeID:number;
  reservationInternalNoteByEmployee:string;
  firstName:string;
  lastName:string;
   activationStatus: boolean;
  userID: number;
   
  constructor(internalNote) {
    {
       this.reservationInternalNoteID = internalNote.reservationInternalNoteID || -1;
       this.reservationID = internalNote.reservationID || '';
       this.reservationInternalNote = internalNote.reservationInternalNote || '';
       this.reservationInternalNoteAttachment = internalNote.reservationInternalNoteAttachment || '';
       this.reservationInternalNoteByEmployeeID = internalNote.reservationInternalNoteByEmployeeID || '';
      
       this.activationStatus = internalNote.activationStatus || '';
       
    }
  }
  
}


