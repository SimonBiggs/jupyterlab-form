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

There are three kinds of sections:

 * \`start\`,
 * \`live\`,
 * and \`button\`.

Code which is written inside of these defined sections is run
as python code according to specific rules.

Within the form variable inputs can be included.
There are two kinds of variable inputs:

 * \`number\`,
 * and \`string\`.

These are attached to a specific python variable which update on
user input.

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

[live]
[table]table[/table]
\`\`\`
table.iloc[0,3] = np.nanmean(table.iloc[0,0:3])
table.iloc[1,3] = np.nanmean(table.iloc[1,0:3])
table
\`\`\`
[/live]

### Button sections

Button groups are designed for long running or standalone tasks that
should not run whenever a user changes a variable.

They are defined as following:

[button]
\`print(a_string)\`
[/button]

They will not run until their respective button is pressed.

[string]a_string[/string]

## Future work

It is the aim to have it so that the results of these forms can be
saved in \`[formname]-[timestamp].results.json\` files.
Whenever a set of results are saved
a hashed copy of the template is saved to the path
\`.frozen-forms/[formname]-[hash].form.md\`.
That way whenever the \`[formname]-[timestamp].results.json\`
file is viewed it will be displayed using the form template
as it was at the time of filling the form out.

All variable inputs will also record the timestamp representing the
time at which that input was last changed.

Templates will also have the option of referencing a \`.config.json\`
file which will be hashed and frozen in the same way as above to provide
abstracted metadata which can be changed independently of the forms.

It might prove useful to create a separate extension which then provides
interactive trending of the form results files over time.

Another extension of value would be a scheduling and overview extension
which defines a set of tasks. Each task can contain multiple forms.
There would also be targets, tasks can be assigned to multiple targets
and assigned tasks can be schuduled to be completed over defined intervals.
This would present an overview of all targets, their corresponding tasks,
when the scheduled tasks were last completed, when they are next due by.

Beyond the big picture goals provided above there is a need for
general user experience improvements.`
