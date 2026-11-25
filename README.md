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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


---

## CI/CD Pipeline (GitHub Actions)

This repository includes an automated CI/CD pipeline under `.github/workflows/`:

- `ci.yml` — Continuous Integration (Lint, TypeScript check, tests if present, Next.js production build)
- `cd.yml` — Continuous Deployment to Vercel Production
- `dependency-check.yml` — Weekly & PR dependency lockfile validation, `npm audit`, and update recommendations

### Branch Strategy

- `development`: Integration branch. Pushes and pull requests trigger `ci.yml`.
- `main`: Production branch. Pushes and pull requests trigger `ci.yml`; successful `CI` runs on `main` automatically trigger `cd.yml`.

### Required GitHub Secrets

Configure the following repository secrets in **GitHub → Settings → Secrets and variables → Actions**:

| Secret | Purpose |
| :--- | :--- |
| `VERCEL_TOKEN` | Vercel Personal / Team Access Token |
| `VERCEL_ORG_ID` | Vercel Organization / Team ID (`prj_` / `team_`) |
| `VERCEL_PROJECT_ID` | Vercel Project ID |

*(Optional if Clerk authentication is enabled in production: add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in your Vercel Project Environment Variables.)*

### Manual Deployment

1. Open **GitHub → Actions → CD**.
2. Click **Run workflow**, select `main`, and click **Run workflow**.

### Troubleshooting & Logs

- **Failed CI builds**: Inspect the failing step (`Run ESLint`, `Run TypeScript validation`, or `Run Next.js production build`) in the **Actions** tab, and reproduce locally with:
  ```bash
  npm ci
  npm run lint
  npx tsc --noEmit
  npm run build
  ```
- **Deployment logs**: Open the **CD** workflow run in GitHub Actions to view the Vercel CLI build/deploy output and the published deployment URL in the job summary.
