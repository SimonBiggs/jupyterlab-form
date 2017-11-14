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
  <ng-container [matColumnDef]="column" *ngFor="let column of columnDefs; let i = index">
    <mat-header-cell *matHeaderCellDef> {{column}} </mat-header-cell>
    <mat-cell *matCellDef="let row; let j = index">
      <span *ngIf="column == variableValue.schema.primaryKey">
        {{row[column]}}
      </span>
      <mat-input-container class="variableNumber" *ngIf="column != variableValue.schema.primaryKey">
        <input
          matInput
          (blur)="onBlur([j, column])"
          (focus)="onFocus([j, column])"
          [disabled]="!isFormReady"
          [(ngModel)]="row[column]"
          (ngModelChange)="variableChanged($event)"
          type="number">
      </mat-input-container>
    </mat-cell>
  </ng-container>

  <mat-header-row *matHeaderRowDef="columnDefs"></mat-header-row>
  <mat-row *matRowDef="let row; columns: columnDefs;"></mat-row>
</mat-table>`,
styles: [
  `.variableNumber {
  width: 80px;
}
`]
})
export class TableComponent extends VariableBaseComponent {
  columnDefs: string[] = []
  oldColumnDefs: string[] = []
  dataSource: MatTableDataSource<{
    [key: string]: string | number 
  }> = new MatTableDataSource();

  variableValue: PandasTable
  oldVariableValue: PandasTable
  isPandas = true
  focus: [number, string] = [null, null];

  updateVariableView(value: PandasTable) {
    let numRowsUnchanged: boolean
    if (this.variableValue) {
      numRowsUnchanged = (
        value.data.length == this.variableValue.data.length
      )
    } else {
      numRowsUnchanged = false
    }
    this.variableValue = value;
    let columns: string[] = []
    value.schema.fields.forEach(val => {
      columns.push(val.name)
    })
    this.oldColumnDefs = this.columnDefs
    this.columnDefs = columns

    const columnsUnchanged = (
      this.oldColumnDefs.length == this.columnDefs.length && 
      this.columnDefs.every(
        (item, index) => { return item === this.oldColumnDefs[index] })
    )

    if (columnsUnchanged && numRowsUnchanged) {
      value.data.forEach((row, i) => {
        const keys = Object.keys(row)
        keys.forEach((key, j) => {
          if ((i !== this.focus[0]) || (key !== this.focus[1])) {
            this.dataSource.data[i][key] = row[key];
          }
        })
      })
    } else {
      this.dataSource.data = value.data;
    }
  }

  variableChanged(value: string | number | PandasTable) {
    this.dataSource.data.forEach((row, i) => {
      const keys = Object.keys(row)
      keys.forEach((key, j) => {
        if (key != this.variableValue.schema.primaryKey) {
          this.variableValue.data[i][key] = row[key];
        }
      })
    })

    if (!this.equals(this.variableValue, this.oldVariableValue)) {
      this.myVariableService.pythonPushVariable(this.variableName, this.variableValue, this.isPandas)
      .then((status) => {
        if (status !== 'ignore') {
          this.variableChange.emit(this.variableName);
        }
      });
      this.oldVariableValue = JSON.parse(JSON.stringify(this.variableValue))
    }
  }


  onBlur(tableCoords: [number, string]) {
    this.focus = [null, null];
  }

  onFocus(tableCoords: [number, string]) {
    this.focus = tableCoords;
  }

  equals( x: any, y: any ) {
    if ( x === y ) return true;
      // if both x and y are null or undefined and exactly the same
  
    if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
      // if they are not strictly equal, they both need to be Objects
  
    if ( x.constructor !== y.constructor ) return false;
      // they must have the exact same prototype chain, the closest we can do is
      // test there constructor.
  
    for ( var p in x ) {
      if ( ! x.hasOwnProperty( p ) ) continue;
        // other properties were tested using x.constructor === y.constructor
  
      if ( ! y.hasOwnProperty( p ) ) return false;
        // allows to compare x[ p ] and y[ p ] when set to undefined
  
      if ( x[ p ] === y[ p ] ) continue;
        // if they have the same strict value or identity then they are equal
  
      if ( typeof( x[ p ] ) !== "object" ) return false;
        // Numbers, Strings, Functions, Booleans must be strictly equal
  
      if ( ! this.equals( x[ p ],  y[ p ] ) ) return false;
        // Objects and Arrays must be tested recursively
    }
  
    for ( p in y ) {
      if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
        // allows x[ p ] to be set to undefined
    }
    return true;
  }
}

