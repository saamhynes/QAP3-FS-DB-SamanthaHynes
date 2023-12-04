const express = require("express");
const app = express();
const port = 3000;
const { Pool } = require("pg");

// Create a connection pool to PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "products_db",
  password: "Keyin2021",
  port: 5432,
});

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", "./views");
app.set("view engine", "ejs");

// GET route to fetch all products
app.get("/products", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products");
    res.render("products", { products: rows });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Internal Server Error");
  }
});

// POST route to add a new product
app.post("/products", async (req, res) => {
  const { name } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO products(name) VALUES($1) RETURNING *",
      [name]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).send("Internal Server Error");
  }
});

// PUT route to update an existing product
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  console.log(
    `Received request to update product ID: ${id} with name: ${name}`
  );

  try {
    const { rows } = await pool.query(
      "UPDATE products SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    console.log(`Product updated successfully:`, rows[0]);
    res.json({ product: rows[0] });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE route to remove a product
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
