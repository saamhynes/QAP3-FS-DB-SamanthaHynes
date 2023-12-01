const express = require("express");
const app = express();
const port = 3000;

// Sample products data (for demonstration purposes)
let products = [
  { id: 1, name: "Product 1" },
  { id: 2, name: "Product 2" },
  { id: 3, name: "Product 3" },
];

// Body parser middleware
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("views", "./views");
app.set("view engine", "ejs");

// Render the products page
app.get("/products", (req, res) => {
  res.render("products", { products });
});

// Display the form to add a new product
app.get("/products/new", (req, res) => {
  res.render("new");
});

// Add a new product
app.post("/products", (req, res) => {
  const { name } = req.body;
  const id = products.length + 1; // Generate a simple ID (replace this with proper ID handling)

  products.push({ id, name });
  res.json({ id, name });
});

// Delete a product by ID
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  products = products.filter((product) => product.id !== parseInt(id));
  res.sendStatus(200);
});

// get request to render edit form
app.get("/products/edit/:id", (req, res) => {
  const { id } = req.params;
  const product = products.find((prod) => prod.id === parseInt(id));

  if (!product) {
    res.status(404).send("Product not found");
  } else {
    res.status(200).json({ product });
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
