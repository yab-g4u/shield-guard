import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({status: 'ok', service: 'api-gateway'});
});

app.all('*', (_req, res) => {
  res.status(404).json({
    error: 'Not implemented — use apps/dashboard playground for demos.',
  });
});

const port = Number(process.env.PORT) || 8787;
app.listen(port, () => {
  console.log(`api-gateway stub on :${port}`);
});
