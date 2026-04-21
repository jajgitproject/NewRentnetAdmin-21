// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.sass']
})
export class TestComponent{
 // Form 1
 register: FormGroup;
 hide = true;
 // Form 2
 secondForm: FormGroup;
 hide2 = true;
 // Form 3
 thirdForm: FormGroup;
 hide3 = true;
 constructor(private fb: FormBuilder) {
   this.initForm();
   this.initSecondForm();
   this.initThirdForm();
 }
 initForm() {
   this.register = this.fb.group({
     first: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
     last: [''],
     password: ['', [Validators.required]],
     email: [
       '',
       [Validators.required, Validators.email, Validators.minLength(5)]
     ],
     address: [''],
     city: ['', [Validators.required]],
     state: ['', [Validators.required]],
     country: ['', [Validators.required]],
     termcondition: [false, [Validators.requiredTrue]]
   });
 }
 initSecondForm() {
   this.secondForm = this.fb.group({
     first: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
     last: [''],
     password: ['', [Validators.required]],
     email: [
       '',
       [Validators.required, Validators.email, Validators.minLength(5)]
     ],
     address: [''],
     city: ['', [Validators.required]],
     state: ['', [Validators.required]],
     country: ['', [Validators.required]],
     termcondition: [false, [Validators.requiredTrue]]
   });
 }
 initThirdForm() {
   this.thirdForm = this.fb.group({
     first: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
     last: [''],
     password: ['', [Validators.required]],
     email: [
       '',
       [Validators.required, Validators.email, Validators.minLength(5)]
     ],
     address: [''],
     city: ['', [Validators.required]],
     state: ['', [Validators.required]],
     country: ['', [Validators.required]],
     termcondition: [false, [Validators.requiredTrue]]
   });
 }
 onRegister() {
 }
 onsecondFormSubmit() {
 }
 onThirdFormSubmit() {
 }
}


