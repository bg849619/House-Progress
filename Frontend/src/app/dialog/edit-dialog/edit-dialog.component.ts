import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { distinctUntilChanged } from 'rxjs';

export interface editDialogData {
  gamblingData: any[];
  names: string[];
}

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogClose,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule
  ],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss'
})

export class EditDialogComponent {
  readonly dialogRef = inject(MatDialogRef<EditDialogComponent>);
  readonly data = inject<editDialogData>(MAT_DIALOG_DATA);
  form: FormGroup

  constructor() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.min(-500)]),
      date: new FormControl(new Date(), [Validators.required])
    })

    this.form.controls['name'].valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe((name) => {
      const foundAmount = this.findAmount(name, this.form.value.date)
      if (foundAmount) {
        this.form.controls['amount'].setValue(foundAmount)
      } else {
        this.form.controls['amount'].setValue('NA')
      }
    })

    this.form.controls['date'].valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe((date) => {
      const foundAmount = this.findAmount(this.form.value.name, date);
      if (foundAmount) {
        this.form.controls['amount'].setValue(foundAmount);
      } else {
        this.form.controls['amount'].setValue('NA');
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
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

  findAmount(targetName: string = '', targetDate: Date = new Date()): string {
    if (this.form.controls['name'].invalid || this.form.controls['date'].invalid) {
      return ''
    }

    const dateFormatted = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date(targetDate));

    for (const dataPoint of this.data.gamblingData) {
      if (dataPoint.date === dateFormatted && dataPoint[targetName]) {
        return dataPoint[targetName]
      }
    }

    return ""
  }

}
