# Domain Quest

<img alt="Solution design diagram" src="./images/domain-quest.png" width="35%" align="right"/>

> *“From data to meaningful insights - facilitating domain-driven data discovery.”*

**Domain Quest** is a [VS Code extension](https://code.visualstudio.com/docs/editor/extension-marketplace) that effortlessly generates [Jupyter Notebooks](https://code.visualstudio.com/docs/datascience/jupyter-notebooks) with domain-specific insights derived from your data.

For aspiring developers, data scientists, analysts or anyone navigating the expansive world of [Python](https://www.python.org/), the greatest challenge often lies in knowing where to start. Domain Quest removes this uncertainty with zero setup, turning data exploration into a smooth and rewarding journey.

Whether your focus is healthcare, finance, marketing, or another field, you can directly dive into discovering trends, correlations, and insights that truly matter and drive meaningful progress in your work.


## Features

* **Data Detection**: Scans your workspace for `CSV` files.
  
* **AI-driven Content**: Communicates with a GitHub Copilot based Chat participant to determine the content.

* **Domain-specific Insights**: Provides domain-specific analyses from data headers & types.

* **Notebook Generation**: Generates notebooks with contents tailored to your domain.

* **Automated Visualization**: Creates clear and impactful visualizations.


## Prerequisites

- [Python 3](https://code.visualstudio.com/docs/python/python-tutorial#_install-a-python-interpreter)
- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- [Jupyter](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)


## Setup

Install all of the listed prerequisites and clone this extension:

```sh
git clone https://github.com/mnkiefer/domain-quest
```

Navigate to the directory of your clone and install/compile:

```sh
npm install
npm run compile
```

To run it, go to:

**Run and Debug** > **Run Extension**

This opens up a new workspace where you can now test the extension with some of the `CSV` data provided in [`samples`](./samples).


## How it works

When the extension is activated, it initializes a custom [Chat participant](https://code.visualstudio.com/api/extension-guides/chat#develop-a-chat-extension) based on GitHub Copilot and scans the workspace for `CSV` files.

For all `CSV` files found (this also works on file selection and triggering the command **Run Domain Quest**), headers and their types are extracted and the first [prompt to detect the domain](https://github.com/mnkiefer/domain-quest/blob/main/src/prompts/getDomain.md) for this data is crafted and sent to the Chat participant.

The Chat participates directly communicates with a language model (e.g., GitHub Copilot, GPT-4o) to determine the domain of the data and checks if this domain belongs to a known category. These categories reflect a more relevant set of analyses provided by domain experts (e.g. we have provided one for the [healthcare](https://github.com/mnkiefer/domain-quest/blob/main/src/prompts/healthcare.md) category).

Next, the Chat Participant is queried again to provide an analysis in form of a Jupyer Notebook. Depending on whether the domain belongs to one of the categories for which expert knowledge exists, we either keep the prompt [generic](https://github.com/mnkiefer/domain-quest/blob/main/src/prompts/getAnalysis.md) or make it [domain-specific](https://github.com/mnkiefer/domain-quest/blob/main/src/prompts/getCategoryAnalysis.md).

Based on the results, a Jupyer Notebook is then generated and executed. Depending on the local Pyhon configuration, one may need to select a [Python Environment](https://code.visualstudio.com/docs/datascience/jupyter-kernel-management#_python-environments) from the dropdown with which to run. Once executed, one can now conveniently scroll through the notebook to see the analyses already applied on the local data and interpret the results.

<br><br>
<figure>
<div align="center">
  <video src="https://github.com/user-attachments/assets/fcf02847-8ced-42b7-b24a-5cbfea392cb6" controls="controls" />    
</div>
  <figcaption>
    <b>Video</b>: <i>Example of running Domain Quest agent for the <b>heart-attack-analysis</b> dataset</i>
  </figcaption>
</figure>
<br><br><br>


## References

* VS Code
  * [Chat Extensions](https://code.visualstudio.com/api/extension-guides/chat)
  * [VS Code API](https://code.visualstudio.com/api/references/vscode-api)
  * [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
* Data samples
  * [Heart Attack Analysis & Prediction](https://www.kaggle.com/code/kanncaa1/heart-attack-analysis-prediction)
  * [Red Wine Quality](https://www.kaggle.com/datasets/uciml/red-wine-quality-cortez-et-al-2009)
  * [Video Game Sales](https://www.kaggle.com/datasets/gregorut/videogamesales)
* Logo from [FREEP!K](https://www.freepik.com/free-vector/ai-powered-marketing-tools-abstract-concept-illustration_12291062.htm#fromView=search&page=1&position=7&uuid=d566a5ec-64b2-4295-a489-008dd89b8e1c)
