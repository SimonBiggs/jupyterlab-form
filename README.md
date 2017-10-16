# Jupyterlab Form

To install and use `jupyterlab-form` do the following:

Aquire Python, JupyterLab, Node, npm, and git.

One way to get these it to download miniconda from https://conda.io/miniconda.html and then run the following:

```bash
conda install nodejs jupyterlab git -c conda-forge
```

Alternatively node and npm can by installed via nvm (https://github.com/creationix/nvm) and jupyterlab can be installed via pip as so:

```bash
pip install jupyterlab
```

Once you have those requirements download and install jupyrerlab-forms by running the following:

```bash
git clone https://github.com/SimonBiggs/jupyterlab-form
cd jupyterlab-form
npm install
jupyter labextension install
jupyter lab
```

Then within the `launcher` tab press the `Form` button.
