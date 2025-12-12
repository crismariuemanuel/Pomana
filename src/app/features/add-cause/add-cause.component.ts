import { Component, inject } from '@angular/core';
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
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="form-container">
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
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .form-container {
        display: flex;
        justify-content: center;
        padding: 24px 16px;
      }

      .form-card {
        max-width: 650px;
        width: 100%;
        background: linear-gradient(180deg, #f9f5ec 0%, #f6f1e7 100%);
        border: 1px solid #dcd2c4;
      }

      mat-card-header {
        margin-bottom: 24px;
      }

      mat-card-title {
        font-size: 1.8rem;
        font-weight: 800;
        color: #2d2d2d;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .full-width {
        width: 100%;
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 8px;
        padding-top: 16px;
      }

      button[mat-raised-button] {
        min-width: 160px;
        font-size: 1rem;
        padding: 10px 24px;
      }

      .file-upload-section {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .file-input {
        display: none;
      }

      .file-upload-controls {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .file-button {
        min-width: 140px;
      }

      .file-name {
        color: #545454;
        font-size: 0.9rem;
      }

      .error-message {
        color: #d32f2f;
        font-size: 0.75rem;
        margin-top: -8px;
      }

      .image-preview {
        width: 100%;
        max-height: 300px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #dcd2c4;
        background: #ffffff;
      }

      .image-preview img {
        width: 100%;
        height: auto;
        object-fit: cover;
        display: block;
      }
    `,
  ],
})
export class AddCauseComponent {
  private readonly fb = inject(FormBuilder);
  private readonly causesService = inject(CausesService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  selectedFileName: string | null = null;
  imagePreview: string | null = null;
  imageUrlError: string | null = null;
  private selectedImageDataUrl: string | null = null;

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
