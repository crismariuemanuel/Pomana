import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CauseCardComponent } from '../../shared/components/cause-card/cause-card.component';
import { CausesService, Cause } from '../../core/causes/causes.service';

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

      <div class="grid container">
        @for (cause of paginatedCauses; track cause.id) {
          <app-cause-card [cause]="cause" />
        }
      </div>

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

  constructor(private readonly causesService: CausesService) {}

  ngOnInit(): void {
    this.allCauses = this.causesService.getCauses();
    this.calculatePagination();
    this.updatePaginatedCauses();
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

