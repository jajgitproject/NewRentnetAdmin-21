// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AdditionalServiceService } from '../../additionalService.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { AdditionalService } from '../../additionalService.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { ServiceTypeDropDown } from 'src/app/general/serviceTypeDropDown.model';
import { AdditionalServiceDropDown } from '../../additionalServiceDropDown.model';
import { UomDropDown } from 'src/app/general/uomDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: AdditionalService;

  public UOMList?: UomDropDown[] = [];
  searchUomTerm : FormControl = new FormControl();
  filteredUomOptions: Observable<UomDropDown[]>;

  public ServiceTypeList?: ServiceTypeDropDown[] = [];
  filteredOptions: Observable<ServiceTypeDropDown[]>;
  searchTypeTerm : FormControl = new FormControl();
  saveDisabled:boolean=true;

  public AdditionalServiceList?: AdditionalServiceDropDown[] = [];
  serviceTypeID: any;
  uomid: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: AdditionalServiceService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Additional Service';       
          this.advanceTable = data.advanceTable;
          this.searchUomTerm.setValue(this.advanceTable.uom);
          this.searchTypeTerm.setValue(this.advanceTable.serviceType);
        } else 
        {
          this.dialogTitle = 'Additional Service';
          this.advanceTable = new AdditionalService({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
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
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      additionalServiceID: [this.advanceTable.additionalServiceID],
      additionalService: [this.advanceTable.additionalService,],
      serviceTypeID: [this.advanceTable.serviceTypeID],
      serviceType: [this.advanceTable.serviceType],
      uomid: [this.advanceTable.uomid],
      uom: [this.advanceTable.uom],
      activationStatus: [this.advanceTable.activationStatus],
      // updatedBy: [this.advanceTable.updatedBy],
      // updateDateTime: [this.advanceTable.updateDateTime,this.noWhitespaceValidator]],

    });
  }

//   public noWhitespaceValidator(control: FormControl) {
//     const isWhitespace = (control.value || '').trim().length === 0;
//     const isValid = !isWhitespace;
//     return isValid ? null : { 'whitespace': true };
// }

  submit() 
  {
    // emppty stuff
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
    this.advanceTableForm.patchValue({serviceTypeID:this.serviceTypeID});
    this.advanceTableForm.patchValue({uomid:this.uomid});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
       
          this.dialogRef.close();
         this._generalService.sendUpdate('AdditionalServiceCreate:AdditionalServiceView:Success');//To Send Updates 
         this.saveDisabled = true; 
      
    },
    error =>
    {
       this._generalService.sendUpdate('AdditionalServiceAll:AdditionalServiceView:Failure');//To Send Updates
       this.saveDisabled = true;  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({serviceTypeID:this.serviceTypeID || this.advanceTable.serviceTypeID});
    this.advanceTableForm.patchValue({uomid:this.uomid || this.advanceTable.uomid});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
       
          this.dialogRef.close();
         this._generalService.sendUpdate('AdditionalServiceUpdate:AdditionalServiceView:Success');//To Send Updates
         this.saveDisabled = true;  
      
    },
    error =>
    {
     this._generalService.sendUpdate('AdditionalServiceAll:AdditionalServiceView:Failure');//To Send Updates
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

  public ngOnInit(): void
  {
    // this. DynamicName();
    this.InitServiceTypes();
    this.InitGetUOMAll();
  }

  InitServiceTypes() {
    //
     this._generalService.GetServiceType().subscribe(
       data =>
       {
         this.ServiceTypeList = data;
         this.advanceTableForm.controls['serviceType'].setValidators([Validators.required,
          this.serviceTypeValidator(this.ServiceTypeList)
        ]);
        this.advanceTableForm.controls['serviceType'].updateValueAndValidity();
         this.filteredOptions = this.advanceTableForm.controls['serviceType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
       },
       error =>
       {
        
       }
     );
  }

  getTypeID(serviceTypeID: any) {
   
    this.serviceTypeID=serviceTypeID;
  }

  serviceTypeValidator(ServiceTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = ServiceTypeList.some(group => group.serviceType.toLowerCase() === value);
      return match ? null : { ServiceTypeInvalid: true };
    };
  }

   private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.ServiceTypeList.filter(
      customer => 
      {
        return customer.serviceType.toLowerCase().includes(filterValue);
      }
    );
  }

  onServiceTypeselected(selectedserviceType: string) {
    const selectedService = this.ServiceTypeList.find(
      data => data.serviceType === selectedserviceType
    );
  
    if (selectedserviceType) {
      this.getTypeID(selectedService.serviceTypeID);
    }
  }

  InitGetUOMAll()
  {
    this._generalService.GetUOM().subscribe(
      data =>
       {
        this.UOMList = data; 
        this.advanceTableForm.controls['uom'].setValidators([Validators.required,
          this.uomTypeValidator(this.UOMList)
        ]);
        this.advanceTableForm.controls['uom'].updateValueAndValidity(); 
        this.filteredUomOptions = this.advanceTableForm.controls['uom'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterUom(value || ''))
        );     
       },
       error =>
       {
       }
    );
  }

 getUomID(uomid: any) {
   
    this.uomid=uomid;
  }

   private _filterUom(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.UOMList.filter(
      customer => 
      {
        return customer.uom.toLowerCase().includes(filterValue);
      }
    );
  }

  onUomSelected(selectedUom: string) {
    const uom= this.UOMList.find(
      data => data.uom === selectedUom
    );
  
    if (selectedUom) {
      this.getUomID(uom.uomid);
    }
  }
  uomTypeValidator(UOMList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = UOMList.some(group => group.uom.toLowerCase() === value);
      return match ? null : { UomInvalid: true };
    };
  }

}


