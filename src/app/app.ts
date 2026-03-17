import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Empleado, EmpleadosService } from './empleados.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  empleados: Empleado[] = [];
  cargando = false;
  mensajeError = '';

  protected readonly form;

  constructor(
    private readonly empleadosService: EmpleadosService,
    private readonly formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.nonNullable.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      direccion: ['', [Validators.required, Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  crearEmpleado(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.mensajeError = '';
    this.empleadosService.crear(this.form.getRawValue()).subscribe({
      next: () => {
        this.form.reset({ nombre: '', direccion: '', telefono: '', correo: '' });
        this.cargarEmpleados();
      },
      error: (error) => {
        const apiMessage = error?.error?.message;
        this.mensajeError = apiMessage ?? 'No se pudo crear el empleado';
      }
    });
  }

  cargarEmpleados(): void {
    this.cargando = true;
    this.mensajeError = '';
    this.empleadosService.listar().subscribe({
      next: (response) => {
        this.empleados = response.content;
        this.cargando = false;
      },
      error: (error) => {
        const apiMessage = error?.error?.message;
        this.mensajeError = apiMessage ?? 'No se pudieron cargar los empleados';
        this.cargando = false;
      }
    });
  }
}
