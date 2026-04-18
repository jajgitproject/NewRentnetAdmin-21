// @ts-nocheck
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialFileInputModule } from '@compat/material-file-input-shim';
import { MatMenuModule } from '@angular/material/menu';
import { MyUploadModule } from '../myupload/myupload.module';
import { CurrentDesginationModule } from '../currentDesgination/currentDesgination.module';
import { BrowserModule } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangePassengerService } from './changePassenger.service';
import { ChangePassengerComponent } from './changePassenger.component';
import { ChangePassengerRoutingModule } from './changePassenger-routing.module';
import { CreditNoteHistoryModule } from '../creditnotehistory/creditnotehistory.module';
import { CancelInvoiceModule } from '../cancelInvoice/cancelInvoice.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { ChangePassengerFormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { ChangePassengerDetailsComponent } from './dialogs/changePassengerDetails/changePassengerDetails.component';
import { CustomerPersonService } from '../customerPerson/customerPerson.service';

@NgModule({
  declarations: [
    ChangePassengerComponent,
    ChangePassengerFormDialogComponent,
    ChangePassengerDetailsComponent
  ],
  imports: [
    //BrowserModule,
    CommonModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ChangePassengerRoutingModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MaterialFileInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MyUploadModule,
    CurrentDesginationModule,
    CreditNoteHistoryModule,
    CancelInvoiceModule,
    MatExpansionModule
  ],
  
  providers: [ChangePassengerService,CustomerPersonService],
})
export class ChangePassengerModule {}


