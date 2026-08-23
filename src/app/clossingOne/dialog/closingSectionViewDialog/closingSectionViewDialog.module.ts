//@ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClosingSectionViewDialogComponent } from './closingSectionViewDialog.component';
import { DutyTollParkingEntryModule } from '../../../dutyTollParkingEntry/dutyTollParkingEntry.module';
import { DisputeModule } from '../../../dispute/dispute.module';
import { DutyInterstateTaxModule } from '../../../dutyInterstateTax/dutyInterstateTax.module';
import { DutyExpenseModule } from '../../../dutyExpense/dutyExpense.module';
import { DutyGSTPercentageModule } from '../../../dutyGSTPercentage/dutyGSTPercentage.module';
import { DutyStateModule } from '../../../dutyState/dutyState.module';
import { DutyStateCustomerModule } from '../../../dutyStateCustomer/dutyStateCustomer.module';
import { DutySACModule } from '../../../dutySAC/dutySAC.module';
import { AdditionalKmsDetailsModule } from '../../../additionalKmsDetails/additionalKmsDetails.module';
import { MOPDetailsModule } from '../../../MOPDetailsShow/mopDetailsShow.module';
import { SettledRateDetailsModule } from '../../../settledRateDetails/settledRateDetails.module';
import { DiscountDetailsModule } from '../../../discountDetails/discountDetails.module';
import { CustomerSpecificDetailsModule } from '../../../customerSpecificDetails/customerSpecificDetails.module';
import { ChangeDutyTypeClosingModule } from '../../../changeDutyTypeClosing/changeDutyTypeClosing.module';

@NgModule({
  declarations: [ClosingSectionViewDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    DutyTollParkingEntryModule,
    DisputeModule,
    DutyInterstateTaxModule,
    DutyExpenseModule,
    DutyGSTPercentageModule,
    DutyStateModule,
    DutyStateCustomerModule,
    DutySACModule,
    AdditionalKmsDetailsModule,
    MOPDetailsModule,
    SettledRateDetailsModule,
    DiscountDetailsModule,
    CustomerSpecificDetailsModule,
    ChangeDutyTypeClosingModule,
  ],
  exports: [ClosingSectionViewDialogComponent],
})
export class ClosingSectionViewDialogModule {}
