import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-develop',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="develop-container">
      <mat-card class="develop-card">
        <mat-card-header>
          <mat-card-title>Develop</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>This page is under development.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .develop-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
      padding: 2rem;
    }

    .develop-card {
      width: 100%;
      max-width: 600px;
      padding: 2rem;
    }
  `],
})
export class DevelopComponent {}

