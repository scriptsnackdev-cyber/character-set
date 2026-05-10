# Fortune Character Generator

A Next.js application that transforms your character images into mystical Tarot cards using the Gemini API and Imagen 3.

## Setup

1. **API Key**: Obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/).
2. **Environment Variables**: Create or update `.env` file with your key:
   ```env
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-1.5-flash
   IMAGEN_MODEL=imagen-3.0-generate-001
   ```
3. **Run**: 
   ```bash
   npm install
   npm run dev
   ```

## Features

- **Character Analysis**: Uses Gemini Vision to describe your uploaded character.
- **Consistent Style**: Enforces a traditional woodcut/engraved tarot style as shown in the example.
- **Full Major Arcana**: Choose from all 22 Major Arcana cards.

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
