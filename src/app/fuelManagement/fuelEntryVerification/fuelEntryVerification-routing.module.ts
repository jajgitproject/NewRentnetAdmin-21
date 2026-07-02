// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuelEntryVerificationComponent } from './fuelEntryVerification.component';

const routes: Routes = [{ path: '', component: FuelEntryVerificationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FuelEntryVerificationRoutingModule {}
