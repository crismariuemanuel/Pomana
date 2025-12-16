import { Component, signal, OnDestroy, inject, computed } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnDestroy {
  protected readonly title = signal('Fundraise');
  readonly currentYear = new Date().getFullYear();

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private navSub?: Subscription;
  readonly currentRoute = signal<string>('');

  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly isAdmin = this.authService.isAdmin;
  readonly currentUser = this.authService.currentUser;

  constructor() {
    this.navSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentRoute.set(event.url);
        window.scrollTo({ top: 0, behavior: 'auto' });
      });
    // Set initial route
    this.currentRoute.set(this.router.url);
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.navSub) {
      this.navSub.unsubscribe();
    }
  }
}
