---
title: Daily Calorie Planner
blurb: A meal-logging prototype that turns spoken food descriptions into calorie estimates.
category: Speech & language
status: Prototype
image: ../../asset/calorieplanner.png
code: https://github.com/RainWoo1/daily-calorie-planner
tech:
  - React Native
  - Expo
  - TypeScript
  - Flask
  - spaCy
  - Nutritionix
---

## Less searching, more describing

Entering a meal usually means searching for each food separately. This project explores another input: describe what you ate, extract the food mentions, and look up their calorie information.

The repository combines an Expo / React Native interface, a Flask service, a browser recording demo, and notebooks for speech, food recognition, and nutrition lookup.

## The processing path

The Flask browser-audio endpoint saves a WebM recording, converts it to WAV using pydub, and transcribes it through the SpeechRecognition library's Google recognizer. A separate text endpoint accepts a description directly.

A locally trained spaCy entity-recognition model extracts food mentions. The service searches Nutritionix for matching foods, requests nutrient data, and formats the results as individual calorie estimates and a total.

| Stage | What it produces |
| --- | --- |
| Audio conversion and transcription | Text describing the meal |
| Food entity recognition | Food mentions to look up |
| Nutritionix search | Candidate food names |
| Nutrient lookup | Calories for matched entries |
| Response formatting | A readable summary and total |

## Connecting the interface

The mobile recording screen uses Expo audio to start and stop a recording and send the resulting file to Flask. The app also includes onboarding and meal-recording screens.

There is an important integration boundary: the mobile `/uploadApp` endpoint currently saves the file, while the browser `/upload` endpoint runs the transcription and calorie pipeline. The source supports those prototype pieces, but not a claim that the mobile recording flow already completes the whole analysis automatically.

## Where estimates become uncertain

A spoken description may not specify portion size or how a dish was prepared. Entity recognition can miss a food, and a lookup can choose the wrong entry. The current search logic prefers an exact common-food match and can fall back to a branded result.

That makes the returned numbers estimates tied to the matched entries. Explicit portion handling and a screen for correcting matches would be useful next steps before treating the output as a dependable meal log.

## What the prototype taught me

The interesting engineering problem is the handoff between stages. Audio can upload successfully while transcription fails; a food can be recognized while the nutrition lookup finds nothing. Building the prototype made it easier to see where each stage needs a visible result and a recoverable error.
