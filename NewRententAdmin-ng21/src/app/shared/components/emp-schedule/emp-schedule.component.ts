// @ts-nocheck
import { Component, Input } from '@angular/core';

interface Schedule {
  name: string;
  degree: string;
  date: string;
  time: string;
  imageUrl: string;
}

@Component({
  standalone: false,
    selector: 'app-emp-schedule',
    imports: [],
    templateUrl: './emp-schedule.component.html',
    styleUrl: './emp-schedule.component.scss'
})
export class EmpScheduleComponent {
  @Input() schedules: Schedule[] = [];
}


