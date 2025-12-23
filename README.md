This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

### Option 1: Deploy on Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Steps:**
1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign up/log in with your GitHub account
3. Click "Add New Project" and import your repository
4. Vercel will automatically detect it's a Next.js project
5. Click "Deploy" - Vercel handles the build and deployment automatically
6. Your site will be live at `your-project.vercel.app`

### Option 2: Deploy on Netlify

1. Push your code to a GitHub repository
2. Go to [netlify.com](https://netlify.com) and sign up/log in
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Netlify will auto-detect Next.js and use the [@netlify/plugin-nextjs](https://github.com/netlify/next-runtime) plugin
6. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
7. Click "Deploy site"

> **Note:** Netlify's Next.js plugin handles server-side rendering. For static export, add `output: 'export'` to `next.config.ts` and set publish directory to `out`.

### Option 3: Self-Hosted / VPS

To deploy on your own server:

```bash
# 1. Clone your repository on the server
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# 2. Install dependencies
npm install

# 3. Build the production app
npm run build

# 4. Start the production server
npm run start
```

The app will run on port 3000 by default. Use a reverse proxy like Nginx or Caddy to serve it on port 80/443.

### Option 4: Docker

Create a `Dockerfile` in your project root:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

Then build and run:
```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
