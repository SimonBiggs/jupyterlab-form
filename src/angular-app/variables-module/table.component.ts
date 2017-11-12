import {
  Component
} from '@angular/core';

import {
  MatTableDataSource
} from '@angular/material';

import { VariableBaseComponent } from './variable-base.component';

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
      <mat-input-container>
        <input
          matInput
          (blur)="onBlur([i, j])" 
          (focus)="onFocus([i, j])"
          [disabled]="!isFormReady"
          value="{{row[column]}}">
      </mat-input-container>
    </mat-cell>
  </ng-container>

  <mat-header-row *matHeaderRowDef="dynamicColumnDefs"></mat-header-row>
  <mat-row *matRowDef="let row; columns: dynamicColumnDefs;"></mat-row>
</mat-table>`,
})
export class TableComponent extends VariableBaseComponent {
  dynamicColumnDefs: string[]
  dataSource: MatTableDataSource<{}>
  variableValue: { [key: string]: any }[]
  isPandas = true

  updateVariableView(value: {}[]) {
    this.variableValue = value;
    this.dynamicColumnDefs = Object.keys(this.variableValue[0])
    this.dataSource = new MatTableDataSource(value);
  }
}