import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CauseCardComponent } from '../../shared/components/cause-card/cause-card.component';
import { CausesService, Cause } from '../../core/causes/causes.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CauseCardComponent, RouterLink],
  styleUrls: ['./home.component.scss'],
  template: `
    <section class="hero">
      <div class="overlay"></div>
      <div class="hero-content container">
        <p class="eyebrow">Fundraise Platform</p>
        <h1>Descoperă cauze și fă o diferență</h1>
        <p class="subtitle">Susține proiecte de impact – educație, sănătate, comunitate.</p>
        <div class="hero-actions">
          <button class="cta-button" (click)="scrollToCauses()">Vezi cauzele</button>
        </div>
      </div>
    </section>

    <section class="cards-section">
      <div class="section-header container">
        <div>
          <p class="eyebrow">Cauze recomandate</p>
          <h2>Sprijină inițiative reale</h2>
          <p class="subtitle">Alege o cauză și urmărește progresul ei.</p>
        </div>
      </div>

      <div class="grid container" id="causes-grid">
        @for (cause of displayedCauses; track cause.id) {
          <app-cause-card [cause]="cause" />
        }
      </div>
      
      <div class="view-all-container container">
        <a routerLink="/all-causes" class="view-all-button">View All Causes</a>
      </div>
    </section>

    <section class="trust-section">
      <div class="trust-content container">
        <h2 class="trust-title">Lorem Ipsum</h2>
        <p class="trust-text">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        </p>
        <a href="#" class="trust-link">Neque porro quisquam</a>
      </div>
    </section>
  `,
})
export class HomeComponent {
  readonly causes: Cause[];
  readonly displayedCauses: Cause[];

  constructor(private readonly causesService: CausesService) {
    this.causes = this.causesService.getCauses();
    // Display only first 6 causes (2 rows × 3 columns)
    this.displayedCauses = this.causes.slice(0, 6);
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
