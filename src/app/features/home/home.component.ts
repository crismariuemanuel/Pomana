import { Component } from '@angular/core';
import { CauseCardComponent } from '../../shared/components/cause-card/cause-card.component';
import { CausesService, Cause } from '../../core/causes/causes.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CauseCardComponent],
  template: `
    <section class="hero">
      <div class="overlay"></div>
      <div class="hero-content container">
        <p class="eyebrow">Fundraise Platform</p>
        <h1>Descoperă cauze și fă o diferență</h1>
        <p class="subtitle">Susține proiecte de impact – educație, sănătate, comunitate.</p>
        <div class="hero-actions">
          <a mat-flat-button color="primary" href="#causes-grid">Vezi cauzele</a>
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
        @for (cause of causes; track cause.id) {
          <app-cause-card [cause]="cause" />
        }
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 16px;
      }

      .hero {
        position: relative;
        background: linear-gradient(120deg, rgba(26, 20, 6, 0.9), rgba(26, 20, 6, 0.7)),
          url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80')
            center/cover no-repeat;
        color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        min-height: 360px;
        display: flex;
        align-items: center;
        margin-bottom: 32px;
      }

      .overlay {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.12), transparent 45%);
        pointer-events: none;
      }

      .hero-content {
        position: relative;
        z-index: 1;
        padding: 56px 0;
        max-width: 700px;
      }

      .eyebrow {
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 700;
        font-size: 0.85rem;
        margin: 0 0 16px 0;
        color: #f7d780;
      }

      h1 {
        margin: 0 0 20px 0;
        font-size: 3.2rem;
        font-weight: 800;
        line-height: 1.15;
        letter-spacing: -0.5px;
      }

      h2 {
        margin: 0;
        font-size: 2.6rem;
        font-weight: 800;
        line-height: 1.2;
        letter-spacing: -0.3px;
        color: #2d2d2d;
      }

      .subtitle {
        margin: 0;
        color: #f1efe6;
        font-size: 1.15rem;
        line-height: 1.7;
      }

      .hero-actions {
        margin-top: 20px;
      }

      .cards-section {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-bottom: 8px;
      }

      .section-header {
        display: block;
        margin-bottom: 32px;
        text-align: left;
        width: 100%;
      }

      .section-header .eyebrow {
        color: #f7d780;
        margin-bottom: 12px;
        text-align: left;
      }

      .section-header h2 {
        text-align: left;
      }

      .section-header .subtitle {
        color: #545454;
        font-size: 1.1rem;
        line-height: 1.8;
        margin-top: 12px;
        text-align: left;
      }

      .grid {
        display: grid;
        gap: 20px;
        grid-template-columns: 1fr;
      }

      @media (min-width: 768px) {
        .grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (min-width: 1024px) {
        .grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
    `,
  ],
})
export class HomeComponent {
  readonly causes: Cause[];

  constructor(private readonly causesService: CausesService) {
    this.causes = this.causesService.getCauses();
  }
}
