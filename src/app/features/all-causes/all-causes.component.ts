import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CauseCardComponent } from '../../shared/components/cause-card/cause-card.component';
import { CausesService, Cause } from '../../core/causes/causes.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-all-causes',
  standalone: true,
  imports: [CommonModule, CauseCardComponent],
  templateUrl: './all-causes.component.html',
  styleUrls: ['./all-causes.component.scss'],
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

