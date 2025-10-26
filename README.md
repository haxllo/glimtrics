# Glimtrics

Glimtrics is an AI-powered analytics dashboard for small businesses and creators that provides insights, trends, and actionable suggestions from their data.

## Features

- 🔐 **User Authentication** - Sign up, login, password reset with NextAuth
- 📊 **Dashboard Layout** - Overview of data with charts and statistics
- 📁 **Data Upload** - CSV or Excel import support
- 🤖 **AI Insights** - Trend detection, anomaly spotting, and suggestions powered by OpenAI
- 📈 **Charts & Graphs** - Line, bar, pie charts with Recharts
- 📄 **PDF Export** - Download reports
- 💳 **Subscription Management** - Billing with Stripe ($9-29/month)
- 📧 **Notifications** - Email notifications for reports and insights
- 📱 **Mobile-friendly** - Responsive design

## Tech Stack

| Category | Technologies |
| --- | --- |
| Application Framework | [Next.js 15](https://nextjs.org/) (App Router) · [React 19](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/) |
| UI & Styling | [Tailwind CSS](https://tailwindcss.com/) · [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) · [class-variance-authority](https://github.com/joe-bell/cva) · [Radix UI](https://www.radix-ui.com/) (shadcn/ui) · [Framer Motion](https://www.framer.com/motion/) · [lucide-react](https://lucide.dev/) · [Sonner](https://sonner.emilkowal.ski/) |
| Data & Analytics | Custom analytics utilities · [Recharts](https://recharts.org/en-US/) · [html2canvas](https://html2canvas.hertzen.com/) · [jsPDF](https://github.com/parallax/jsPDF) · [SheetJS](https://sheetjs.com/) (XLSX) · [PapaParse](https://www.papaparse.com/) |
| Backend Services | Next.js Route Handlers · [Prisma ORM](https://www.prisma.io/) · [Auth.js Prisma Adapter](https://authjs.dev/reference/adapter/prisma) · [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| Database | [PostgreSQL](https://www.postgresql.org/) (Supabase-compatible) |
| Authentication | [NextAuth.js](https://next-auth.js.org/) |
| AI & Automation | [OpenAI Node SDK](https://www.npmjs.com/package/openai) · [BullMQ](https://docs.bullmq.io/) · [ioredis](https://github.com/redis/ioredis) |
| File & Asset Handling | [UploadThing](https://uploadthing.com/) |
| Billing | [Paddle JS](https://developer.paddle.com/paddle-checkout/reference/js-buy-sdk) · [Paddle Node SDK](https://developer.paddle.com/reference/paddle-sdk) |
| Tooling | [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client) · [ESLint 9](https://eslint.org/) · [eslint-config-next](https://nextjs.org/docs/app/building-your-application/configuring/eslint) · [PostCSS](https://postcss.org/) · [Autoprefixer](https://github.com/postcss/autoprefixer) · [TypeScript 5](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html) |
| Deployment Target | [Vercel](https://vercel.com/) |

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended)
- Stripe account
- OpenAI API key
- UploadThing account (free tier)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

3. Set up UploadThing:
   - Sign up at https://uploadthing.com
   - Create a new app
   - Copy your App ID and Secret to `.env`

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
glimtrics/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── auth/              # Authentication pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── charts/           # Chart components
│   ├── upload/           # File upload components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
│   ├── prisma.ts        # Prisma client
│   └── utils.ts         # General utilities
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma    # Database schema
└── public/              # Static assets
```

## Development Roadmap

- [ ] User authentication with NextAuth
- [ ] Dashboard UI with shadcn/ui
- [ ] Data upload (CSV/Excel)
- [ ] AI insights integration
- [ ] Chart visualizations
- [ ] PDF export functionality
- [ ] Stripe subscription management
- [ ] Email notifications
- [ ] Mobile responsive design
- [ ] Testing and deployment

## License

MIT
