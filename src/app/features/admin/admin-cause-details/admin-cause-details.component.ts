import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CausesService, Cause } from '../../../core/causes/causes.service';

@Component({
  selector: 'app-admin-cause-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatDialogModule,
  ],
  templateUrl: './admin-cause-details.component.html',
  styleUrl: './admin-cause-details.component.scss',
})
export class AdminCauseDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly causesService = inject(CausesService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly cause = signal<Cause | undefined>(undefined);
  readonly isLoading = signal<boolean>(true);
  readonly loadError = signal<string>('');
  readonly progress = computed(() => {
    const c = this.cause();
    if (!c || c.target <= 0) return 0;
    return Math.min(100, Math.max(0, (c.raised / c.target) * 100));
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (Number.isNaN(id)) {
      this.loadError.set('Invalid cause id');
      this.isLoading.set(false);
      return;
    }

    this.loadCause();
  }

  loadCause(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (Number.isNaN(id)) return;

    this.isLoading.set(true);
    this.loadError.set('');

    this.causesService.getCauseById(id).subscribe({
      next: (c) => {
        this.cause.set(c);
        this.isLoading.set(false);
        this.loadError.set('');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading cause:', err);
        this.loadError.set(err.error?.detail || err.message || 'Cause not found or failed to load.');
        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  getRaisedFormatted(): string {
    const c = this.cause();
    if (!c) return '$0';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(c.raised);
  }

  getTargetFormatted(): string {
    const c = this.cause();
    if (!c) return '$0';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(c.target);
  }

  openComingSoon(): void {
    this.dialog.open(ComingSoonDialogComponent);
  }
}

@Component({
  selector: 'app-coming-soon-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './coming-soon-dialog.component.html',
})
export class ComingSoonDialogComponent {}

