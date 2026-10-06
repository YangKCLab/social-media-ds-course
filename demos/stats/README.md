# Statistics demos

The notebooks for the statistics topic of CS 415/515.

- `distributions.ipynb`: mean and median, histograms, box plots, violin plots, CDF and CCDF, and log axes for skewed data.
- `significance-tests.ipynb`: the p-value by simulation with a coin, the binomial test, the t-test, three other tests, and effect size.
- `correlation-analysis.ipynb`: scatter plots, the Spearman and Pearson coefficients, and 2D histograms.

The same notebooks are on the materials site, with a page of explanation for each topic:
https://yangkclab.github.io/social-media-analysis/topics/stats/

Each notebook starts with a badge that opens it in Colab.

## Data in this folder

`botwiki-2019_tweets.json.gz` is the Botwiki-2019 dataset from the
[Bot Repository](https://botometer.osome.iu.edu/bot-repository/datasets.html),
unchanged. Source: Yang, Varol, Hui, and Menczer (2020),
"Scalable and generalizable social bot detection through data
selection", AAAI. https://doi.org/10.1609/aaai.v34i01.5460

License of this file: CC BY-NC-ND 4.0
(https://creativecommons.org/licenses/by-nc-nd/4.0/).
The MIT license of this repository does not cover this file.

`distributions.ipynb` and `correlation-analysis.ipynb` download a copy of this file into `data/` on the first run.
Git ignores the folder `data/`.
