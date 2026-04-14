import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PersonaModel } from '../../../core/models/persona.model';
import { Observable } from 'rxjs/internal/Observable';
import { PersonaService } from '../../../core/services/personaService';

@Component({
  selector: 'app-persona-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './persona-list.html',
  styleUrl: './persona-list.css',
})
export class PersonaList implements OnInit {
  personas$!: Observable<PersonaModel[]>;

  constructor(private readonly service: PersonaService) {}

  ngOnInit() {
    this.personas$ = this.service.getPersonas();

  }
  delete(id: string) {
     if (confirm('Eliminar?')) {
      this.service.deletePersona(id).subscribe(
        () => { this.personas$ = this.service.getPersonas(); });
       }
      }
    }
