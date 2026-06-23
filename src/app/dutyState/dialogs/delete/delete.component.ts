// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { DutyStateService } from '../../dutyState.service';
import Swal from 'sweetalert2';
@Component({
  standalone: false,
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteDialogComponent
{
  verifyDuty: boolean = false;
  goodForBilling: boolean = false;
  invoiceGenerated: boolean = false;
  dutyStateBlockedMessage =
    'Cannot change Eco Duty State after invoice has been issued for this duty.';

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: DutyStateService,
    public _generalService: GeneralService
  )
  {
    this.verifyDuty = !!data.verifyDuty;
    this.goodForBilling = !!data.goodForBilling;
    this.invoiceGenerated = !!data.invoiceGenerated;
  }

  get showBillingResetWarning(): boolean {
    return this.verifyDuty || this.goodForBilling;
  }

  get billingResetMessage(): string {
    const labels: string[] = [];
    if (this.verifyDuty) {
      labels.push('Verify Duty');
    }
    if (this.goodForBilling) {
      labels.push('Good For Billing');
    }
    return `${labels.join(' / ')} will be reset based on this action.`;
  }

  onNoClick(): void
  {
    this.dialogRef.close();
  }

  confirmDelete()
  {
    if (this.invoiceGenerated) {
      this._generalService.sendUpdate('DutyStateAll:DutyStateView:Failure');
      this.dialogRef.close();
      return;
    }

    const performDelete = () => {
      this.advanceTableService.delete(this.data.dutyStateID)  
      .subscribe(
      data => 
      {
         this._generalService.sendUpdate('DutyStateDelete:DutyStateView:Success');
         this.dialogRef.close({ resetBillingVerification: this.showBillingResetWarning });
      },
      error =>
      {
        this._generalService.sendUpdate('DutyStateAll:DutyStateView:Failure');
      }
      );
    };

    if (this.showBillingResetWarning) {
      Swal.fire({
        title: 'Confirm',
        text: this.billingResetMessage,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Continue',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          performDelete();
        }
      });
      return;
    }

    performDelete();
  }
}


