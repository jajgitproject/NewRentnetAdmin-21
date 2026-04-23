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
import { MatMenuModule } from '@angular/material/menu';
import { MyUploadModule } from '../myupload/myupload.module';
import { CurrentDesginationModule } from '../currentDesgination/currentDesgination.module';
import { BrowserModule } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreditNoteHistoryModule } from '../creditnotehistory/creditnotehistory.module';
import { CancelInvoiceModule } from '../cancelInvoice/cancelInvoice.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { ChangeCarTypeComponent } from './changeCarType.component';
import { ChangeCarTypeFormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { ChangeCarTypeDetailsComponent } from './dialogs/changeCarTypeDetails/changeCarTypeDetails.component';
import { ChangeCarTypeRoutingModule } from './changeCarType-routing.module';
import { ChangeCarTypeService } from './changeCarType.service';


@NgModule({
  declarations: [
    ChangeCarTypeComponent,
    ChangeCarTypeFormDialogComponent,
    ChangeCarTypeDetailsComponent
  ],
  imports: [
    //BrowserModule,
    CommonModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ChangeCarTypeRoutingModule,
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
    MatMenuModule,
    MatProgressSpinnerModule,
    MyUploadModule,
    CurrentDesginationModule,
    CreditNoteHistoryModule,
    CancelInvoiceModule,
    MatExpansionModule
  ],
  
  providers: [ChangeCarTypeService],
})
export class ChangeCarTypeModule {}


