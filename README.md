# Kalot HR2

This project is a React-based web application tailored for HR management.

## 🚀 Get Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env.local` file based on `.env.example`.
   - Add your `GEMINI_API_KEY` and other necessary keys.

### Local Development
Run the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Build
To create a production build:
```bash
npm run  build
```

## 📦 Deployment

### GitHub Actions
This project is configured with a GitHub Action for automatic deployment to **GitHub Pages**.

1. Go to your repository settings on GitHub.
2. Navigate to **Pages**.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. Push your changes to the `main` branch, and the deployment will trigger automatically.

## 🛠 Project Structure
- `src/`: Source code
- `.github/workflows/`: CI/CD configurations
- `vite.config.ts`: Vite configuration
