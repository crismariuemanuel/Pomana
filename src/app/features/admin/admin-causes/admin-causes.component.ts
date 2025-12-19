import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CausesService, Cause } from '../../../core/causes/causes.service';

interface CauseRow {
  id: number;
  title: string;
  createdBy: string;
  createdAt: string;
  status: string;
}

@Component({
  selector: 'app-admin-causes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './admin-causes.component.html',
  styleUrl: './admin-causes.component.scss',
})
export class AdminCausesComponent implements OnInit {
  private readonly causesService = inject(CausesService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly cdr = inject(ChangeDetectorRef);

  pendingCauses: CauseRow[] = [];
  isLoading = false;
  loadError = '';
  processingIds = new Set<number>();
  displayedColumns: string[] = ['title', 'createdBy', 'createdAt', 'status', 'actions'];

  ngOnInit(): void {
    this.loadCauses();
  }

  loadCauses(): void {
    this.isLoading = true;
    this.loadError = '';
    
    this.causesService.getAllCauses().subscribe({
      next: (causes) => {
        // Filter only PENDING_REVIEW causes
        const pending = causes.filter(c => c.status === 'PENDING_REVIEW');
        
        // Transform to table rows
        this.pendingCauses = pending.map(cause => ({
          id: cause.id,
          title: cause.title,
          createdBy: `User #${cause.created_by_user_id || 'N/A'}`,
          createdAt: new Date().toLocaleDateString(), // TODO: Get actual date from backend
          status: cause.status || 'PENDING_REVIEW',
        }));
        
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

  onApprove(causeId: number): void {
    this.processingIds.add(causeId);
    this.cdr.detectChanges();

    this.causesService.approveCause(causeId).subscribe({
      next: () => {
        // Remove from list
        this.pendingCauses = this.pendingCauses.filter(c => c.id !== causeId);
        this.processingIds.delete(causeId);
        
        this.snackBar.open('Cause approved', 'Close', {
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
    const dialogRef = this.dialog.open(ConfirmRejectDialogComponent, {
      width: '400px',
      data: { causeId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.confirmed && result.reviewNotes) {
        this.processingIds.add(causeId);
        this.cdr.detectChanges();

        this.causesService.rejectCause(causeId, result.reviewNotes).subscribe({
          next: () => {
            // Remove from list
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

// Confirmation Dialog Component
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirm-reject-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './confirm-reject-dialog.component.html',
  styleUrl: './confirm-reject-dialog.component.scss',
})
export class ConfirmRejectDialogComponent {
  reviewNotes = '';
}

