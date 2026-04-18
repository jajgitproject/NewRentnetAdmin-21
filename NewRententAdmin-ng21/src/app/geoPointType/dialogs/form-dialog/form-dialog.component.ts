// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { GeoPointTypeService } from '../../geoPointType.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { GeoPointType } from '../../geoPointType.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { GeoPointTypeDropDown } from '../../geoPointTypeDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';
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
  advanceTable: GeoPointType;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  SearchName: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  dataSource: GeoPointType[] | null;
 
  public GeoPointTypeList?: GeoPointTypeDropDown[] = [];
  filteredOptions: Observable<GeoPointTypeDropDown[]>;
  public QualificationList?: QualificationDropDown[] = [];
  searchTerm : FormControl = new FormControl();
  myControl: FormControl = new FormControl();

  image: any;
  fileUploadEl: any;
  geoPointTypeID: any;
  geoPointTypeHierarchyID: any;
  saveDisabled: boolean = true;
  constructor(public geoPointTypeService: GeoPointTypeService,
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: GeoPointTypeService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Geo Point Type';
          this.dialogTitle ='Geo Point Type';
          this.advanceTable = data.advanceTable;
          //this.ImagePath=this.advanceTable.image;
          //this.ImagePath=this.advanceTable.flagIcon;
          //this.advanceTableForm.value.geoPointTypeHierarchyID=data.advanceTable.parent;
          this.myControl.setValue(this.advanceTable.parent);
        
        } else 
        {
          //this.dialogTitle = 'Create Geo Point Type';
          this.dialogTitle = 'Geo Point Type';
          this.advanceTable = new GeoPointType({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.InitGeoPointTypes();
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
  InitGeoPointTypes(){
    this._generalService.GetGeoPointTypes().subscribe(
      data=>
      {
        this.GeoPointTypeList=data;
        this.advanceTableForm.controls['myControl'].setValidators([this.parentValidator(this.GeoPointTypeList)
        ]);
        this.advanceTableForm.controls['myControl'].updateValueAndValidity();
        this.filteredOptions = this.advanceTableForm.controls['myControl'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.GeoPointTypeList.filter(
      customer => 
      {
        return customer.geoPointType.toLowerCase().includes(filterValue);
      });
  }
  OnParentSelect(selectedParent: string)
  {
    const ParentName = this.GeoPointTypeList.find(
      data => data.geoPointType === selectedParent
    );
    if (selectedParent) 
    {
      this.getTitles(ParentName.geoPointTypeID);
    }
  }
  getTitles(geoPointTypeHierarchyID: any)
  {
    this.geoPointTypeHierarchyID = geoPointTypeHierarchyID;
    this.advanceTableForm.patchValue({geoPointTypeHierarchyID:this.geoPointTypeHierarchyID});
  }

  parentValidator(GeoPointTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No value to validate, return null (no error)
      }
      const value = control.value?.toLowerCase();
      const match = GeoPointTypeList.some(group => group.geoPointType.toLowerCase() === value);
      return match ? null : { parentInvalid: true };
    };
  }
 
  // InitGeoPointTypes() {
  //    ;
  //   this._generalService.GetGeoPointTypes().subscribe(
  //     data =>
  //     {
  //        ;
  //       this.GeoPointTypeList = data;
  //     },
  //     error =>
  //     {
       
  //     }
  //   );
  // }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      geoPointTypeID: [this.advanceTable.geoPointTypeID],
      geoPointType: [this.advanceTable.geoPointType],
      geoPointTypeHierarchyID : [this.advanceTable.geoPointTypeHierarchyID],
      myControl:[this.advanceTable.parent],
      activationStatus:[this.advanceTable.activationStatus,],
    });
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
  onNoClick(): void 
  {
    if(this.action==='add')
    {
      this.advanceTableForm.reset();
    }
    else if(this.action==='edit')
    {
      this.dialogRef.close();
    }  
  }

  public Post(): void
  {
    this.advanceTableForm.patchValue({geoPointTypeHierarchyID:this.geoPointTypeHierarchyID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {     
        this.dialogRef.close();
       this._generalService.sendUpdate('GeoPointTypeCreate:GeoPointTypeView:Success');//To Send Updates
       this.saveDisabled = true;
  },
    error =>
    {
       this._generalService.sendUpdate('GeoPointTypeAll:GeoPointTypeView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }
  public Put(): void
  {
     ;
     this.advanceTableForm.patchValue({geoPointTypeHierarchyID:this.geoPointTypeHierarchyID ||this.advanceTable.geoPointTypeHierarchyID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      //  if(response.activationStatus.indexOf("Duplicate") !== -1)
      //  {
      //   this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
      //  }
      //  else 
      //  {
        this.dialogRef.close();
       this._generalService.sendUpdate('GeoPointTypeUpdate:GeoPointTypeView:Success');//To Send Updates  
       this.saveDisabled = true;
    },
    error =>
    {
     this._generalService.sendUpdate('GeoPointTypeAll:GeoPointTypeView:Failure');//To Send Updates  
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
         ;
          this.Post();
       }
  }
  
  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({image:this.ImagePath})
  }

  // public fileChanged(event?: UIEvent): void {
  //   const files: FileList = this.fileUploadEl.nativeElement.files;
  //   const file = files[0];
  //   const reader = new FileReader();
  //   const loaded = (el) => {
  //     const contents = el.target.result;
  //     this.contents = contents;
  //   }
  //   reader.onload = loaded;
  //   reader.readAsText(file, 'UTF-8');
  //   this.name = file.name;
  // }

  // onSelectFile(event) {
  //   const files = event.target.files;
  //   if (files) {
  //     for (const file of files) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         if (file.type.indexOf('image') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'img',
  //           });
  //         } else if (file.type.indexOf('video') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'video',
  //           });
  //         } else if (file.type.indexOf('pdf') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'pdf',
  //           });
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // }

/////////////////for Image Upload ends////////////////////////////

// Only Numbers with Decimals
// keyPressNumbersDecimal(event) {
//   var charCode = (event.which) ? event.which : event.keyCode;
//   if (charCode != 46 && charCode > 31
//     && (charCode < 48 || charCode > 57)) {
//     event.preventDefault();
//     return false;
//   }
//   return true;
// }

// Only AlphaNumeric
// keyPressAlphaNumeric(event) {

//   var inp = String.fromCharCode(event.keyCode);

//   if (/[a-zA-Z]/.geoPointType(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}


