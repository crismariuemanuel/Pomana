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
  templateUrl: './add-cause.component.html',
  styleUrls: ['./add-cause.component.scss'],
})
export class AddCauseComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly causesService = inject(CausesService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);

  currentSlideIndex = 0;
  private carouselInterval?: number;
  isSubmitting = false;
  submitError = '';

  selectedFileName: string | null = null;
  imagePreview: string | null = null;
  imageUrlError: string | null = null;
  private selectedImageDataUrl: string | null = null;

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

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.imageUrlError = 'Please select a valid image file';
      this.selectedFileName = null;
      this.imagePreview = null;
      this.selectedImageDataUrl = null;
      this.causeForm.patchValue({ imageUrl: '' });
      return;
    }

    // Limit image size e.g. 3MB
    const maxSizeBytes = 3 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      this.imageUrlError = 'Image size must be less than 3MB';
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
      // Store data URL in form so it is sent to backend
      this.causeForm.patchValue({ imageUrl: result });
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (!this.selectedImageDataUrl) {
      this.imageUrlError = 'Please select an image';
      return;
    }

    if (this.causeForm.invalid) {
      this.causeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const formValue = this.causeForm.value;
    this.causesService
      .addCause({
        title: formValue.title,
        shortDescription: formValue.shortDescription,
        longDescription: formValue.longDescription,
        target: Number(formValue.target),
        imageUrl: this.selectedImageDataUrl,
      })
      .subscribe({
        next: () => {
          this.snackBar.open('Cause created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.router.navigate(['/']);
        },
        error: () => {
          this.submitError = 'Failed to create cause. Please try again.';
          this.isSubmitting = false;
          this.cdr.detectChanges();
        },
        complete: () => {
          this.isSubmitting = false;
          this.cdr.detectChanges();
        },
      });
  }
}
