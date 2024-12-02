# Instructions

Given the following file(s) with data headers/types:

`{{HEADER_DATA}}`

###

Based on all files and their context, determine the following:

* **Title**: Markdown title of the analysis.

* **Intent**: Markdown text with a clear description of the purposed and expected outcome of each analysis and what it is commonly used for in the specified domain.

* **Code**: Python code that creates the specified analysis.

* **Visualization**: Python code that creates supporting visualizations for the specified analysis.

* **Summary**: Markdown text that provides a summary of each code cell to describe what can be observed.

###

For analyses, consider the following:

`{{ANALYSIS}}`

###

The output format should be a raw **Jupyter Notebook** of type `JSON` as follows:

```json
{
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {
    "vscode": {
     "languageId": "plaintext"
    }
   },
   "source": [
    "# Heart Attack Analysis\n",
    "\n",
    "This Jupyter Notebook will perform various analyses on the heart attack dataset, including descriptive statistics..."
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "import pandas as pd\n",
    "import numpy as np"
   ]
  }
 ],
 "metadata": {
  "language_info": {
   "name": "python"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}

```