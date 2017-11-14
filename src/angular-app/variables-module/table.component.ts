import {
  Component
} from '@angular/core';

import {
  MatTableDataSource
} from '@angular/material';

import { VariableBaseComponent } from './variable-base.component';
import { PandasTable } from '../interfaces/pandas-table'

@Component({
  selector: 'app-table',
  template: `
<span #variablecontainer *ngIf="variableName === undefined">
  <ng-content></ng-content>
</span>

<mat-table #table [dataSource]="dataSource" *ngIf="variableValue">
  <ng-container [matColumnDef]="column" *ngFor="let column of dynamicColumnDefs; let i = index">
    <mat-header-cell *matHeaderCellDef> {{column}} </mat-header-cell>
    <mat-cell *matCellDef="let row; let j = index">
      <span *ngIf="column == variableValue.schema.primaryKey">
        {{row[column]}}
      </span>
      <mat-input-container class="variableNumber" *ngIf="column != variableValue.schema.primaryKey">
        <input
          matInput
          (blur)="onBlur(row, column)"
          (focus)="onFocus(row, column)"
          [disabled]="!isFormReady"
          [(ngModel)]="row[column]"
          (ngModelChange)="variableChanged($event)"
          type="number">
      </mat-input-container>
    </mat-cell>
  </ng-container>

  <mat-header-row *matHeaderRowDef="dynamicColumnDefs"></mat-header-row>
  <mat-row *matRowDef="let row; columns: dynamicColumnDefs;"></mat-row>
</mat-table>`,
styles: [
  `.variableNumber {
  width: 80px;
}
`]
})
export class TableComponent extends VariableBaseComponent {
  dynamicColumnDefs: string[]
  dataSource = new MatTableDataSource();
  variableValue: PandasTable
  isPandas = true
  focus: [number, string] = [null, null];

  updateVariableView(value: PandasTable) {
    this.variableValue = value;
    let columns: string[] = []
    this.variableValue.schema.fields.forEach(val => {
      columns.push(val.name)
    })
    this.dynamicColumnDefs = columns
    this.dataSource.data = value.data;
  }

  variableChanged(value: PandasTable) {
    super.variableChanged(value);
  }

  onBlur(tableCoords: [number, string]) {
    this.focus = [null, null];
  }

  onFocus(tableCoords: [number, string]) {
    this.focus = tableCoords;
  }
}

