import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { Cause, CausesService, TimelineEvent } from '../../core/causes/causes.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-cause-details',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatButtonModule, 
    MatDialogModule, 
    MatProgressBarModule, 
    MatSnackBarModule, 
    MatTooltipModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
  ],
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
  readonly timeline = signal<TimelineEvent[]>([]);
  readonly isLoadingTimeline = signal<boolean>(false);
  readonly progress = computed(() => {
    const c = this.cause();
    if (!c || c.target <= 0) return 0;
    return Math.min(100, Math.max(0, (c.raised / c.target) * 100));
  });
  readonly isLoggedIn = computed(() => this.authService.isLoggedIn());
  readonly isOwner = computed(() => {
    const cause = this.cause();
    const user = this.authService.getCurrentUser();
    if (!cause || !user) return false;
    return cause.owner_user_id === user.id || cause.created_by_user_id === user.id;
  });
  readonly showOwnerInfo = computed(() => {
    const cause = this.cause();
    const isOwner = this.isOwner();
    if (!cause || !isOwner) return false;
    return cause.status === 'pending_review' || cause.status === 'rejected';
  });

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
          // Load timeline after cause is loaded
          this.loadTimeline(id);
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

  loadTimeline(causeId: number): void {
    this.isLoadingTimeline.set(true);
    this.causesService.getCauseTimeline(causeId).subscribe({
      next: (events) => {
        this.timeline.set(events);
        this.isLoadingTimeline.set(false);
      },
      error: (err) => {
        console.error('Error loading timeline:', err);
        this.isLoadingTimeline.set(false);
        // Don't show error to user, timeline is optional
      },
    });
  }

  getEventIcon(eventType: string): string {
    switch (eventType) {
      case 'CREATED':
        return '✨';
      case 'SUBMITTED':
      case 'SUBMITTED_FOR_REVIEW':
        return '📝';
      case 'APPROVED':
        return '✔️';
      case 'REJECTED':
        return '❌';
      case 'STATUS_CHANGED':
        return '🔄';
      case 'UPDATE':
        return '📢';
      case 'FUNDS_ALLOCATED':
        return '💰';
      case 'FUNDS_DISTRIBUTED':
        return '📤';
      case 'PROGRESS_REPORT':
        return '📊';
      default:
        return '📌';
    }
  }

  getEventTitle(eventType: string): string {
    switch (eventType) {
      case 'CREATED':
        return 'Created';
      case 'SUBMITTED':
      case 'SUBMITTED_FOR_REVIEW':
        return 'Submitted for Review';
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'STATUS_CHANGED':
        return 'Status Changed';
      case 'UPDATE':
        return 'Update';
      case 'FUNDS_ALLOCATED':
        return 'Funds Allocated';
      case 'FUNDS_DISTRIBUTED':
        return 'Funds Distributed';
      case 'PROGRESS_REPORT':
        return 'Progress Report';
      default:
        return eventType.replace(/_/g, ' ').toLowerCase().split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
  templateUrl: './coming-soon-dialog.component.html',
})
export class ComingSoonDialogComponent {}

