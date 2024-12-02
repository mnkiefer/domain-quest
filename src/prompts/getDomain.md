# Instructions

Given the following file(s) with data headers/types:

`{{HEADER_DATA}}`

###

Based on all files and their context, determine the following:

* **Domain**: A domain refers to a specific area of knowledge, industry, or activity that organizes data, tasks, or expertise.
It defines the context or subject within which problems are analyzed and solutions are developed. In practical terms,
a domain helps categorize and structure the data, ensuring that the analysis, methods, and insights are relevant to a
particular field or use case.

* **Reason**: Tell me the reason you chose this domain based on the data provided in a few sentences.

* **Category**: Tell me which of following categories the chosen domain belongs to. Set category to "Other" if it does not belong:

`{{CATEGORIES}}`

###

The output format should be of type `JSON` as follows:

```json
{
    "domain": "",
    "reason": "",
    "category": ""
}
```