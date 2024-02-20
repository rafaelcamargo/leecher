const app = require('./app');
const PORT = 9009;

app.listen(PORT, () => {
  console.log(`Running application on http://localhost:${PORT}`);
});
