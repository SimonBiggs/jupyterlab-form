
export interface PandasTable {
  schema: {
    fields: {
      name: string
      type: string
    }[]
    primaryKey: string
    pandas_version: string
  }
  data: { [key: string]: string | number }[]
}