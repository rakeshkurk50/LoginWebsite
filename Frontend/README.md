User Profile Form — plain-JS (jQuery) primary

I converted a React/Vite app into a plain HTML + jQuery version located in `plain-js/` and added a simple start script.

Quick start (PowerShell):

1) Serve with the included npm script (uses npx http-server):

```powershell
# from project root
npm run start
# open http://localhost:5173 in your browser
Start-Process http://localhost:5173
```

2) Or open static file directly (no server):

```powershell
Start-Process .\plain-js\index.html
```

Notes:
- I kept all original React/Vite sources under `src/` and the original `package.json` dependencies were replaced with a minimal package.json that serves `plain-js/` using `http-server` so you can run the app without installing/building React.
- If you want me to permanently remove React sources and clean up the repo, tell me and I will remove them after creating a backup commit.
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/7ca4896e-28c1-4e4d-bc65-c3fbb2fe7709

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7ca4896e-28c1-4e4d-bc65-c3fbb2fe7709) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7ca4896e-28c1-4e4d-bc65-c3fbb2fe7709) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
