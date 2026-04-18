// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdditionalSMSEmailWhatsappComponent } from './additionalSMSEmailWhatsapp.component';

const routes: Routes = [
  {
    path: '',
    component: AdditionalSMSEmailWhatsappComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdditionalSMSEmailWhatsappRoutingModule {}

