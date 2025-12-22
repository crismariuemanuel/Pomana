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
  status?: string;
  phase?: string | null;
  is_public?: boolean;
  owner_user_id?: number;
  owner_email?: string | null; // Owner's email
  owner_full_name?: string | null; // Owner's full name
  created_by_user_id?: number; // Keep for backward compatibility
  review_notes?: string | null;
}

export interface TimelineEvent {
  event_type: string;
  message: string;
  created_at: string;
  created_by_user_id: number | null;
  metadata_json?: Record<string, any> | null;
}

export interface CauseAdminUpdate {
  status?: string;
  phase?: string | null;
  review_notes?: string | null;
}

export interface TimelineEventCreate {
  event_type: string;
  message: string;
  metadata_json?: Record<string, any> | null;
}

export interface CauseUserUpdate {
  title?: string;
  shortDescription?: string;
  longDescription?: string;
  imageUrl?: string;
  target?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CausesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiBaseUrl;

  getCauses(): Observable<Cause[]> {
    // GET /causes returns only public causes (is_public=true)
    return this.http.get<Cause[]>(`${this.apiUrl}/causes`);
  }

  getPublicCauses(): Observable<Cause[]> {
    // Alias for getCauses() for clarity
    return this.getCauses();
  }

  getCauseById(id: number): Observable<Cause> {
    return this.http.get<Cause>(`${this.apiUrl}/causes/${id}`);
  }

  addCause(cause: Omit<Cause, 'id' | 'raised'>): Observable<Cause> {
    return this.http.post<Cause>(`${this.apiUrl}/causes`, cause);
  }

  // Admin endpoints
  getAllCauses(status?: string): Observable<Cause[]> {
    const url = status 
      ? `${this.apiUrl}/admin/causes?status=${status}`
      : `${this.apiUrl}/admin/causes`;
    return this.http.get<Cause[]>(url);
  }

  approveCause(id: number): Observable<Cause> {
    return this.http.post<Cause>(`${this.apiUrl}/admin/causes/${id}/approve`, {});
  }

  rejectCause(id: number, reviewNotes: string): Observable<Cause> {
    return this.http.post<Cause>(`${this.apiUrl}/admin/causes/${id}/reject`, {
      review_notes: reviewNotes,
    });
  }

  updateCauseAdmin(id: number, update: CauseAdminUpdate): Observable<Cause> {
    return this.http.patch<Cause>(`${this.apiUrl}/admin/causes/${id}`, update);
  }

  addTimelineEvent(id: number, event: TimelineEventCreate): Observable<TimelineEvent> {
    return this.http.post<TimelineEvent>(`${this.apiUrl}/admin/causes/${id}/timeline`, event);
  }

  getCauseTimeline(id: number): Observable<TimelineEvent[]> {
    return this.http.get<TimelineEvent[]>(`${this.apiUrl}/causes/${id}/timeline`);
  }

  // User endpoints
  getMyCauses(): Observable<Cause[]> {
    return this.http.get<Cause[]>(`${this.apiUrl}/me/causes`);
  }

  updateMyCause(id: number, update: CauseUserUpdate): Observable<Cause> {
    return this.http.patch<Cause>(`${this.apiUrl}/me/causes/${id}`, update);
  }

  resubmitMyCause(id: number): Observable<Cause> {
    return this.http.post<Cause>(`${this.apiUrl}/me/causes/${id}/submit`, {});
  }

  // Admin delete endpoint
  deleteCause(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/causes/${id}`);
  }
}

