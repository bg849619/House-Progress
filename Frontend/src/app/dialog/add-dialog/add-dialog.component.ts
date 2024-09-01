import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';

export interface addDialogData {
  names: string[];
}

@Component({
  selector: 'app-add-dialog',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatDialogClose,
    MatIconModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    AsyncPipe
  ],
  templateUrl: './add-dialog.component.html',
  styleUrl: './add-dialog.component.scss'
})

export class AddDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AddDialogComponent>);
  readonly data = inject<addDialogData>(MAT_DIALOG_DATA);
  form: FormGroup
  filteredNames: Observable<string[]>;

  constructor(){
    this.form = new FormGroup({
      date: new FormControl(new Date(), Validators.required),
      name: new FormControl('', Validators.required),
      amount: new FormControl('', [Validators.required, Validators.pattern(/^\$?\d+\.\d{2}\$?$/gm)])
    })

    this.filteredNames = this.form.controls['name'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.data.names.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
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
