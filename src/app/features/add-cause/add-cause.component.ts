import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CausesService } from '../../core/causes/causes.service';

@Component({
  selector: 'app-add-cause',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  styleUrls: ['./add-cause.component.scss'],
  template: `
    <div class="page-container">
      <div class="carousel-section">
        <div class="carousel-container">
          <div class="carousel-slides">
            @for (image of carouselImages; track image; let i = $index) {
              <div class="carousel-slide" [class.active]="i === currentSlideIndex">
                <img [src]="image" [alt]="'Carousel image ' + (i + 1)" />
              </div>
            }
          </div>
          <div class="carousel-indicators">
            @for (image of carouselImages; track image; let i = $index) {
              <button
                class="indicator"
                [class.active]="i === currentSlideIndex"
                (click)="goToSlide(i)"
                [attr.aria-label]="'Go to slide ' + (i + 1)"
              ></button>
            }
          </div>
        </div>
      </div>

      <div class="form-section">
      <mat-card appearance="outlined" class="form-card">
        <mat-card-header>
          <mat-card-title>Create a New Cause</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="causeForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="Enter cause title" />
              @if (causeForm.get('title')?.hasError('required') && causeForm.get('title')?.touched) {
                <mat-error>Title is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Short Description</mat-label>
              <textarea
                matInput
                formControlName="shortDescription"
                placeholder="Brief description of the cause"
                rows="3"
              ></textarea>
              @if (causeForm.get('shortDescription')?.hasError('required') && causeForm.get('shortDescription')?.touched) {
                <mat-error>Short description is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Long Description</mat-label>
              <textarea
                matInput
                formControlName="longDescription"
                placeholder="Detailed description of the cause"
                rows="6"
              ></textarea>
              @if (causeForm.get('longDescription')?.hasError('required') && causeForm.get('longDescription')?.touched) {
                <mat-error>Long description is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Target Amount</mat-label>
              <input
                matInput
                type="number"
                formControlName="target"
                placeholder="Enter target amount"
                min="1"
              />
              <span matPrefix>$&nbsp;</span>
              @if (causeForm.get('target')?.hasError('required') && causeForm.get('target')?.touched) {
                <mat-error>Target amount is required</mat-error>
              }
              @if (causeForm.get('target')?.hasError('min') && causeForm.get('target')?.touched) {
                <mat-error>Target amount must be greater than 0</mat-error>
              }
            </mat-form-field>

            <div class="file-upload-section">
              <input
                type="file"
                accept="image/*"
                (change)="onFileSelected($event)"
                #fileInput
                class="file-input"
              />
              <div class="file-upload-controls">
                <button
                  mat-raised-button
                  type="button"
                  (click)="fileInput.click()"
                  class="file-button"
                >
                  Choose Image
                </button>
                @if (selectedFileName) {
                  <span class="file-name">{{ selectedFileName }}</span>
                }
              </div>
              @if (imageUrlError) {
                <div class="error-message">{{ imageUrlError }}</div>
              }
              @if (imagePreview) {
                <div class="image-preview">
                  <img [src]="imagePreview" alt="Preview" />
                </div>
              }
            </div>

            <div class="actions">
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="causeForm.invalid"
              >
                Create Cause
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
      </div>
    </div>
  `,
})
export class AddCauseComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly causesService = inject(CausesService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);

  selectedFileName: string | null = null;
  imagePreview: string | null = null;
  imageUrlError: string | null = null;
  private selectedImageDataUrl: string | null = null;

  currentSlideIndex = 0;
  private carouselInterval?: number;

  carouselImages = [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=80',
  ];

  ngOnInit(): void {
    // Initialize
  }

  ngAfterViewInit(): void {
    this.startCarousel();
  }

  ngOnDestroy(): void {
    this.stopCarousel();
  }

  startCarousel(): void {
    this.stopCarousel(); // Clear any existing interval
    this.carouselInterval = window.setInterval(() => {
      this.nextSlide();
    }, 3000); // 3 seconds
  }

  stopCarousel(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = undefined;
    }
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.carouselImages.length;
    this.cdr.detectChanges();
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
    this.cdr.detectChanges();
    this.stopCarousel();
    this.startCarousel();
  }

  readonly causeForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    shortDescription: ['', [Validators.required]],
    longDescription: ['', [Validators.required]],
    target: [0, [Validators.required, Validators.min(1)]],
    imageUrl: ['', [Validators.required]],
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        this.imageUrlError = 'Please select a valid image file';
        this.selectedFileName = null;
        this.imagePreview = null;
        this.selectedImageDataUrl = null;
        this.causeForm.patchValue({ imageUrl: '' });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.imageUrlError = 'Image size must be less than 5MB';
        this.selectedFileName = null;
        this.imagePreview = null;
        this.selectedImageDataUrl = null;
        this.causeForm.patchValue({ imageUrl: '' });
        return;
      }

      this.selectedFileName = file.name;
      this.imageUrlError = null;

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        this.selectedImageDataUrl = result;
        this.imagePreview = result;
        this.causeForm.patchValue({ imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (!this.selectedImageDataUrl) {
      this.imageUrlError = 'Please select an image';
      return;
    }

    if (this.causeForm.valid) {
      const formValue = this.causeForm.value;
      this.causesService.addCause({
        title: formValue.title,
        shortDescription: formValue.shortDescription,
        longDescription: formValue.longDescription,
        target: Number(formValue.target),
        imageUrl: this.selectedImageDataUrl,
      });

      this.snackBar.open('Cause created successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });

      this.router.navigate(['/']);
    }
  }
}
