---
title: LSTM Portfolio Curation
blurb: An experiment with financial fundamentals, sequence models, and company embeddings.
category: Machine learning
status: Research project
image: ../../asset/stock.png
code: https://github.com/RainWoo1/LSTM-Stock-Portfolio-Curation
tech:
  - PyTorch
  - LSTM
  - Pandas
  - scikit-learn
---

## Looking beyond price alone

Our starting question was whether a sequence model could help analyze company fundamentals for medium- to longer-term portfolio curation. We wanted to study financial history rather than frame the project as a next-day trading system.

The repository contains data-processing notebooks, LSTM experiments, a Random Forest notebook, and saved model checkpoints. It is a modeling project, with several iterations rather than one production investment pipeline.

## Preparing company histories

The data is organized into a CSV per ticker. The notebooks select financial features, handle missing values, normalize inputs, and build windows of observations. A window becomes the model input; a subsequent return value becomes its target.

The imputation experiments include mean, median, and mode-based filling. Other versions use zero filling. These choices matter because missing financial observations can change both the input distribution and which companies remain in the dataset.

## One model, many companies

The models pair financial observations with a learned company embedding. That embedding is repeated across the input window and concatenated with the feature vector at each time step. It gives a shared sequence model a way to distinguish companies without training a separate network for every ticker.

The notebooks explore stacked LSTMs, bidirectional variants, dropout, and attention. In the attention-based variants, the model combines information from several time steps before producing a scalar prediction.

| Component | Purpose |
| --- | --- |
| Financial feature window | Represent a company's recent history |
| Company embedding | Add a learned representation of company identity |
| LSTM | Process the sequence |
| Attention in selected variants | Weight information across the window |
| Output layer | Predict the return target |

## Evaluation and its limits

The notebooks track training and validation loss and R². They also inspect return predictions using a negative, stable, or positive classification threshold. Some experiments reserve 2023 for testing after using earlier years for training and validation.

The implementation is not uniformly walk-forward: some versions shuffle overlapping windows into training and validation sets, and preprocessing differs between iterations. I would not describe these experiments as proving leakage-free forecasting or reliable investment performance.

A stronger next evaluation would use chronological splits, fit all preprocessing on training data, preserve the same sequence construction at inference, and compare portfolio outcomes after transaction costs.

## What I took from it

The most useful part was working through the entire modeling path: company-level data, missing values, sequence construction, model architecture, and evaluation. A more complicated network does not resolve an inconsistent data split. The experiment made that distinction much clearer.
