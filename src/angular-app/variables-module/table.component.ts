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
  <ng-container matColumnDef="0">
    <mat-header-cell *matHeaderCellDef> 0 </mat-header-cell>
    <mat-cell *matCellDef="let element">{{element[0]}}</mat-cell>
  </ng-container>

  <ng-container matColumnDef="1">
    <mat-header-cell *matHeaderCellDef> 1 </mat-header-cell>
    <mat-cell *matCellDef="let element">{{element[1]}}</mat-cell>
  </ng-container>

  <ng-container matColumnDef="2">
    <mat-header-cell *matHeaderCellDef> 2 </mat-header-cell>
    <mat-cell *matCellDef="let element">{{element[2]}}</mat-cell>
  </ng-container>

  <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
  <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
</mat-table>`,
})
export class TableComponent extends VariableBaseComponent {
  displayedColumns = ['0', '1', '2']
  dataSource: MatTableDataSource<{}>
  variableValue: {}[]

  pullTable() {
    this.pullVariable(true)
  }

  updateVariableView(value: {}[]) {
    this.variableValue = value;
    this.dataSource = new MatTableDataSource(value);
  }
}