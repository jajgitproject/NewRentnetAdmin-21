// @ts-nocheck
import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

interface PatientGroup {
  label: string;
  title: string;
  patientCount: number;
  colorClass: string;
}
@Component({
  standalone: false,
    selector: 'app-patient-group-list',
    imports: [NgClass],
    templateUrl: './patient-group-list.component.html',
    styleUrl: './patient-group-list.component.scss'
})
export class PatientGroupListComponent {
  @Input() patientGroups: PatientGroup[] = [];
}


