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
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
      raised: 12400,
      target: 25000,
    },
    {
      id: 2,
      title: 'Medical aid for rural clinic',
      shortDescription: 'Equipment and medicine for a remote community.',
      longDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
      raised: 8200,
      target: 15000,
    },
    {
      id: 3,
      title: 'Clean water for 3 villages',
      shortDescription: 'Build wells and provide filtration kits.',
      longDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
      raised: 19350,
      target: 20000,
    },
    {
      id: 4,
      title: 'Food baskets for winter',
      shortDescription: 'Monthly baskets for 200 families.',
      longDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
      raised: 5400,
      target: 12000,
    },
    {
      id: 5,
      title: 'STEM kits for girls',
      shortDescription: 'Hands-on STEM kits and mentoring.',
      longDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
      raised: 9600,
      target: 18000,
    },
    {
      id: 6,
      title: 'Emergency shelter support',
      shortDescription: 'Temporary housing supplies and bedding.',
      longDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
      raised: 4200,
      target: 14000,
    },
    {
      id: 7,
      title: 'Education for underprivileged children',
      shortDescription: 'Scholarships and learning materials.',
      longDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
      raised: 15000,
      target: 30000,
    },
    {
      id: 8,
      title: 'Healthcare access for remote areas',
      shortDescription: 'Mobile clinics and medical supplies.',
      longDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
      raised: 11200,
      target: 25000,
    },
    {
      id: 9,
      title: 'Community garden initiative',
      shortDescription: 'Sustainable food production for families.',
      longDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
      raised: 6800,
      target: 15000,
    },
    {
      id: 10,
      title: 'Youth sports program',
      shortDescription: 'Equipment and coaching for young athletes.',
      longDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
      raised: 8900,
      target: 20000,
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

