import { Component, OnInit, inject, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CausesService, Cause } from '../../../core/causes/causes.service';

@Component({
  selector: 'app-admin-review',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './admin-review.component.html',
  styleUrl: './admin-review.component.scss',
})
export class AdminReviewComponent implements OnInit {
  private readonly causesService = inject(CausesService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  pendingCauses: Cause[] = [];
  isLoading = false;
  loadError = '';
  processingIds = new Set<number>();

  ngOnInit(): void {
    this.loadCauses();
  }

  loadCauses(): void {
    this.isLoading = true;
    this.loadError = '';

    this.causesService.getAllCauses('pending_review').subscribe({
      next: (causes) => {
        this.pendingCauses = causes.filter(c => c.status === 'pending_review');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading causes:', err);
        this.loadError = 'Failed to load causes. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
  }

  getTargetFormatted(cause: Cause): string {
    return '$' + this.formatCurrency(cause.target);
  }

  onViewDetails(causeId: number): void {
    this.router.navigate(['/admin/causes', causeId]);
  }

  onApprove(causeId: number): void {
    this.processingIds.add(causeId);
    this.cdr.detectChanges();

    this.causesService.approveCause(causeId).subscribe({
      next: () => {
        this.pendingCauses = this.pendingCauses.filter(c => c.id !== causeId);
        this.processingIds.delete(causeId);

        this.snackBar.open('Cause approved successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error approving cause:', err);
        this.processingIds.delete(causeId);
        this.snackBar.open('Failed to approve cause', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.cdr.detectChanges();
      },
    });
  }

  onReject(causeId: number): void {
    const dialogRef = this.dialog.open(RejectCauseDialogComponent, {
      width: '500px',
      data: { causeId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.confirmed && result.reviewNotes) {
        this.processingIds.add(causeId);
        this.cdr.detectChanges();

        this.causesService.rejectCause(causeId, result.reviewNotes).subscribe({
          next: () => {
            this.pendingCauses = this.pendingCauses.filter(c => c.id !== causeId);
            this.processingIds.delete(causeId);

            this.snackBar.open('Cause rejected', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });

            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error rejecting cause:', err);
            this.processingIds.delete(causeId);
            this.snackBar.open('Failed to reject cause', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.cdr.detectChanges();
          },
        });
      }
    });
  }
}

// Reject Dialog Component
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reject-cause-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './reject-cause-dialog.component.html',
  styleUrl: './reject-cause-dialog.component.scss',
})
export class RejectCauseDialogComponent {
  reviewNotes = '';

  constructor(
    public dialogRef: MatDialogRef<RejectCauseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { causeId: number }
  ) {}
}

