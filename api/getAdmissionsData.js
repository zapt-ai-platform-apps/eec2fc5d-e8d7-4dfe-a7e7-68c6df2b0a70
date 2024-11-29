import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID,
    },
  },
});

export default async function handler(req, res) {
  try {
    const response = await fetch(process.env.ADMISSIONS_API_ENDPOINT, {
      headers: {
        'Authorization': `Bearer ${process.env.ADMISSIONS_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      res.status(200).json(data);
    } else {
      Sentry.captureException(new Error(`Failed to fetch admissions data: ${response.statusText}`));
      res.status(response.status).json({ error: 'Failed to fetch admissions data' });
    }
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}