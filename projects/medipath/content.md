---
title: MediPath
blurb: Emergency routing mapping software using multi-threaded A* pathfinding.
image: ../../asset/medipath.png
tech:
  - C++
  - GTK
  - TomTom API
  - OSM Map
---

## The Problem

Emergency response routing requires near-instant recalculations that account for dynamic traffic density on massive city-wide datasets.

## The Solution

We developed a C++ engine utilizing multi-threaded A* and Dijkstra's algorithm to solve a variant of the Travelling Salesman Problem. By integrating live TomTom traffic data, we optimized emergency routes to prioritize speed and reliability over simple distance.
