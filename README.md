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

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-4
- **Charts**: Recharts
- **File Upload**: UploadThing (Free tier for MVP)
- **File Parsing**: PapaParse
- **PDF Export**: jsPDF
- **Payments**: Stripe
- **Deployment**: Vercel

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
