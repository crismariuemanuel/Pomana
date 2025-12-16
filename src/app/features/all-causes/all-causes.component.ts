import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CauseCardComponent } from '../../shared/components/cause-card/cause-card.component';
import { CausesService, Cause } from '../../core/causes/causes.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-all-causes',
  standalone: true,
  imports: [CommonModule, CauseCardComponent],
  styleUrls: ['./all-causes.component.scss'],
  template: `
    <div class="all-causes-container">
      <div class="header-section container">
        <h1 class="page-title">All Causes</h1>
        <p class="page-subtitle">Discover and support all available causes</p>
      </div>

      @if (isLoading) {
        <div class="container">Loading causes...</div>
      } @else if (loadError) {
        <div class="container error-text">{{ loadError }}</div>
      } @else {
        <div class="grid container">
          @for (cause of paginatedCauses; track cause.id) {
            <app-cause-card [cause]="cause" />
          }
        </div>

        @if (totalPages > 1) {
        <div class="pagination container">
          <button 
            class="pagination-button" 
            [disabled]="currentPage === 1"
            (click)="goToPage(currentPage - 1)"
          >
            Previous
          </button>
          
          <div class="page-numbers">
            @for (page of totalPagesArray; track page) {
              <button
                class="page-number"
                [class.active]="page === currentPage"
                (click)="goToPage(page)"
              >
                {{ page }}
              </button>
            }
          </div>

          <button 
            class="pagination-button" 
            [disabled]="currentPage === totalPages"
            (click)="goToPage(currentPage + 1)"
          >
            Next
          </button>
        </div>
        }
      }
    </div>
  `,
})
export class AllCausesComponent implements OnInit {
  allCauses: Cause[] = [];
  paginatedCauses: Cause[] = [];
  currentPage = 1;
  itemsPerPage = 15; // 5 rows × 3 columns
  totalPages = 0;
  totalPagesArray: number[] = [];
  isLoading = true;
  loadError = '';

  constructor(
    private readonly causesService: CausesService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadError = '';
    
    this.causesService
      .getCauses()
      .pipe(take(1))
      .subscribe({
        next: (causes) => {
          console.log('Loaded causes:', causes);
          this.allCauses = causes || [];
          this.calculatePagination();
          this.updatePaginatedCauses();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading causes:', err);
          this.loadError = 'Failed to load causes. Please try again.';
          this.isLoading = false;
          this.allCauses = [];
          this.paginatedCauses = [];
          this.cdr.detectChanges();
        },
      });
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.allCauses.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  updatePaginatedCauses(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCauses = this.allCauses.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedCauses();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

