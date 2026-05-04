import { Component, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PersonaModel } from '../../../core/models/persona.model';
import { PersonaService } from '../../../core/services/personaService';

@Component({
  selector: 'app-persona-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './persona-list.html',
  styleUrl: './persona-list.css',
})
export class PersonaList {
  private readonly service = inject(PersonaService);

  personas: Signal<PersonaModel[]> = this.service.getPersonas();
  delete(id: string) {
     if (confirm('Eliminar?')) {
      this.service.deletePersona(id).subscribe(
        () => {});
       }
      }
    }
