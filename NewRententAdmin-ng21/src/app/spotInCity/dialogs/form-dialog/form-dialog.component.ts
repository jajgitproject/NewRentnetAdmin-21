// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { SpotInCityService } from '../../spotInCity.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { SpotInCity } from '../../spotInCity.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { SpotInCityDropDown } from '../../spotInCityDropDown.model';
import { SpotTypeDropDown } from '../../spotTypeDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  advanceTable: SpotInCity;
  fName = '';
  isRowHidden=true;
  contents: any[];
  mydata = [];
  name = '';
  SearchName: string = '';
  isLoading: boolean = false;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  dataSource: SpotInCity[] | null;
  options: any = {
    componentRestrictions: { country: 'IN' }
  }
  geoStringAddress:any;
  geoLat:any;
  geoLng:any;
  public SpotInCityList?: SpotInCityDropDown[] = [];
  public SpotTypeList?: SpotTypeDropDown[] = [];
  filteredSpotTypeOptions: Observable<SpotTypeDropDown[]>;
  searchSpotType: FormControl = new FormControl();
  filteredSpotInCityOptions: Observable<SpotInCityDropDown[]>;
  searchGeoPoint: FormControl = new FormControl();
  image: any;
  fileUploadEl: any;
  geoPointTypeID: any;
  geoPointParentID: any;
  constructor(public spotInCityService: SpotInCityService,
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: SpotInCityService,
    private fb: FormBuilder,
    private el: ElementRef,
    private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
    debugger;   
    // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Spot In City';               
          this.dialogTitle ='Spot In City';
          this.advanceTable = data.advanceTable;
          console.log(this.advanceTable);
          this.advanceTable.spotType = this.advanceTable.type;
          this.ImagePath=this.advanceTable.bannerImage;
          this.ImagePath1=this.advanceTable.icon;
          var value = this.advanceTable.geoLocation.replace(
            '(',
            ''
          );
          value = value.replace(')', '');
          var lat = value.split(' ')[2];
          var long = value.split(' ')[1];

          this.advanceTable.latitude=lat;
          this.advanceTable.longitude=long;
          
          this.searchSpotType.setValue(this.advanceTable.type);
          this.searchGeoPoint.setValue(this.advanceTable.parent);

        } 
        else 
        {
          //this.dialogTitle = 'Create Spot In City';
          this.dialogTitle = 'Spot In City';
          this.advanceTable = new SpotInCity({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.InitSpotInCities();
    this.InitSpotCities();
  }

  InitSpotCities(){
    this._generalService.GetSpotCity().subscribe(
      data=>
      {
        this.SpotTypeList=data;
        this.advanceTableForm.controls['spotType'].setValidators([Validators.required,
          this.spotTypeValidator(this.SpotTypeList)
        ]);
        this.advanceTableForm.controls['spotType'].updateValueAndValidity();

        this.filteredSpotTypeOptions = this.advanceTableForm.controls['spotType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  
  private _filter(value: string): any {
    if (!value || value.length < 3) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.SpotTypeList.filter(
      customer => 
      {
        return customer.geoPointType.toLowerCase().includes(filterValue);
      }
    );
  }
  
  onSpotTypeSelected(selectedSpotType: string) {
    const selectedSpot = this.SpotTypeList.find(
      spot => spot.geoPointType === selectedSpotType
    );
  
    if (selectedSpot) {
      this.getTitles(selectedSpot.geoPointTypeID);
    }
  }
  
  getTitles(geoPointTypeID: any) {
    //debugger;
    this.geoPointTypeID=geoPointTypeID;
  }

  spotTypeValidator(SpotTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = SpotTypeList.some(group => group.geoPointType.toLowerCase() === value);
      return match ? null : { spotTypeInvalid: true };
    };
  }

  InitSpotInCities(){
    this._generalService.GetAllGeoPointData().subscribe(
      data=>
      {
        this.SpotInCityList=data;
        this.advanceTableForm.controls['parent'].setValidators([this.parentValidator(this.SpotInCityList)
        ]);
        this.advanceTableForm.controls['parent'].updateValueAndValidity();

        this.filteredSpotInCityOptions = this.advanceTableForm.controls['parent'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterSpotInCity(value || ''))
        ); 
      });
  }
  
  private _filterSpotInCity(value: string): any {
    if (!value || value.length < 3) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.SpotInCityList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  }

  onParentSelected(selectedSParentName: string) {
    debugger;
    const selectedParent = this.SpotInCityList.find(
      parent => parent.geoPointName === selectedSParentName
    );
  
    if (selectedParent) {
      this.getgeoPointParentID(selectedParent.geoPointID);
    }
  }
  
  getgeoPointParentID(geoPointParentID: any) {
//console.log(geoPointParentID);
    this.geoPointParentID=geoPointParentID;
    //this.advanceTableForm.patchValue({geoPointParentID : this.geoPointParentID});
  }

  parentValidator(SpotInCityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No value to validate, return null (no error)
      }
      const value = control.value?.toLowerCase();
      const match = SpotInCityList.some(group => group.geoPointName?.toLowerCase() === value);
      return match ? null : { parentInvalid: true };
    };
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
      geoPointID: [this.advanceTable.geoPointID],
      geoPointTypeID: [this.advanceTable.geoPointTypeID],
      geoPointParentID: [this.advanceTable.geoPointParentID],
      geoLocation: [this.advanceTable.geoLocation],
      geoSearchString : [this.advanceTable.geoSearchString,[this.googlePickupValidator()]],
      geoPointName: [this.advanceTable.geoPointName],
      apiIntegrationCode : [this.advanceTable.apiIntegrationCode],
      bannerImage: [this.advanceTable.bannerImage],
      bannerImageAltTag : [this.advanceTable.bannerImageAltTag],
      icon: [this.advanceTable.icon],
      spotType: [this.advanceTable.spotType],
      parent: [this.advanceTable.parent],
      iconAltTag : [this.advanceTable.iconAltTag],
      latitude:[this.advanceTable.latitude],
      longitude:[this.advanceTable.longitude],
      activationStatus:[this.advanceTable.activationStatus,],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

AddressChange(address: Address) {
  this.geoStringAddress = address.formatted_address;
  this.advanceTableForm.patchValue({ geoPointName: address.formatted_address });
  this.geoLat=address.geometry.location.lat();
  this.geoLng=address.geometry.location.lng();
  this.advanceTableForm.patchValue({latitude:address.geometry.location.lat()});
  this.advanceTableForm.patchValue({longitude:address.geometry.location.lng()});
   this.advanceTableForm.get('geoSearchString')?.updateValueAndValidity(); 
  
}

  onPickupTyping() {
    this.advanceTableForm.patchValue({
      latitude: null,
      longitude: null
    });
  
    this.advanceTableForm.get('geoSearchString')?.updateValueAndValidity();
  }
  
  
  googlePickupValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
  
      if (!control.parent) return null;
  
      const latitude = control.parent.get('latitude')?.value;
      const value = control.value;
  
      // Agar empty hai to required handle karega
      if (!value) return null;
  
      // Agar latitude nahi hai → dropdown select nahi hua
      if (!latitude) {
        return { invalidGeoSearchString: true };
      }
  
      return null;
    };
  }

// InitSpotInCities() {
//  this._generalService.GetSpotInCity().subscribe(
//    data =>
//    {
//       ;
//      this.SpotInCityList = data;
//      //console.log(this.SpotInCityList);
//    },
//    error =>
//    {
    
//    }
//  );
// }

// InitSpotCities() {
//   this._generalService.GetSpotCity().subscribe(
//     data =>
//     {
//        ;
//       this.SpotTypeList = data;
//       //console.log(this.SpotTypeList);
//     },
//     error =>
//     {
     
//     }
//   );
//  }

  submit() 
  {
    // emppty stuff
  }
  reset(){
    this.advanceTableForm.reset();
    this.ImagePath="";
    this.ImagePath1="";
  }
  onNoClick():void{
    this.dialogRef.close();
  }

//   public loadData() 
//   {
//      this.spotInCityService.getTableData(this.SearchName,this.SearchActivationStatus, this.PageNumber).subscribe
//    (
//      data =>   
//      {
        
//        this.dataSource = data;
//      },
//      (error: HttpErrorResponse) => { this.dataSource = null;}
//    );
//  }
public Post(): void {
  this.isLoading = true; // Show spinner, disable buttons

  this.advanceTableForm.patchValue({
    geoPointTypeID: this.geoPointTypeID,
    geoPointParentID: this.geoPointParentID,
    geoLocation: this.advanceTableForm.value.latitude + ',' + this.advanceTableForm.value.longitude,
    geoSearchString: this.geoStringAddress
  });

  this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
    response => {
      this.isLoading = false; // Hide spinner on success
      this.dialogRef.close();
      this._generalService.sendUpdate('SpotInCityCreate:SpotInCityView:Success');
    },
    error => {
      this.isLoading = false; // Hide spinner on failure
      this._generalService.sendUpdate('SpotInCityAll:SpotInCityView:Failure');
    }
  );
}

