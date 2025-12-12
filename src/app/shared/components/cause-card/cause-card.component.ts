import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Cause } from '../../../core/causes/causes.service';

@Component({
  selector: 'app-cause-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatProgressBarModule],
  template: `
    <mat-card class="cause-card" appearance="outlined">
      <img
        class="cover"
        [src]="cause?.imageUrl"
        [alt]="cause?.title"
        loading="lazy"
      />

      <mat-card-content>
        <h3 class="title">{{ cause?.title }}</h3>
        <p class="subtitle">{{ cause?.shortDescription }}</p>

        <div class="progress-row">
          <div class="raised-text">
            Raised {{ cause?.raised | currency:'USD':'symbol-narrow':'1.0-0' }}
            of {{ cause?.target | currency:'USD':'symbol-narrow':'1.0-0' }}
          </div>
          <mat-progress-bar
            class="bar"
            mode="determinate"
            [value]="progress"
          ></mat-progress-bar>
        </div>
      </mat-card-content>

      <mat-card-actions align="end">
        <a
          mat-stroked-button
          color="primary"
          [routerLink]="['/cause', cause?.id]"
          >View Cause</a
        >
        <button mat-button color="primary" (click)="onDonate()">
          Donate
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .cause-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 12px;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 10px 26px rgba(0, 0, 0, 0.08);
        border: 1px solid #dcd2c4;
        background: linear-gradient(180deg, #f9f5ec 0%, #f6f1e7 100%);
      }

      .cover {
        width: 100%;
        height: 190px;
        object-fit: cover;
      }

      mat-card-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 20px 20px 12px 20px;
      }

      .title {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 700;
        color: #2d2d2d;
        line-height: 1.4;
      }

      .subtitle {
        margin: 0;
        color: #545454;
        font-size: 1rem;
        line-height: 1.6;
      }

      .progress-row {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .bar {
        height: 8px;
        border-radius: 999px;
      }

      .raised-text {
        font-size: 1rem;
        color: #2d2d2d;
        font-weight: 700;
        line-height: 1.5;
      }

      mat-card-actions {
        display: flex;
        gap: 8px;
        justify-content: space-between;
        padding: 0 16px 16px 16px;
      }

      mat-card-actions a[mat-stroked-button] {
        background-color: #EDEBE6;
        border-color: #000000;
        color: #000000;
      }

      mat-card-actions a[mat-stroked-button]:hover {
        background-color: #e0ddd6;
      }
    `,
  ],
})
export class CauseCardComponent {
  @Input({ required: true }) cause!: Cause;

  get progress(): number {
    if (!this.cause || this.cause.target <= 0) {
      return 0;
    }
    const pct = (this.cause.raised / this.cause.target) * 100;
    return Math.min(100, Math.max(0, pct));
  }

  onDonate(): void {
    console.log(`Donate clicked for cause ${this.cause?.id}: ${this.cause?.title}`);
  }
}

