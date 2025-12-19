import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink, NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CauseCardComponent } from '../../shared/components/cause-card/cause-card.component';
import { CausesService, Cause } from '../../core/causes/causes.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CauseCardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  causes: Cause[] = [];
  displayedCauses: Cause[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly causesService: CausesService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCauses();
    
    // Reload causes when navigating back to home page
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.router.url === '/') {
          // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
          setTimeout(() => {
            this.loadCauses();
          }, 0);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCauses(): void {
    this.causesService.getCauses().subscribe({
      next: (causes) => {
        this.causes = causes;
        // Display only first 6 causes (2 rows × 3 columns)
        this.displayedCauses = this.causes.slice(0, 6);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading causes:', err);
        this.displayedCauses = [];
        this.cdr.detectChanges();
      }
    });
  }

  scrollToCauses(): void {
    const element = document.getElementById('causes-grid');
    if (element) {
      const headerOffset = 90; // Height of the header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