public Put(): void {
  this.isLoading = true; // Show spinner, disable buttons

  this.advanceTableForm.patchValue({
    geoPointTypeID: this.geoPointTypeID || this.advanceTable.geoPointTypeID,
    geoPointParentID: this.geoPointParentID || this.advanceTable.geoPointParentID,
    geoLocation: this.advanceTableForm.value.latitude + ',' + this.advanceTableForm.value.longitude,
    geoSearchString: this.geoStringAddress || this.advanceTable.geoSearchString
  });

  this.advanceTableService.update(this.advanceTableForm.getRawValue()).subscribe(
    response => {
      this.isLoading = false; // Hide spinner on success
      this.dialogRef.close();
      this._generalService.sendUpdate('SpotInCityUpdate:SpotInCityView:Success');
    },
    error => {
      this.isLoading = false; // Hide spinner on failure
      this._generalService.sendUpdate('SpotInCityAll:SpotInCityView:Failure');
    }
  );
}
  public confirmAdd(): void 
  {
     ;
       if(this.action=="edit")
       {
          this.Put();
       }
       else
       {
          this.Post();
       }
  }
  
  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  public ImagePath1: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({bannerImage:this.ImagePath})
  }

  public ImageUpload = (event) => 
  {
    this.response = event;
    this.ImagePath1 = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({icon:this.ImagePath1})
  }

  // public fileChanged(event?: UIEvent): void {
  //   const files: FileList = this.fileUploadEl.nativeElement.files;
  //   console.log(`files: `, files);

  //   const file = files[0];
  //   const reader = new FileReader();
  //   const loaded = (el) => {
  //     const contents = el.target.result;
  //     console.log('onloaded', contents);
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
showNotification(colorName, text, placementFrom, placementAlign) {
  this.snackBar.open(text, '', {
    duration: 2000,
    verticalPosition: placementFrom,
    horizontalPosition: placementAlign,
    panelClass: colorName
  });
}

}


