import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, User } from '../../core/auth/auth.service';
import { CausesService, Cause } from '../../core/causes/causes.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly causesService = inject(CausesService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly user = signal<User | undefined>(undefined);
  readonly causes = signal<Cause[]>([]);
  readonly isLoadingUser = signal<boolean>(true);
  readonly isLoadingCauses = signal<boolean>(true);
  readonly loadError = signal<string>('');

  ngOnInit(): void {
    this.loadUser();
    this.loadCauses();
  }

  loadUser(): void {
    this.isLoadingUser.set(true);
    this.authService.getMe().subscribe({
      next: (user) => {
        this.user.set(user);
        this.isLoadingUser.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
        this.isLoadingUser.set(false);
        this.snackBar.open('Failed to load profile', 'Close', {
          duration: 3000,
        });
        this.cdr.detectChanges();
      },
    });
  }

  loadCauses(): void {
    this.isLoadingCauses.set(true);
    this.loadError.set('');

    this.causesService.getMyCauses().subscribe({
      next: (causes) => {
        this.causes.set(causes);
        this.isLoadingCauses.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading causes:', err);
        this.loadError.set('Failed to load causes. Please try again.');
        this.isLoadingCauses.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  getStatusLabel(status: string): string {
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

  canEditCause(cause: Cause): boolean {
    // User can edit all their causes regardless of status
    return true;
  }

  onEdit(cause: Cause): void {
    // Navigate to edit page with cause ID
    this.router.navigate(['/edit-cause', cause.id]);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.snackBar.open('Logged out successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}

