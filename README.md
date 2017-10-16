# JupyterLab Form

An extension for jupyterlab to create scripted forms.

## Requirements

Aquire Python, JupyterLab, Node, npm, and git.

One way to get these is to download miniconda from https://conda.io/miniconda.html, install it, and then run the following:

```bash
conda install nodejs jupyterlab git -c conda-forge
```

Alternatively node and npm can by installed via nvm (https://github.com/creationix/nvm) and jupyterlab can be installed via pip as so:

```bash
pip install jupyterlab
```

## Installation

Once you have those requirements download and install jupyrerlab-forms by running the following:

```bash
git clone https://github.com/SimonBiggs/jupyterlab-form
cd jupyterlab-form
npm install
jupyter labextension install
jupyter lab
```

Then within the `launcher` tab press the `Form` button.
