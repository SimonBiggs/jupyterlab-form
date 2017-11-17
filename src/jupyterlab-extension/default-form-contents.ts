/*
A default markdown form.
*/

export const defaultFormContents = `# A Demo Form

## Description

This is an example form for use as a template or demonstrating
form creation.

This file format is based upon markdown. There are however a few
extra elements which are explained below.

## Sections and variable inputs

There are four kinds of sections:

 * \`start\`,
 * \`live\`,
 * \`button\`,
 * and \`output\`.

Code which is written inside of these defined sections is run
as python code according to specific rules.

Within the form variable inputs can be included.
There are three kinds of variable inputs:

 * \`number\`,
 * \`string\`,
 * and \`table\`.

These are attached to a specific python variable which update on
user input. Number and string variables can be assigned as a standard
python variable type. Table variables on the other hand must be a pandas 
dataframe and all of the values within the pandas dataframe are forced to be
of the type float64.

### Start sections

A \`start\` section is defined as following:

[start]
\`\`\`
data = np.ones(3) * np.nan
data[0] = 5

table = pd.DataFrame(
  columns=['Meas1', 'Meas2', 'Meas3', 'Avg'],
  index=['6MV', '10MV'],
  data=[[1,np.nan,np.nan,np.nan],[4,5,np.nan,np.nan]])
\`\`\`
[/start]

Whenever a jupyterlab services session is started
code within the start sections is run first.

If you reopen or update the form template without restarting the kernel
this code will not re-run.

As can be seen from this code there are already a few namespaces included by
default within the Python session. Some of these are for convenience, some are
required for the proper running of the form. The code that is run at boot of 
a new form kernel can be found within the 
[source code](https://github.com/SimonBiggs/jupyterlab-form/blob/master/src/angular-app/services/session-start-code.ts).

### Live sections

A \`live\` section is made as following:

[live]
[number]data[0][/number]
[number]data[1][/number]
[number]data[2][/number]
\`plt.plot(data, 'o');\`
[/live]

It is designed to contain both code and variable inputs. Whenever
the user changes any variable within the live section all code within
that live section is subsequently run.

A neat use case for a live section is a table that live updates as users fill
in the table contents:

[live]
[table]table[/table]
\`\`\`
table.iloc[:,3] = np.nanmean(table.iloc[:,0:3], axis=1)
\`\`\`
[/live]

### Button sections

Button groups are designed for long running or standalone tasks that
should not run whenever a user changes a variable.

They are defined as following:

[string]a_string[/string]

[button]
\`print(a_string)\`
[/button]

They will not run until their respective button is pressed.

### Output groups

Code placed within output groups after any other code section is run. 

Any variable placed within an output group will format as a non-editable card.
By placing key output variables within an output group their results will be
saved in a format that is easy to extract and trend.


## Future work

It is the aim to have it so that the results of these forms can be
saved in \`[formname]-[timestamp].results.json\` files.
Whenever a set of results are saved a copy of the template is included within
the json.

All variable inputs will be recorded along with the timestamp representing the
time at which that input was last changed.

Once this form extension is in a usable state the benefits will truly come to 
light once a second extension is made  which takes the data and trends the 
results over time.

Another extension of value would be a scheduling and overview extension
which defines a set of tasks. Each task can contain multiple forms.
There would also be targets, tasks can be assigned to multiple targets
and assigned tasks can be schuduled to be completed over defined intervals.
This would present an overview of all targets, their corresponding tasks,
when the scheduled tasks were last completed, when they are next due by.
`
