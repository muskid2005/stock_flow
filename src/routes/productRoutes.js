import express from 'express';

const router = express.Router();

let products = [
    { id: 1, name: "Wireless Mouse", category: "Electronics", quantity: 150 },
    { id: 2, name: "Ergonomic Chair", category: "Furniture", quantity: 45 },
    { id: 3, name: "Mechanical Keyboard", category: "Electronics", quantity: 80 }
];

router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

router.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.status(200).json({ success: true, data: product });
});

router.post('/', (req, res) => {
    const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
        name: req.body.name,
        category: req.body.category,
        quantity: req.body.quantity || 0
    };
    
    products.push(newProduct);
    res.status(201).json({ success: true, data: newProduct });
});

export default router;