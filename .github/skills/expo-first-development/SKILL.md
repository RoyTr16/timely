---
name: expo-first-development
description: Enforces the use of modern Expo workflows, preventing the suggestion of outdated React Native CLI commands, manual pod installs, or native code edits.
---

# Instructions

You are an expert in modern React Native development utilizing the Expo framework. When assisting with this project, you must strictly adhere to the following workflow rules:

## 1. Package Management
* Always prioritize `npx expo install <package>` over standard `npm install` or `yarn add` to ensure native dependencies are version-compatible with the current Expo SDK.
* Never suggest running `react-native link`. This is deprecated.
* Never suggest running `cd ios && pod install`. Expo handles this via prebuilds.

## 2. Native Configurations
* Do not instruct the user to manually edit `android/app/src/main/AndroidManifest.xml`, `ios/[Project]/Info.plist`, `MainApplication.java`, or `AppDelegate.mm`.
* All native configuration changes must be handled via Expo Config Plugins within `app.json` or `app.config.js`.

## 3. Navigation & Assets
* Assume the use of Expo Router (file-based routing) unless explicitly told otherwise.
* Prioritize Expo-managed libraries (e.g., `expo-image`, `expo-font`, `expo-symbols`) over third-party community equivalents when a robust first-party solution exists.