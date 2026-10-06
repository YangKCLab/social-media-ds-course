# Network demos

The notebooks for the networks topic of CS 415/515.

- `networkx-basics.ipynb`: create and load a network with NetworkX, degrees, shortest paths, a degree distribution on a log axis, and the friendship paradox.
- `centrality-and-communities.ipynb`: five centrality measures on a character network, and communities with the Louvain method.
- `posts-to-networks.ipynb`: a user-hashtag network, its projection, a hashtag co-occurrence network, and a reply network from ten hand-written posts; connected components; saving a network for Gephi.

The same notebooks are on the materials site, with a page of explanation for each topic:
https://yangkclab.github.io/social-media-analysis/topics/network/

Each notebook starts with a badge that opens the copy of the materials site in Colab.

## Data in this folder

`karate.edgelist` is the edge list of Zachary's karate club
network: 34 members and 78 edges, one edge on each line.
Source: Zachary (1977), "An Information Flow Model for Conflict
and Fission in Small Groups", Journal of Anthropological
Research 33(4), 452-473. https://doi.org/10.1086/jar.33.4.3629752

The 78 lines are equal to the data lines of the file
`Newman/karate` of the SuiteSparse Matrix Collection
(https://sparse.tamu.edu/Newman/karate), which states the
license CC BY 4.0 for its matrices (https://sparse.tamu.edu/about).

`networkx-basics.ipynb` and `centrality-and-communities.ipynb` download a copy of this file into `data/` on the first run.

## Data that the notebooks download

This folder does not hold the two datasets below.
A notebook downloads the files into `data/` on the first run.
Git ignores the folder `data/`.

`networkx-basics.ipynb` downloads the Botwiki-2019 dataset from
`demos/stats/` of this repository. Source: Yang, Varol, Hui, and
Menczer (2020), "Scalable and generalizable social bot detection
through data selection", AAAI. https://doi.org/10.1609/aaai.v34i01.5460
License: CC BY-NC-ND 4.0
(https://creativecommons.org/licenses/by-nc-nd/4.0/).
See `demos/stats/README.md`.

`centrality-and-communities.ipynb` downloads the edge lists of
book 1 and book 2 of the character interaction networks of
"A Song of Ice and Fire" by Andrew Beveridge, from
https://github.com/mathbeveridge/asoiaf.
License: CC BY-NC-SA 4.0
(https://creativecommons.org/licenses/by-nc-sa/4.0/).
The saved outputs of this notebook hold tables and one figure that
were computed from these edge lists. They are shared under the same
license.

The MIT license of this repository does not cover these two datasets,
or the tables and the figure that were computed from the character
networks.

`posts-to-networks.ipynb` downloads no data. It writes two files into `data/`.
