import { BooleanComponent } from '../variables-module/boolean.component';
import { NumberComponent } from '../variables-module/number.component';
import { StringComponent } from '../variables-module/string.component';
import { TableComponent } from '../variables-module/table.component';

export type VariableComponent = NumberComponent | StringComponent | TableComponent | BooleanComponent