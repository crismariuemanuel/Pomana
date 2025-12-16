import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Cause, CausesService } from '../../core/causes/causes.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-cause-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatDialogModule, MatProgressBarModule, MatSnackBarModule, MatTooltipModule],
  templateUrl: './cause-details.component.html',
  styleUrl: './cause-details.component.scss',
})
export class CauseDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly causesService = inject(CausesService);
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly cause = signal<Cause | undefined>(undefined);
  readonly isLoading = signal<boolean>(true);
  readonly loadError = signal<string>('');
  readonly progress = computed(() => {
    const c = this.cause();
    if (!c || c.target <= 0) return 0;
    return Math.min(100, Math.max(0, (c.raised / c.target) * 100));
  });
  readonly isLoggedIn = computed(() => this.authService.isLoggedIn());

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (Number.isNaN(id)) {
      this.loadError.set('Invalid cause id');
      this.isLoading.set(false);
      return;
    }

    this.causesService.getCauseById(id).subscribe({
      next: (c) => {
        console.log('Cause received:', c);
        if (c) {
          this.cause.set(c);
          this.isLoading.set(false);
          this.loadError.set('');
        } else {
          this.loadError.set('Cause not found.');
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Error loading cause:', err);
        this.loadError.set(err.error?.detail || err.message || 'Cause not found or failed to load.');
        this.isLoading.set(false);
      },
    });
  }

  openComingSoon(): void {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Please log in to donate', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }
    this.dialog.open(ComingSoonDialogComponent);
  }
}

@Component({
  selector: 'app-coming-soon-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Coming Soon</h2>
    <div mat-dialog-content>Payment flow will be implemented later.</div>
    <div mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>OK</button>
    </div>
  `,
})
export class ComingSoonDialogComponent {}

