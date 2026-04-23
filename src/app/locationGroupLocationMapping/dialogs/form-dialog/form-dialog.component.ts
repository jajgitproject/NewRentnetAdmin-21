// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LocationGroupLocationMapping } from '../../locationGroupLocationMapping.model';
import { LocationGroupLocationMappingService } from '../../locationGroupLocationMapping.service';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntity/organizationalEntityDropDown.model';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: LocationGroupLocationMapping;
  formattedAddress = '';
  geoStringAddress: any;
  CustomerID: any;
  saveDisabled: boolean = false; // To disable the Save button during submission
  isLoading: boolean = false; 
  public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
  searchLocationTerm:  FormControl = new FormControl();
  filteredLocationOptions: Observable<OrganizationalEntityDropDown[]>;
  organizationalEntityID: any;
  locationGroupID: any;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: LocationGroupLocationMappingService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Location Group Location Mapping';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Location Group Location Mapping';
          this.advanceTable = new LocationGroupLocationMapping({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.locationGroupID= data.locationGroupID;

  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      locationGroupLocationMappingID: [this.advanceTable.locationGroupLocationMappingID],
      locationGroupID: [this.advanceTable.locationGroupID],
      location: [this.advanceTable.location],
      locationID: [this.advanceTable.locationID],
      activationStatus: [this.advanceTable.activationStatus],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

ngOnInit(): void {
  this.initServiceLocation();
}

//----------- Validator ---------
serviceLocationValidator(OrganizationalEntitiesList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = OrganizationalEntitiesList.some(group => group.organizationalEntityName.toLowerCase() === value);
    return match ? null : { locationInvalid: true };
  };
}

initServiceLocation(){
  this._generalService.GetLocation().subscribe(
    data=>{
      this.OrganizationalEntitiesList=data;
      this.advanceTableForm.controls['location'].setValidators([Validators.required,
        this.serviceLocationValidator(this.OrganizationalEntitiesList)
      ]);
      this.advanceTableForm.controls['location'].updateValueAndValidity();
      this.filteredLocationOptions = this.advanceTableForm.controls['location'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterLocation(value || ''))
      );
    }
  )
}

private _filterLocation(value: string): any {
  const filterValue = value.toLowerCase();
  return this.OrganizationalEntitiesList.filter(
    customer => 
    {
      return customer.organizationalEntityName.toLowerCase().includes(filterValue);
    }
  );
  
};

onServiceLocationSelected(selectedServiceName: string) {
  const selectedValue = this.OrganizationalEntitiesList.find(
    data => data.organizationalEntityName === selectedServiceName
  );  
  if (selectedValue) {
    this.getLocationID(selectedValue.organizationalEntityID);
  }
}

getLocationID(organizationalEntityID: any) {
   
  this.organizationalEntityID=organizationalEntityID;
  this.advanceTableForm.patchValue({locationID:this.organizationalEntityID})
}

submit() 
  {

  }
  onNoClick(): void 
  {
    if(this.action==='add'){
      this.advanceTableForm.reset();

    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
  }
  public Post(): void {
    this.isLoading = true;   // Show spinner
    this.saveDisabled = true;  // Disable the Save button during the API call
    this.advanceTableForm.patchValue({ locationGroupID: this.data.locationGroupID });

    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('LocationGroupLocationMappingCreate:LocationGroupLocationMappingView:Success');
          this.isLoading = false;   // Hide spinner
          this.saveDisabled = false;  // Re-enable the Save button
        },
        error => {
          this._generalService.sendUpdate('LocationGroupLocationMappingAll:LocationGroupLocationMappingView:Failure');
          this.isLoading = false;   // Hide spinner
          this.saveDisabled = false;  // Re-enable the Save button
        }
      );
  }

  public Put(): void {
    this.isLoading = true;   // Show spinner
    this.saveDisabled = true;  // Disable the Save button during the API call
    this.advanceTableForm.patchValue({ locationGroupID: this.data.locationGroupID });

    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('LocationGroupLocationMappingUpdate:LocationGroupLocationMappingView:Success');
          this.isLoading = false;   // Hide spinner
          this.saveDisabled = false;  // Re-enable the Save button
        },
        error => {
          this._generalService.sendUpdate('LocationGroupLocationMappingAll:LocationGroupLocationMappingView:Failure');
          this.isLoading = false;   // Hide spinner
          this.saveDisabled = false;  // Re-enable the Save button
        }
      );
  }

  public confirmAdd(): void 
  {
       if(this.action=="edit")
       {
          this.Put();
       }
       else
       {
          this.Post();
       }
  }
}


