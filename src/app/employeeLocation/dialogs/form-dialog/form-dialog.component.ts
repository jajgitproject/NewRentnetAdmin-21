// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { EmployeeLocationService } from '../../employeeLocation.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { EmployeeLocation } from '../../employeeLocation.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Observable } from 'rxjs';
import { LocationDropDown } from 'src/app/employee/employeeDropDown.model';
import { map, startWith } from 'rxjs/operators';

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
  advanceTable: EmployeeLocation;
  filteredLocationOptions: Observable<LocationDropDown []>;
  public LocationList?: LocationDropDown[] = [];
  LocationID: any;
  EmployeeID: any;
  existAllLocation: boolean = false;
  isSaveDisabled: boolean = false;
  saveDisabled: boolean = true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: EmployeeLocationService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Location';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Location';
          this.advanceTable = new EmployeeLocation({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.EmployeeID=data.employeeID;
  }

  public ngOnInit(): void
  {
    this.InitLocation();
  }

  InitLocation()
  {
    this._generalService.EmployeeDropDownBasedOnLocation(this.EmployeeID).subscribe(
    data=>
    {
      // if(data)
      // {
        this.LocationList=data;
        this.filteredLocationOptions = this.advanceTableForm.controls['location'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterLocation(value || ''))
        );
      // }
      // else
      // {
      //   this.existAllLocation=true;
      //   this.isSaveDisabled=true;
      //   this.advanceTableForm.controls['location'].disable();
      // }
    });
  }
  
  private _filterLocation(value: string): any {
    const filterValue = value.toLowerCase();
    return this.LocationList.filter(
      data => 
      {
        return data.organizationalEntityName.toLowerCase().includes(filterValue);
      }
    );
  }

  OnLocationSelect(selectedLocation: string)
  {
    const LocationName = this.LocationList.find(
      data => data.organizationalEntityName === selectedLocation
    );
    if (selectedLocation) 
    {
      this.getLocationID(LocationName.organizationalEntityID);
    }
  }
  
  getLocationID(organizationalEntityID: any) {
    this.LocationID=organizationalEntityID;
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      employeeLocationID: [this.advanceTable.employeeLocationID],
      employeeID: [this.advanceTable.employeeID],
      locationID: [this.advanceTable.locationID],
      location: [this.advanceTable.location],
      activationStatus: [this.advanceTable.activationStatus],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
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
  public Post(): void
  {
    this.advanceTableForm.patchValue({employeeID:this.EmployeeID});
    this.advanceTableForm.patchValue({locationID:this.LocationID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
      {
        if (response && response.activationStatus &&typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate"))
        {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure'); // Duplicacy Error Handling 
          this.saveDisabled = true;
        } 
        else 
        {
          this.dialogRef.close();
          this._generalService.sendUpdate('EmployeeLocationCreate:EmployeeLocationView:Success'); // Success Handling
          this.saveDisabled = true;
        }
      },
    error =>
    {
       this._generalService.sendUpdate('EmployeeLocationAll:EmployeeLocationView:Failure');//To Send Updates
       this.saveDisabled = true;  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({locationID:this.LocationID || this.advanceTable.locationID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      if (response && response.activationStatus &&typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate"))
      {
        this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure'); // Duplicacy Error Handling
        this.saveDisabled = true;
      }
      else
      {
        this.dialogRef.close();
        this._generalService.sendUpdate('EmployeeLocationUpdate:EmployeeLocationView:Success');//To Send Updates  
        this.saveDisabled = true;
      }       
    },
    error =>
    {
     this._generalService.sendUpdate('EmployeeLocationAll:EmployeeLocationView:Failure');//To Send Updates
     this.saveDisabled = true;  
    }
  )
  }
  public confirmAdd(): void 
  {
    this.saveDisabled = false;
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


