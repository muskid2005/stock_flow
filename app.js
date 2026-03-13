import express from 'express';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory array acting as our temporary database
let products = [
    { id: 1, name: "Wireless Mouse", category: "Electronics", quantity: 150 },
    { id: 2, name: "Ergonomic Chair", category: "Furniture", quantity: 45 },
    { id: 3, name: "Mechanical Keyboard", category: "Electronics", quantity: 80 }
];

// Get all products
app.get('/api/products', (req, res) => {
    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

// Get a single product by its ID
app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.status(200).json({ success: true, data: product });
});

// Add a new product
app.post('/api/products', (req, res) => {
    const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
        name: req.body.name,
        category: req.body.category,
        quantity: req.body.quantity || 0
    };
    
    products.push(newProduct);
    res.status(201).json({ success: true, data: newProduct });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`DEMO Product API is running on http://localhost:${PORT}`);
});