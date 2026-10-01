---
title: Autonomous Forklift
blurb: A capstone project connecting perception, navigation, and a physical lifting mechanism.
category: Robotics & integration
status: In progress · planning and bring-up
image: ../../asset/forklift/forklift_sim.png
tech:
  - ROS2
  - Python
  - Raspberry Pi
  - Embedded control
  - RGB-D sensing
---

## A robot that retrieves, not just navigates

Our four-person capstone team is designing a mobile robot for a warehouse-like environment. The goal is to navigate a limited area, associate known objects with locations, and retrieve a requested object using a forklift-style lifting mechanism.

The project is in initial planning and bring-up. The current repository contains the proposal, architecture notes, hardware documentation, and development workflow. It does not yet establish a completed autonomous retrieval system.

## The proposed system

The platform separates higher-level perception and planning from low-level motor and actuator control. ROS2 connects the software components, with laptop-based computation and an embedded controller. The proposal also includes a Raspberry Pi, wheel encoders, an IMU, and an RGB-D camera.

| Layer | Planned responsibility |
| --- | --- |
| RGB-D perception | Observe depth and identify known objects |
| Mapping and localization | Relate observations to locations |
| Navigation | Move the base toward the target |
| Manipulation control | Align and operate the lift |
| Embedded controller | Drive motors and actuators |

These are design responsibilities, not a list of subsystems already validated on hardware.

## Bringing it up in stages

The proposal starts with hardware operation independent of AI: stream the camera and remotely control the wheels and lift. The next stage connects perception while the robot is teleoperated and creates a physical environment matching the simulation.

Navigation and retrieval come after that foundation. Separating these stages gives us ways to inspect individual failures before asking the full system to act autonomously.

## A deliberately constrained first demo

The initial environment is small and structured, with known box-like objects. That keeps the first demonstration focused on integration instead of requiring general object handling or an arbitrary warehouse layout.

Simulation is planned for early perception and navigation development. Physical pickup still needs its own validation: finding the correct object does not by itself establish that the robot can approach, lift, and transport it reliably.

## Why this project interests me

It crosses the boundary between software and a mechanism that has to move. A good perception result is only one step; the timing, coordinate frames, controller behavior, and physical alignment all have to agree. That is the systems problem I want to work through as the capstone develops.
