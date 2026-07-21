import express from "express";
const app = express();

// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Better Auth app listening on port ${PORT}`);
});
