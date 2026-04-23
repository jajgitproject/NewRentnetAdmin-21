// @ts-nocheck
import { formatDate } from '@angular/common';

export class LifeCycleStatus {
  lifeCycleStatusID: number;
  reservationID: number;
  unConfirmed: string;
  confirmation: string;
  dataCompletionStatus: string;
  billed: string;
  readyToBill: string;
  verified: string;
  closed: string;
  unClosed: string;
  garageIn: string;
  dropped: string;
  pickedUpDelayInMinutes: number;
  pickedUp: string;
  reachedDelayInMinutes: number;
  reached: string;
  dispatchedDelayInMinutes: number;
  dispatched: string;
  notDispatched: string;
  carAndDriverAllotedDelayInMinutes: number;
  carAndDriverAlloted: string;
  carAndDriverNotAlloted: string;

  constructor(lifeCycleStatus: any) {
    this.lifeCycleStatusID = lifeCycleStatus.lifeCycleStatusID || 0;
    this.reservationID = lifeCycleStatus.reservationID || 0;
    this.dataCompletionStatus = lifeCycleStatus.dataCompletionStatus || '';
    this.unConfirmed = lifeCycleStatus.unConfirmed || '';
    this.confirmation = lifeCycleStatus.confirmation || '';
  
    this.billed = lifeCycleStatus.billed || '';
    this.readyToBill = lifeCycleStatus.readyToBill || '';
    this.verified = lifeCycleStatus.verified || '';
    this.closed = lifeCycleStatus.closed || '';
    this.unClosed = lifeCycleStatus.unClosed || '';
    this.garageIn = lifeCycleStatus.garageIn || '';
    this.dropped = lifeCycleStatus.dropped || '';
    this.pickedUpDelayInMinutes = lifeCycleStatus.pickedUpDelayInMinutes || 0;
    this.pickedUp = lifeCycleStatus.pickedUp || '';
    this.reachedDelayInMinutes = lifeCycleStatus.reachedDelayInMinutes || 0;
    this.reached = lifeCycleStatus.reached || '';
    this.dispatchedDelayInMinutes = lifeCycleStatus.dispatchedDelayInMinutes || 0;
    this.dispatched = lifeCycleStatus.dispatched || '';
    this.notDispatched = lifeCycleStatus.notDispatched || '';
    this.carAndDriverAllotedDelayInMinutes = lifeCycleStatus.carAndDriverAllotedDelayInMinutes || 0;
    this.carAndDriverAlloted = lifeCycleStatus.carAndDriverAlloted || '';
    this.carAndDriverNotAlloted = lifeCycleStatus.carAndDriverNotAlloted || '';
  }
}

