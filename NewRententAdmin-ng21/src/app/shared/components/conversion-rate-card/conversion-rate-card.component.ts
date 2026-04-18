// @ts-nocheck
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: false,
  selector: 'app-conversion-rate-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './conversion-rate-card.component.html',
  styleUrls: ['./conversion-rate-card.component.scss'],
})
export class ConversionRateCardComponent {
  @Input() title: string = 'Conversion Rate';
  @Input() currentRate: number = 0;
  @Input() previousRate: number = 0;
  @Input() targetRate: number = 0;
  @Input() color: string = 'primary';

  get trendIcon(): string {
    const diff = this.currentRate - this.previousRate;
    if (diff > 0) return 'trending_up';
    if (diff < 0) return 'trending_down';
    return 'trending_flat';
  }

  get trendClass(): string {
    const diff = this.currentRate - this.previousRate;
    if (diff > 0) return 'trend-positive';
    if (diff < 0) return 'trend-negative';
    return 'trend-neutral';
  }

  get trendPercentage(): number {
    if (this.previousRate === 0) return 0;
    return ((this.currentRate - this.previousRate) / this.previousRate) * 100;
  }

  get progressPercentage(): number {
    if (this.targetRate === 0) return 0;
    return (this.currentRate / this.targetRate) * 100;
  }

  get progressColor(): string {
    const percentage = this.progressPercentage;
    if (percentage >= 100) return 'success';
    if (percentage >= 80) return 'primary';
    if (percentage >= 60) return 'accent';
    return 'warn';
  }

  get isTargetMet(): boolean {
    return this.currentRate >= this.targetRate;
  }
}

