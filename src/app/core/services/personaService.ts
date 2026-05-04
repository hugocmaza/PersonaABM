import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { PersonaModel } from '../models/persona.model';

@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/personas';

   private readonly personasSignal = signal<PersonaModel[]>([]);

   public readonly personas = this.personasSignal.asReadonly();

   constructor() {
    this.loadPersonas();
   }

   getPersonas(): Signal<PersonaModel[]> {
    return this.personas;
  }

  getPersonaById(id: string): Observable<PersonaModel | undefined> {
    return this.http.get<PersonaModel>(`${this.apiUrl}/${id}`).pipe(
      tap(persona => this.upsertPersona(persona))
    );
    }

  addPersona(persona: Omit<PersonaModel, 'id'>): Observable<PersonaModel> {
    return this.http.post<PersonaModel>(this.apiUrl, persona).pipe(
      tap(nueva => this.personasSignal.update(personas => [...personas, nueva]))
    );
  }

  updatePersona(id: string, data: Partial<PersonaModel>): Observable<boolean> {
    return this.http.patch<PersonaModel>(`${this.apiUrl}/${id}`, data).pipe(
      tap(personaActualizada => this.upsertPersona(personaActualizada)),
      map(() => true)
    );
  } deletePersona(id: string): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.personasSignal.update(personas => personas.filter(p => p.id !== id))),
      map(() => true)
    );
  }

  private loadPersonas(): void {
    this.http.get<PersonaModel[]>(this.apiUrl).subscribe({
      next: personas => this.personasSignal.set(personas),
      error: err => console.error('Error al cargar personas', err)
    });
  }

  private upsertPersona(persona: PersonaModel): void {
    this.personasSignal.update(personas => {
      const existe = personas.some(p => p.id === persona.id);
      return existe
        ? personas.map(p => p.id === persona.id ? persona : p)
        : [...personas, persona];
    });
  }
}
