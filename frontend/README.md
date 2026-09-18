## Frontend -- Chat UI
Based on the project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). This folder contains the source code for the chat UI built wiht Next.js (React) for only one user with a basic admin panel to manage the documents of the RAG.

### Env Vars
* `JWT_SECRET`: JWT used to authentication and login users
* `AEGRA_API_URL`: URL for the endpoints of Aegra service
* `AEGRA_ASSISTANT_ID`: ID of the RAG agent
* `RAG_API_URL`: URL for the endpoints of RAG service

## Customization
* Change the colors of light and dark theme to modify them on [theme.config.ts](./src/config/theme.config.ts)
* Modify the banner image and its URL redirection in [banner.config.ts](./src/config/banner.config.ts)

### Getting Started
First, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### AI Acknowledge
This code was developed enterily using Antigravity (Gemini 3.5 Flash and Gemini 3.6 Flash). Hence, I do not recommend this code for a deployment but as a start point to test the RAG agent in an interface.