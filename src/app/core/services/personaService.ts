import { Injectable, Signal, signal } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { delay } from 'rxjs/internal/operators/delay';
import { PersonaModel } from '../models/persona.model';

@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  private readonly basePersonas: PersonaModel[] = [
    { id: '1', nombre: 'Juan', apellido: 'Perez', email: 'juan@ex.com', edad: 30 }
   ];

   private readonly personasSignal = signal<PersonaModel[]>(this.basePersonas);

   public readonly personas = this.personasSignal.asReadonly();

   getPersonas(): Signal<PersonaModel[]> {
    return this.personas;
  }

  getPersonaById(id: string): Observable<PersonaModel | undefined> {
    const persona = this.personas().find(p => p.id === id);
     return of(persona).pipe(delay(300));
    }
  addPersona(persona: Omit<PersonaModel, 'id'>): Observable<PersonaModel> {
    const nueva = { ...persona, id: Math.random().toString(36).substr(2, 9)};
    this.personasSignal.update(personas => [...personas, nueva]);
    return of(nueva).pipe(delay(300));
  }

  updatePersona(id: string, data: Partial<PersonaModel>): Observable<boolean> {
    this.personasSignal.update(personas => personas.map(p => p.id === id ? { ...p, ...data } : p));
   return of(true).pipe(delay(300));
  } deletePersona(id: string): Observable<boolean> {
    this.personasSignal.update(personas => personas.filter(p => p.id !== id));
    return of(true).pipe(delay(300));
  }

}
