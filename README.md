# Domain Quest

<img alt="Solution design diagram" src="./images/domain-quest.png" width="35%" align="right"/>

> *“From data to meaningful insights - facilitating domain-driven data discovery.”*

**Domain Quest** is a [VS Code extension](https://code.visualstudio.com/docs/editor/extension-marketplace) that effortlessly generates [Jupyter Notebooks](https://code.visualstudio.com/docs/datascience/jupyter-notebooks) with domain-specific insights derived from your data.

For aspiring developers, data scientists, analysts or anyone navigating the expansive world of [Python](https://www.python.org/), the greatest challenge often lies in knowing where to start. Domain Quest removes this uncertainty with zero setup, turning data exploration into a smooth and rewarding journey.

Whether your focus is healthcare, finance, marketing, or another field, you can directly dive into discovering trends, correlations, and insights that truly matter and drive meaningful progress in your work.


## Features

* **Data Detection**: Scans your workspace for `CSV` files.

* **AI-driven Content**: Communicates with [GitHub Copilot based chat participant](./src/prompts/base.md) to determine content.

* **Domain-specific Insights**: Provides domain-specific analyses from data headers & types.

* **Notebook Generation**: Creates notebooks with contents tailored to your domain.

* **Automated Visualization**: Generates clear and impactful visualizations.


## Requirements

- [GitHub Copilot Chat](https://code.visualstudio.com/api/extension-guides/chat)
- [Jupyter](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)


## Example

<br><br>
<figure>
<div align="center">
  <video src="[https://github.com/user-attachments/assets/14e8ea43-2c75-49a6-abf2-3c8ae803c4e9](https://github.com/user-attachments/assets/fcf02847-8ced-42b7-b24a-5cbfea392cb6)" controls="controls" />    
</div>
  <figcaption>
    <b>Video</b>: <i>Example of running Domain Quest agent for the `heart-attack-analysis` dataset</i>
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
