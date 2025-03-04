# OpenAI TTS

## Overview
This project is a web application that demonstrates integration with OpenAI services and text-to-speech functionality. You must provide your own OpenAI API key to run the project. It currently uses OpenAI o1-mini for chat generation, and OpenAI tts-1 "ash" for voice.

## Requirements
- Node.js (>=14.0.0)
- npm (or yarn) package manager

## Setup
1. Clone the repository.
2. Install dependencies by running `npm install` in the project root.
3. Configure your OpenAI API key in a `.env` file for security.

## Running the Project
To start the development server, run:
```bash
npm run dev
```
This command will launch the app and provide a local URL for access.

## Abilities
- Provides integration with OpenAI services.
- Implements text-to-speech capabilities.
- Built with Vite, React, and TypeScript.

## Building for Production
To create a production build, run:
```bash
npm run build
```
Customize configuration files as necessary for your deployment environment. Change the prompt, voice, or GPT model and make it your own!
