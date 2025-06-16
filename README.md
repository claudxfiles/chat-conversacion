# chat-conversacion

This is a Next.js application designed to serve as a conversational interface for an N8N agent, built with Firebase Studio.

## Core Features:

- Webhook Integration: Connects to an N8N webhook.
- Conversational UI: Allows users to interact with the N8N agent through a chat interface.
- File Attachments: Supports attaching files (currently images) to messages.
- Markdown Rendering: Displays bot responses formatted with Markdown.

## Tech Stack:

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- ShadCN UI Components
- Genkit (for potential future AI integrations directly in the app)
- N8N (for the backend agent logic)

## Getting Started

To run this project locally (after cloning):

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Run the development server:
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:9002`.

Ensure your N8N webhook (specified in `src/lib/actions.ts`) is active and correctly configured to receive data and send back responses.
