try {
  const response = await fetch('http://127.0.0.1:8787/api/stats', {
    signal: AbortSignal.timeout(3500),
  });
  if (!response.ok) throw new Error(`Stats API returned ${response.status}`);
  const result = await response.json();
  if (!Number.isInteger(result.total) || !Array.isArray(result.rows)) {
    throw new Error('Unexpected statistics response.');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
