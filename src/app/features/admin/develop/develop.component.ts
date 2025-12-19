import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-develop',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './develop.component.html',
  styleUrl: './develop.component.scss',
})
export class DevelopComponent {}

