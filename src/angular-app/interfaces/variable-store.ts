import { VariableValue } from '../types/variable-value'

export interface VariableStore {
  [key: string]: { 
    defined: boolean,
    value?: VariableValue
  }
}