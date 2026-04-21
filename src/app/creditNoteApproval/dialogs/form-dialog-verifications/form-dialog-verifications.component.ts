// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';

import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { DocumentDropDown } from 'src/app/general/documentDropDown.model';
import { CreditNoteApprovalService } from '../../creditNoteApproval.service';
import { CreditNoteApproval } from '../../creditNoteApproval.model';

@Component({
  standalone: false,
  selector: 'app-form-dialog-verifications',
  templateUrl: './form-dialog-verifications.component.html',
  styleUrls: ['./form-dialog-verifications.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogCreditVerificationsComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CreditNoteApproval;
  searchTerm : FormControl = new FormControl();
  searchCityTerm : FormControl = new FormControl();
  public DocumentList?: DocumentDropDown[] = [];
  public CityList?: CitiesDropDown[] = [];
  filteredOptions: Observable<CitiesDropDown[]>;

  public EmployeeList?: EmployeeDropDown[]=[];
  saveDisabled:boolean = false; // Initially false, will be controlled by form validation
  image: any;
  fileUploadEl: any;
  addressGeoPointID: any;
  DriverName: string;
  DriverID!: number;
  selectedDate: string = '';
selectedTime: string = '';
  isDisabled: boolean = true;     // 👈 इसे add करो
  invoiceCreditNoteID: any;
  creditNoteNumber: any;
  CreditNoteNumber: any;
  invoiceNumberWithPrefix: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogCreditVerificationsComponent>, 
  public dialog: MatDialog,
  private snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CreditNoteApprovalService,
    private fb: FormBuilder,
    private el: ElementRef,
    
  public _generalService:GeneralService)
  { 
    this.DriverID= data.driverID;
    this.invoiceCreditNoteID= data.invoiceCreditNoteID;
    // Set creditNoteNumber from multiple possible sources
    this.creditNoteNumber = data.creditNoteNumber || data.advanceTable?.creditNoteNumber || '';
    this.invoiceNumberWithPrefix = data.invoiceNumberWithPrefix || data.advanceTable?.invoiceNumberWithPrefix || '';
    this.DriverName = data.DriverName;
        // Set the defaults
          this.dialogTitle = 'Credit Note Approval';
          this.advanceTable = data.advanceTable;
          
          // Debug: Log the incoming data to check if reason is present
          
          //this.verifiedByName();
          
        this.advanceTableForm = this.createContactForm();
  }
  
  public ngOnInit(): void
  {
    this.InitCities();
    this.intDocument();
    
    // Ensure creditNoteNumber is properly set
    if (!this.creditNoteNumber && this.advanceTable?.creditNoteNumber) {
      this.creditNoteNumber = this.advanceTable.creditNoteNumber;
    }
    
    // Call verifiedByName after a short delay to ensure form is fully initialized
    setTimeout(() => {
      this.verifiedByName();
      this.refreshFormValues();
    }, 100);
    
    // Monitor form validity to control Save button
    this.advanceTableForm.valueChanges.subscribe(value => {
      
      // Enable/disable Save button based on form validity and required fields
      this.saveDisabled = !this.advanceTableForm.valid || 
                         !value.approvalStatus || 
                         value.approvalStatus === '';
    });
    
    // Initial check for form validity
    this.saveDisabled = !this.advanceTableForm.valid || 
                       !this.advanceTableForm.get('approvalStatus')?.value;
  }

  refreshFormValues(): void {
    // Force refresh form values to ensure they match the model
    if (this.advanceTable && this.advanceTableForm) {
      const currentValues = this.advanceTableForm.value;
      
      // Patch the form with the model data again to ensure sync
      const patchData = {
        approvalRejectionReason: this.advanceTable.approvalRejectionReason || '',
        approvalStatus: this.advanceTable.approvalStatus || '',
        approvalDateTime: this.advanceTable.approvalDateTime || new Date()
      };
      
      // Only patch approvedBy if it's not already set (to avoid overriding API response)
      if (!currentValues.approvedBy || currentValues.approvedBy.trim() === '') {
        patchData['approvedBy'] = this.advanceTable.approvedBy || '';
      }
      
      this.advanceTableForm.patchValue(patchData);
      
      // If approvedBy is still empty, try to call verifiedByName again
      const updatedApprovedBy = this.advanceTableForm.get('approvedBy')?.value;
      if (!updatedApprovedBy || updatedApprovedBy.trim() === '') {
        this.verifiedByName();
      }
      
      
      // Force change detection for the specific field
      this.advanceTableForm.get('approvalRejectionReason')?.updateValueAndValidity();
    }
  }

  intDocument(){
    this._generalService.getDocumentRequired().subscribe
    (
      data =>   
      {
        this.DocumentList = data;
      }
    );
  }
  
  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
        this.filteredOptions = this.searchTerm.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CityList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);
  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }

 createContactForm(): FormGroup {
  // Ensure all required fields have proper default values
  // Handle potential null/undefined cases
  const reasonValue = this.advanceTable?.approvalRejectionReason || '';
                     
  const formData = {
    invoiceCreditNoteID: this.advanceTable?.invoiceCreditNoteID || -1,
    invoiceID: this.advanceTable?.invoiceID || '',
    branchID: this.advanceTable?.branchID || '',
    branchName: this.advanceTable?.branchName || '',
    customerID: this.advanceTable?.customerID || '',
    customerName: this.advanceTable?.customerName || '',
    customerGroupID: this.advanceTable?.customerGroupID || '',
    customerGroup: this.advanceTable?.customerGroup || '',
    creditNoteNumber: this.advanceTable?.creditNoteNumber || '',
    creditNoteAmount: this.advanceTable?.creditNoteAmount || 0,
    creditNoteType: this.advanceTable?.creditNoteType || '',
    dateTimeOfGeneration: this.advanceTable?.dateTimeOfGeneration || new Date(),
    approvalStatus: [this.advanceTable?.approvalStatus || '', Validators.required], // Made required
    approvedByID: this.advanceTable?.approvedByID || 0,
    approvedBy: this.advanceTable?.approvedBy || '',
    approvalDateTime: this.advanceTable?.approvalDateTime || new Date(),
    approvalRejectionReason: reasonValue,
    userID: this.advanceTable?.userID || 0,
    invoiceNumberWithPrefix: this.advanceTable?.invoiceNumberWithPrefix || '',
    //approvalDateTimeString: this.advanceTable?.approvalDateTimeString || ''
  };
  
  
  return this.fb.group(formData);
}

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
    // emppty stuff
  }
  reset(): void 
  {
    this.advanceTableForm.reset();
  }
  onNoClick()
  {
    this.dialogRef.close();
    this.ImagePath="";
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  public Put(): void
  {
    const formData = this.advanceTableForm.getRawValue();
    
    this.advanceTableService.update(formData)  
    .subscribe(
    response => 
    {
        this.dialogRef.close('success'); // Pass success result
        this.showNotification(
          'snackbar-success',
           'Credit Note Approval updated successfully...!!!',
          'bottom',
          'center'
        );
       this._generalService.sendUpdate('CreditNoteApprovalUpdate:CreditNoteApprovalView:Success');//To Send Updates 
    },
    error =>
    {
     console.error('Update API error:', error);
     this._generalService.sendUpdate('CreditNoteApprovalAll:CreditNoteApprovalView:Failure');//To Send Updates 
     
     // Re-enable button based on form validity after error
     this.saveDisabled = !this.advanceTableForm.valid || 
                        !this.advanceTableForm.get('approvalStatus')?.value;
     
     this.showNotification(
      'snackbar-danger',
      'Operation Failed.....!!!',
      'bottom',
      'center'
    ); 
    }
  )
  }
  verifiedByName(){
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data=>{
        this.EmployeeList=data;
        if (this.EmployeeList && this.EmployeeList.length > 0) {
          const employee = this.EmployeeList[0];
          const approvedByName = (employee.firstName || '') + ' ' + (employee.lastName || '');
          
          // Update the form control value
          this.advanceTableForm.patchValue({
            approvedBy: approvedByName.trim(),
            approvedByID: employee.employeeID || 0
          });
          
          // Trigger change detection
          this.advanceTableForm.get('approvedBy')?.updateValueAndValidity();
          
        } else {
          console.warn('No employee data found for approved by field');
          this.showNotification(
            'snackbar-warning',
            'No employee information found',
            'bottom',
            'center'
          );
        }
      },
      error => {
        console.error('Error fetching employee data for approved by:', error);
        this.showNotification(
          'snackbar-danger',
          'Error loading approver information',
          'bottom',
          'center'
        );
      }
    );
  }
  public confirmAdd(): void 
  {
    
    if (this.advanceTableForm.valid) {
      this.saveDisabled = true; // Disable while processing
      this.Put();
    } else {
      this.showNotification(
        'snackbar-warning',
        'Please fill all required fields',
        'bottom',
        'center'
      );
    }
  }
  
  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({documentImage:this.ImagePath})
  }

}


