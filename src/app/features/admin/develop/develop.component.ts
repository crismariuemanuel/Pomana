import { Component, OnInit, inject, signal, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CausesService, Cause } from '../../../core/causes/causes.service';

@Component({
  selector: 'app-develop',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './develop.component.html',
  styleUrl: './develop.component.scss',
})
export class DevelopComponent implements OnInit {
  private readonly causesService = inject(CausesService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly causes = signal<Cause[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly loadError = signal<string>('');
  readonly deletingIds = signal<Set<number>>(new Set());

  displayedColumns: string[] = ['id', 'title', 'owner', 'status', 'is_public', 'actions'];

  ngOnInit(): void {
    this.loadCauses();
  }

  loadCauses(): void {
    this.isLoading.set(true);
    this.loadError.set('');

    this.causesService.getAllCauses().subscribe({
      next: (causes) => {
        this.causes.set(causes);
        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading causes:', err);
        this.loadError.set('Failed to load causes. Please try again.');
        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  onViewDetails(causeId: number): void {
    this.router.navigate(['/admin/causes', causeId]);
  }

  onDelete(cause: Cause): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px',
      data: { causeTitle: cause.title },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.deleteCause(cause.id);
      }
    });
  }

  deleteCause(causeId: number): void {
    const deletingIds = this.deletingIds();
    deletingIds.add(causeId);
    this.deletingIds.set(new Set(deletingIds));
    this.cdr.detectChanges();

    this.causesService.deleteCause(causeId).subscribe({
      next: () => {
        // Remove from list
        const currentCauses = this.causes();
        this.causes.set(currentCauses.filter(c => c.id !== causeId));
        
        deletingIds.delete(causeId);
        this.deletingIds.set(new Set(deletingIds));

        this.snackBar.open('Cause deleted successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting cause:', err);
        deletingIds.delete(causeId);
        this.deletingIds.set(new Set(deletingIds));

        this.snackBar.open('Failed to delete cause', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });

        this.cdr.detectChanges();
      },
    });
  }

  getStatusLabel(status: string | undefined): string {
    if (!status) return 'Unknown';
    const statusMap: Record<string, string> = {
      pending_review: 'Pending Review',
      approved: 'Approved',
      in_progress: 'In Progress',
      rejected: 'Rejected',
      completed: 'Completed',
      paused: 'Paused',
      archived: 'Archived',
    };
    return statusMap[status] || status.replace('_', ' ').toUpperCase();
  }
}

// Delete Confirmation Dialog Component
@Component({
  selector: 'app-delete-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './delete-confirm-dialog.component.html',
})
export class DeleteConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { causeTitle: string }
  ) {}
}

