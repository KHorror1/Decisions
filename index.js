const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Path to Angular build output
const distPath = path.join(__dirname, 'client', 'dist', 'client', 'browser');

// Serve static files
app.use(express.static(distPath));

// Fallback: send index.html for any unmatched route (for Angular routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});