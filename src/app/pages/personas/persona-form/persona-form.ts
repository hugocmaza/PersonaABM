import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PersonaService } from '../../../core/services/personaService';

@Component({
  selector: 'app-persona-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './persona-form.html',
  styleUrl: './persona-form.css'
})
export class PersonaForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly srv = inject(PersonaService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  form: FormGroup;
  idEdit: string | null = null;

  constructor() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      edad: [null, [Validators.required, Validators.min(0), Validators.max(120)]]
    });
  }

  ngOnInit(): void {
    this.idEdit = this.route.snapshot.paramMap.get('id');

    if (this.idEdit) {
      this.srv.getPersonaById(this.idEdit).subscribe({
        next: (p) => {
          if (p) this.form.patchValue(p);
        },
        error: (err) => console.error('Error al cargar persona', err)
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;

    const personaData = this.form.value;

    if (this.idEdit) {
      this.srv.updatePersona(this.idEdit, personaData).subscribe({
        next: () => {
          this.snackBar.open('Persona actualizada correctamente.', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/personas']);
        },
        error: () => this.snackBar.open('No se pudo actualizar la persona.', 'Cerrar', { duration: 4000 })
      });
    } else {
      this.srv.addPersona(personaData).subscribe({
        next: () => {
          this.snackBar.open('Persona creada correctamente.', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/personas']);
        },
        error: () => this.snackBar.open('No se pudo crear la persona.', 'Cerrar', { duration: 4000 })
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/personas']);
  }
}
