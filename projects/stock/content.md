---
title: LSTM Stock Portfolio Curation
blurb: Deep learning model predicting short-term stock returns using sequence-based feature engineering.
image: ../../asset/stock.png
tech:
  - PyTorch
  - LSTM
  - Pandas
  - scikit-learn
---

## The Problem

Financial time-series data is notoriously noisy, and many predictive models fail because they inadvertently leak future information into the training sets.

## The Solution

I engineered an LSTM-based model to predict next-day returns. I focused on rigorous data preprocessing and walk-forward cross-validation to ensure no data leakage, while using technical indicators as sequence features to capture market momentum.
