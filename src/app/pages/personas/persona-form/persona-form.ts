import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonaService } from '../../../core/services/personaService';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-persona-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './persona-form.html',
  styleUrl: './persona-form.css'
})
export class PersonaForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly srv = inject(PersonaService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  form: FormGroup;
  idEdit: string | null = null;

  constructor() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.idEdit = this.route.snapshot.paramMap.get('id');

    if (this.idEdit) {
      this.srv.getPersonaById(this.idEdit).subscribe({
        next: (p) => { if (p) this.form.patchValue(p); },
        error: (err) => console.error('Error al cargar persona', err)
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;

    if (this.idEdit) {
      this.srv.updatePersona(this.idEdit, this.form.value).subscribe({
        next: () => {
          this.toast.show('Persona actualizada correctamente.', 'success');
          this.router.navigate(['/personas']);
        },
        error: () => this.toast.show('No se pudo actualizar la persona.', 'danger')
      });
    } else {
      this.srv.addPersona(this.form.value).subscribe({
        next: () => {
          this.toast.show('Persona creada correctamente.', 'success');
          this.router.navigate(['/personas']);
        },
        error: () => this.toast.show('No se pudo crear la persona.', 'danger')
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/personas']);
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.controls[field];
    return ctrl.invalid && ctrl.touched;
  }
}
