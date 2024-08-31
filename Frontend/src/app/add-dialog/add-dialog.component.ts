import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';

export interface addDialogData {
  names: string[];
}

@Component({
  selector: 'app-add-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIconModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './add-dialog.component.html',
  styleUrl: './add-dialog.component.scss'
})

export class AddDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AddDialogComponent>);
  readonly data = inject<addDialogData>(MAT_DIALOG_DATA);
  form: FormGroup

  constructor(){
    this.form = new FormGroup({
      date: new FormControl(new Date(), Validators.required),
      name: new FormControl('', Validators.required),
      amount: new FormControl('', [Validators.required, Validators.pattern(/^\$?\d+\.\d{2}\$?$/gm)])
    })
  }

  onSubmit(): void {
    if(this.form.invalid){
      console.log(this.form.errors)
      return
    }
    const dateFormatted = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date(this.form.value.date));
  
    this.dialogRef.close({
      date: dateFormatted,
      name: this.form.value.name ?? '',
      amount: Number(this.form.value.amount) ?? -1
    });
  }
}
