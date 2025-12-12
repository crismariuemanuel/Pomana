import { Injectable, computed, signal } from '@angular/core';

export interface Cause {
  id: number;
  title: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  raised: number;
  target: number;
}

@Injectable({
  providedIn: 'root',
})
export class CausesService {
  private readonly causesSignal = signal<Cause[]>([
    {
      id: 1,
      title: 'Help a school rebuild classrooms',
      shortDescription: 'Support rebuilding after recent floods.',
      longDescription:
        'Funds will be used to reconstruct three classrooms and provide study materials for 120 students.',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
      raised: 12400,
      target: 25000,
    },
    {
      id: 2,
      title: 'Medical aid for rural clinic',
      shortDescription: 'Equipment and medicine for a remote community.',
      longDescription:
        'We need to purchase basic equipment, medicine, and a solar-powered fridge for vaccines.',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
      raised: 8200,
      target: 15000,
    },
    {
      id: 3,
      title: 'Clean water for 3 villages',
      shortDescription: 'Build wells and provide filtration kits.',
      longDescription:
        'Your support will fund well construction, water testing, and training for maintenance teams.',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
      raised: 19350,
      target: 20000,
    },
    {
      id: 4,
      title: 'Food baskets for winter',
      shortDescription: 'Monthly baskets for 200 families.',
      longDescription:
        'Each basket includes essentials for a family of four. Distribution runs for three months.',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
      raised: 5400,
      target: 12000,
    },
    {
      id: 5,
      title: 'STEM kits for girls',
      shortDescription: 'Hands-on STEM kits and mentoring.',
      longDescription:
        'We will deliver 300 STEM kits and run workshops with volunteer mentors in underserved areas.',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
      raised: 9600,
      target: 18000,
    },
    {
      id: 6,
      title: 'Emergency shelter support',
      shortDescription: 'Temporary housing supplies and bedding.',
      longDescription:
        'Funds provide mattresses, blankets, hygiene kits, and temporary partitions for a community shelter.',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
      raised: 4200,
      target: 14000,
    },
  ]);

  readonly causes = computed(() => this.causesSignal());

  getCauses(): Cause[] {
    return this.causes();
  }

  getCauseById(id: number): Cause | undefined {
    return this.causes().find((c) => c.id === id);
  }

  addCause(cause: Omit<Cause, 'id' | 'raised'>): void {
    const currentCauses = this.causesSignal();
    const newId = Math.max(...currentCauses.map((c) => c.id), 0) + 1;
    const newCause: Cause = {
      ...cause,
      id: newId,
      raised: 0,
    };
    this.causesSignal.set([...currentCauses, newCause]);
  }
}

