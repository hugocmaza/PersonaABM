import { Component, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PersonaModel } from '../../../core/models/persona.model';
import { PersonaService } from '../../../core/services/personaService';
import { ConfirmDialogService } from '../../../shared/confirm-dialog/confirm-dialog.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-persona-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './persona-list.html',
  styleUrl: './persona-list.css',
})
export class PersonaList {
  private readonly service = inject(PersonaService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly toast = inject(ToastService);

  personas: Signal<PersonaModel[]> = this.service.getPersonas();

  async delete(persona: PersonaModel): Promise<void> {
    const confirmed = await this.confirmDialog.open({
      title: 'Eliminar persona',
      message: `¿Seguro que querés eliminar a ${persona.nombre} ${persona.apellido}?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
    });

    if (!confirmed) return;

    this.service.deletePersona(persona.id).subscribe({
      next: () => this.toast.show('Persona eliminada correctamente.', 'success'),
      error: () => this.toast.show('No se pudo eliminar la persona.', 'danger'),
    });
  }
}
