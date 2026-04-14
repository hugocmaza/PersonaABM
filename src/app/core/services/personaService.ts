import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
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

   private readonly personasSubject = new BehaviorSubject<PersonaModel[]>(this.basePersonas);

   public personas$ = this.personasSubject.asObservable();

   getPersonas(): Observable<PersonaModel[]> {
    return this.personas$.pipe(delay(300));
  }

  getPersonaById(id: string): Observable<PersonaModel | undefined> {
    const persona = this.personasSubject.getValue().find(p => p.id === id);
     return of(persona).pipe(delay(300));
    }
  addPersona(persona: Omit<PersonaModel, 'id'>): Observable<PersonaModel> {
    const nueva = { ...persona, id: Math.random().toString(36).substr(2, 9)};
    this.personasSubject.next([...this.personasSubject.getValue(), nueva]);
    return of(nueva).pipe(delay(300));
  }

  updatePersona(id: string, data: Partial<PersonaModel>): Observable<boolean> {
    const arr = this.personasSubject.getValue().map(p => p.id === id ? { ...p, ...data } : p);
   this.personasSubject.next(arr); return of(true).pipe(delay(300));
  } deletePersona(id: string): Observable<boolean> {
    const arr = this.personasSubject.getValue().filter(p => p.id !== id);
    this.personasSubject.next(arr); return of(true).pipe(delay(300));
  }

}
