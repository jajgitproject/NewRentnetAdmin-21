// @ts-nocheck
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractTariffVerificationComponent } from './contractTariffVerification.component';

const routes: Routes = [{ path: '', component: ContractTariffVerificationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractTariffVerificationRoutingModule {}
