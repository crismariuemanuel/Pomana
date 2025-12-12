import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Cause, CausesService } from '../../core/causes/causes.service';

@Component({
  selector: 'app-cause-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatDialogModule, MatProgressBarModule],
  templateUrl: './cause-details.component.html',
  styleUrl: './cause-details.component.scss',
})
export class CauseDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly causesService = inject(CausesService);
  private readonly dialog = inject(MatDialog);

  readonly cause = signal<Cause | undefined>(undefined);
  readonly progress = computed(() => {
    const c = this.cause();
    if (!c || c.target <= 0) return 0;
    return Math.min(100, Math.max(0, (c.raised / c.target) * 100));
  });

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (!Number.isNaN(id)) {
      this.cause.set(this.causesService.getCauseById(id));
    }
  }

  openComingSoon(): void {
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

