import { Component, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PersonaModel } from '../../../core/models/persona.model';
import { PersonaService } from '../../../core/services/personaService';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-persona-list',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './persona-list.html',
  styleUrl: './persona-list.css',
})
export class PersonaList {
  private readonly service = inject(PersonaService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  personas: Signal<PersonaModel[]> = this.service.getPersonas();
  displayedColumns = ['nombreCompleto', 'email', 'fechaNacimiento', 'acciones'];

  delete(persona: PersonaModel) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Eliminar persona',
        message: `¿Seguro que queres eliminar a ${persona.nombre} ${persona.apellido}?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (!confirmado) return;

      this.service.deletePersona(persona.id).subscribe({
        next: () => this.snackBar.open('Persona eliminada correctamente.', 'Cerrar', { duration: 3000 }),
        error: () => this.snackBar.open('No se pudo eliminar la persona.', 'Cerrar', { duration: 4000 })
      });
    });
  }
    }
