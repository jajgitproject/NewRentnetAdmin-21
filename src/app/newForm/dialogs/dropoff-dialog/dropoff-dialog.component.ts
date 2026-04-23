// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { FormDialogAddPassengersComponent } from 'src/app/addPassengers/dialogs/form-dialog/form-dialog.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
export interface User {
  name: string;
}
@Component({
  standalone: false,
  selector: 'app-dropoff-dialog',
  templateUrl: './dropoff-dialog.component.html',
  styleUrls: ['./dropoff-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class DropOffDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  myControl = new FormControl();
  options: User[] = [{ name: 'Lodhi Road' }, { name: 'Noida' }, { name: 'Gurgaon' }];
  filteredOptions: Observable<User[]>;

 
  image: any;
  fileUploadEl: any;
  constructor(
  public dialogRef: MatDialogRef<DropOffDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private el: ElementRef,
  public _generalService:GeneralService)
  {}
  public ngOnInit(): void
  {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.options.slice()))
    );
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(
      (option) => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }


  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);

  addPassengers()
  {
    const dialogRef = this.dialog.open(FormDialogAddPassengersComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
          }
      });
  }

  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
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
    
    this.advanceTableForm.reset();
   
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

}


