// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SendSmsWhatsappMailComponent } from './sendSmsWhatsappMail.component';


const routes: Routes = [
  {
    path: '',
    component: SendSmsWhatsappMailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SendSmsWhatsappMailRoutingModule {}

