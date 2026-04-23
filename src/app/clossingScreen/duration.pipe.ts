// @ts-nocheck
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(seconds: number): string {
    // const days = Math.floor(seconds / (3600 * 24));
    // const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    // const minutes = Math.floor((seconds % 3600) / 60);
    // const remainingSeconds = seconds % 60;

        var days = Math.floor(seconds / (60 * 60 * 24 * 1000));
        var hours = Math.floor(seconds / (60 * 60 * 1000)) - (days * 24);
        var minutes = Math.floor(seconds / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
        var seconds = Math.floor(seconds / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));

    return `${days}d:${hours}h:${minutes}m:${seconds}s`;
  }
}


