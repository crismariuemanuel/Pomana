import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CausesService, Cause, CauseUserUpdate } from '../../core/causes/causes.service';

@Component({
  selector: 'app-edit-cause',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './edit-cause.component.html',
  styleUrl: './edit-cause.component.scss',
})
export class EditCauseComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly causesService = inject(CausesService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly cause = signal<Cause | undefined>(undefined);
  readonly isLoading = signal<boolean>(true);
  readonly isSubmitting = signal<boolean>(false);
  readonly loadError = signal<string>('');
  readonly selectedFileName = signal<string>('');
  readonly imagePreview = signal<string>('');
  readonly imageUrlError = signal<string>('');

  causeForm: FormGroup;

  constructor() {
    this.causeForm = this.fb.group({
      title: ['', [Validators.required]],
      shortDescription: ['', [Validators.required]],
      longDescription: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      target: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (Number.isNaN(id)) {
      this.loadError.set('Invalid cause id');
      this.isLoading.set(false);
      return;
    }
    this.loadCause();
  }

  loadCause(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (Number.isNaN(id)) return;

    this.isLoading.set(true);
    this.loadError.set('');

    this.causesService.getCauseById(id).subscribe({
      next: (cause) => {
        this.cause.set(cause);
        // Pre-populate form
        this.causeForm.patchValue({
          title: cause.title,
          shortDescription: cause.shortDescription,
          longDescription: cause.longDescription,
          imageUrl: cause.imageUrl,
          target: cause.target,
        });
        // Set image preview if image exists
        if (cause.imageUrl) {
          this.imagePreview.set(cause.imageUrl);
        }
        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading cause:', err);
        this.loadError.set(err.error?.detail || err.message || 'Failed to load cause');
        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.imageUrlError.set('Please select a valid image file');
      this.selectedFileName.set('');
      this.imagePreview.set('');
      this.causeForm.patchValue({ imageUrl: '' });
      this.cdr.detectChanges();
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.imageUrlError.set('Image size must be less than 5MB');
      this.selectedFileName.set('');
      this.imagePreview.set('');
      this.causeForm.patchValue({ imageUrl: '' });
      this.cdr.detectChanges();
      return;
    }

    this.imageUrlError.set('');
    this.selectedFileName.set(file.name);

    // Read file as base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      this.imagePreview.set(base64String);
      this.causeForm.patchValue({ imageUrl: base64String });
      this.cdr.detectChanges();
    };
    reader.onerror = () => {
      this.imageUrlError.set('Failed to read image file');
      this.selectedFileName.set('');
      this.imagePreview.set('');
      this.causeForm.patchValue({ imageUrl: '' });
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.causeForm.invalid) {
      this.causeForm.markAllAsTouched();
      return;
    }

    const cause = this.cause();
    if (!cause) return;

    this.isSubmitting.set(true);

    const formValue = this.causeForm.value;
    const update: CauseUserUpdate = {
      title: formValue.title,
      shortDescription: formValue.shortDescription,
      longDescription: formValue.longDescription,
      imageUrl: formValue.imageUrl,
      target: formValue.target,
    };

    // First update the cause
    this.causesService.updateMyCause(cause.id, update).subscribe({
      next: () => {
        // Then resubmit
        this.causesService.resubmitMyCause(cause.id).subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.snackBar.open('Cause updated and resubmitted successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.router.navigate(['/profile']);
          },
          error: (err) => {
            console.error('Error resubmitting cause:', err);
            this.isSubmitting.set(false);
            this.snackBar.open('Failed to resubmit cause', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.cdr.detectChanges();
          },
        });
      },
      error: (err) => {
        console.error('Error updating cause:', err);
        this.isSubmitting.set(false);
        this.snackBar.open('Failed to update cause', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.cdr.detectChanges();
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/profile']);
  }
}

