import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiBaseUrl;

  getCauses(): Observable<Cause[]> {
    return this.http.get<Cause[]>(`${this.apiUrl}/causes`);
  }

  getCauseById(id: number): Observable<Cause> {
    return this.http.get<Cause>(`${this.apiUrl}/causes/${id}`);
  }

  addCause(cause: Omit<Cause, 'id' | 'raised'>): Observable<Cause> {
    return this.http.post<Cause>(`${this.apiUrl}/causes`, cause);
  }
}

