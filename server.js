const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// --- Server Configuration ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware for static files and parsing
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- File Storage Setup ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });


// --- Routes ---

// GET /: Render the chat interface
app.get('/', (req, res) => {
    res.render('index');
});

// POST /api/submit-reimbursement: API Submission Endpoint
app.post('/api/submit-reimbursement', upload.single('receiptFile'), (req, res) => {
    const formData = req.body;
    const fileData = req.file;

    if (!formData.serviceDate || !formData.cost || !fileData) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields (date, cost, or receipt).'
        });
    }

    // Final API Submission Payload structure
    const finalPayload = {
        employeeId: 'mock-001-xstate',
        serviceDate: formData.serviceDate,
        tripDetails: {
            origin: formData.origin,
            destination: formData.destination,
            reason: formData.reason,
        },
        cost: parseFloat(formData.cost),
        receipt: {
            fileName: fileData.filename,
            fileMimeType: fileData.mimetype,
            storagePath: path.join('uploads', fileData.filename)
        },
        submissionTimestamp: new Date().toISOString()
    };

    console.log("✅ XState Reimbursement Submission Received:");
    console.log(finalPayload);

    // Simulate API delay
    setTimeout(() => {
        res.status(200).json({
            success: true,
            refId: `GRH-${Date.now().toString().slice(-6)}`,
            message: 'Reimbursement successfully submitted.'
        });
    }, 1500);
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`🚀 Express/Pug/XState server running at http://localhost:${PORT}`);
});