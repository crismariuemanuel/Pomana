import { Component, Input, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Cause } from '../../../core/causes/causes.service';

@Component({
  selector: 'app-cause-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatProgressBarModule],
  styleUrls: ['./cause-card.component.scss'],
  template: `
    <mat-card class="cause-card" [class.visible]="isVisible" appearance="outlined" [routerLink]="['/cause', cause.id]">
      <img
        class="cover"
        [src]="cause.imageUrl"
        [alt]="cause.title"
        loading="lazy"
      />

      <mat-card-content>
        <h3 class="title">{{ cause.title }}</h3>
        <p class="subtitle">{{ cause.longDescription }}</p>
      </mat-card-content>

      <div class="progress-section">
        <div class="progress-info">
          <span class="donors-text">{{ getDonorsCount() }} Donors</span>
          <span class="funded-percentage">{{ progress | number:'1.0-0' }}% funded</span>
        </div>
        <mat-progress-bar
          class="bar"
          mode="determinate"
          [value]="progress"
        ></mat-progress-bar>
        <div class="raised-amount">
          {{ cause.raised | currency:'USD':'symbol-narrow':'1.0-0' }} raised
        </div>
      </div>
    </mat-card>
  `,
})
export class CauseCardComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) cause!: Cause;
  isVisible = false;
  private observer?: IntersectionObserver;

  constructor(
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    // Use setTimeout to ensure the element is rendered
    setTimeout(() => {
      if (typeof IntersectionObserver !== 'undefined') {
        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // Add a small delay for animation
                setTimeout(() => {
                  this.isVisible = true;
                  this.cdr.detectChanges();
                }, 50);
              } else {
                // Hide when out of viewport
                this.isVisible = false;
                this.cdr.detectChanges();
              }
            });
          },
          {
            threshold: 0.1,
            rootMargin: '0px 0px 0px 0px',
          }
        );

        // Observe the host element instead of the card
        const hostElement = this.elementRef.nativeElement;
        if (hostElement) {
          this.observer.observe(hostElement);
          
          // Check if already in viewport and trigger animation with delay
          const rect = hostElement.getBoundingClientRect();
          const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
          if (isInViewport) {
            // Add delay based on index to create staggered effect
            const index = Array.from(hostElement.parentElement?.children || []).indexOf(hostElement);
            setTimeout(() => {
              this.isVisible = true;
              this.cdr.detectChanges();
            }, 100 + (index * 100));
          }
        }
      } else {
        // Fallback for browsers without IntersectionObserver
        setTimeout(() => {
          this.isVisible = true;
          this.cdr.detectChanges();
        }, 200);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  get progress(): number {
    if (!this.cause || this.cause.target <= 0) {
      return 0;
    }
    const pct = (this.cause.raised / this.cause.target) * 100;
    return Math.min(100, Math.max(0, pct));
  }

  getDonorsCount(): number {
    // Simulate donor count based on raised amount
    // In a real app, this would come from the cause data
    return Math.floor((this.cause?.raised || 0) / 50) + 1;
  }
}

