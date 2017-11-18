export const sessionStartCode = `
import json

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
%matplotlib inline

from IPython.display import display


def json_table_to_df(json_table):
    table = json.loads(json_table)
    columns = [t['name'] for t in table['schema']['fields']]
    index = table['schema']['primaryKey'][0]

    df = pd.DataFrame(
        table['data'],
        columns=columns)

    df.set_index(index, inplace=True)

    for column in columns:
        if column != index:
            df[column] = df[column].astype('float64')

    return df
`