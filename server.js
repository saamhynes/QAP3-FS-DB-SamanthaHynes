const express = require("express");
const app = express();
const port = 3000;
const { Pool } = require("pg");

// postgres connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "products_db",
  password: "Keyin2021",
  port: 5432,
});

// Body parser middleware
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("views", "./views");
app.set("view engine", "ejs");

// Render the products page
app.get("/products", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products");
    res.render("products", { products: rows });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Display the form to add a new product
app.get("/products/new", (req, res) => {
  res.render("new");
});

// Add a new product
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

// Delete a product by ID
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

// put request to render edit form
app.put("/products/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE products SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    res.json({ product: rows[0] });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).send("Internal Server Error");
  }
});

//put request to handle product update
app.put("/products/edit/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const productIndex = products.findIndex((prod) => prod.id === parseInt(id));

  if (productIndex === -1) {
    res.status(404).send("Product not found");
  } else {
    products[productIndex].name = name;
    res.status(200).json({ product: products[productIndex] });
  }
});

// patch request to handle specific product updates
app.patch("/products/edit/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const columns = Object.keys(updates);
    const values = Object.values(updates);
    const updateSet = columns
      .map((col, index) => `${col} = $${index + 1}`)
      .join(", ");

    const query = {
      text: `UPDATE products SET ${updateSet} WHERE id = $${
        columns.length + 1
      } RETURNING *`,
      values: [...values, id],
    };

    const { rows } = await pool.query(query);
    res.json({ product: rows[0] });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).send("Internal Server Error");
  }

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
