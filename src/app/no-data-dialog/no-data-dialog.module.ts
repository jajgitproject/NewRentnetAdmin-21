// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';  // Importing MatDialogModule
import { NoDataDialogComponent } from './no-data-dialog.component'; // Importing component

@NgModule({
  declarations: [NoDataDialogComponent],  // Declare your component
  imports: [
    CommonModule,
    MatDialogModule,  // Import MatDialogModule
  ],
  exports: [NoDataDialogComponent],  // Export if you want to use it elsewhere
  entryComponents: [NoDataDialogComponent]  // Important for dialog components
})
export class NoDataDialogModule {}


