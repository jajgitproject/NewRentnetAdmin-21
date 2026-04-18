// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerPersonInstructionService } from '../../customerPersonInstruction.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CustomerPersonInstruction } from '../../customerPersonInstruction.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { DriverDropDown } from '../../driverDropDown.model';
import { Observable } from 'rxjs';
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
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerPersonInstruction;
  searchTerm : FormControl = new FormControl();
 
  public DriverList?: DriverDropDown[] = [];
  filteredOptions: Observable<DriverDropDown[]>;

  image: any;
  fileUploadEl: any;
  customerPersonName: any;
  correspondingOption: DriverDropDown;
  driverID: any;
  saveDisabled:boolean = true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerPersonInstructionService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Instruction for';       
          this.advanceTable = data.advanceTable;
          this.searchTerm.setValue(this.advanceTable.instruction);
        } else 
        {
          this.dialogTitle = 'Instruction for';
          this.advanceTable = new CustomerPersonInstruction({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.customerPersonName=data.CustomerPersonName;
  }
  public ngOnInit(): void
  {
    this.InitDriver();
  }
  InitDriver(){
    this._generalService.GetDriver().subscribe
    (
      data =>   
      {
        this.DriverList = data; 
        this.filteredOptions = this.searchTerm.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );      
      }
    );
  }

  getTitle(driverId: any) {
    this.driverID=driverId;
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.DriverList.filter(
      customer => 
      {
        return customer.driverName.toLowerCase().indexOf(filterValue)===0;
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
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerPersonInstructionID: [this.advanceTable.customerPersonInstructionID],
      customerPersonID: [this.advanceTable.customerPersonID],
     
      instruction: [this.advanceTable.instruction],
      activationStatus: [this.advanceTable.activationStatus]
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
  reset(): void 
  {
    this.advanceTableForm.reset();
  }
  onNoClick():void{
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({driverID:this.driverID});
    this.advanceTableForm.patchValue({customerPersonID:this.data.CustomerPersonID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerPersonInstructionCreate:CustomerPersonInstructionView:Success');//To Send Updates 
       this.saveDisabled = true; 
    
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerPersonInstructionAll:CustomerPersonInstructionView:Failure');//To Send Updates
       this.saveDisabled = true;  
    }
  )
  }
  public Put(): void
  {
 
    this.advanceTableForm.patchValue({customerPersonID:this.advanceTable.customerPersonID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerPersonInstructionUpdate:CustomerPersonInstructionView:Success');//To Send Updates 
       this.saveDisabled = true; 
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerPersonInstructionAll:CustomerPersonInstructionView:Failure');//To Send Updates  
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

//   if (/[a-zA-Z]/.customerPersonInstruction(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }


}


