const Book = require('../models/Book');
const AffiliateClick = require('../models/AffiliateClick');
const imagekit = require('../config/imagekit');

exports.getAllBooks = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        const books = await Book.find(query).sort({ createdAt: -1 });
        res.json(books);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(500).send('Server Error');
    }
};

exports.createBook = async (req, res) => {
    try {
        const { title, author, category } = req.body;

        // Files are uploaded to ImageKit in the middleware, URLs are in req.files
        // Assuming middleware puts the URLs in req.body or we handle it here if using memory storage
        // For this implementation, let's assume the upload middleware handles the upload and attaches URLs to req.files

        // Note: The actual upload logic depends on how the 'upload' middleware is implemented. 
        // If using 'multer-storage-imagekit' or similar, it might be automatic.
        // If using memory storage, we need to upload here.
        // Let's assume we use memory storage and upload here for better control or the middleware does it.
        // Based on requirements: "Use multer to stream files directly to ImageKit"

        // We will implement the upload logic in the middleware or here. 
        // Let's assume the middleware attaches the file buffers or paths.

        // However, to keep controller clean, let's assume the middleware `upload.js` handles the upload to ImageKit 
        // and attaches the URLs to `req.body` or `req.files`.
        // Let's refine this: The prompt says "Use multer to stream files directly to ImageKit".
        // We'll implement a helper or do it in the route handler. 
        // For simplicity, let's assume `req.files` contains the uploaded file info.

        if (!req.files || !req.files.coverImage || !req.files.infographicImages) {
            return res.status(400).json({ message: 'Cover and at least one Infographic image are required' });
        }

        const { isPremium, affiliateLink } = req.body; // Read isPremium and affiliateLink from request

        // Upload to ImageKit
        const uploadFile = async (file, fileName) => {
            return new Promise((resolve, reject) => {
                imagekit.upload({
                    file: file.buffer, // required
                    fileName: fileName, // required
                    folder: '/glanceread/books'
                }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            });
        };

        // Upload Cover
        const coverImageResult = await uploadFile(req.files.coverImage[0], `cover-${Date.now()}`);

        // Upload All Infographics
        const infographicImagePromises = req.files.infographicImages.map((file, index) =>
            uploadFile(file, `infographic-${Date.now()}-${index}`)
        );
        const infographicImageResults = await Promise.all(infographicImagePromises);
        const infographicUrls = infographicImageResults.map(res => res.url);

        const newBook = new Book({
            title,
            author,
            category,
            affiliateLink,
            coverImage: coverImageResult.url,
            infographicImages: infographicUrls,
            isPremium: isPremium === 'true' || isPremium === true // Handle string or boolean
        });

        const book = await newBook.save();
        res.json(book);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Optional: Delete images from ImageKit here if needed (skipping for now to avoid complexity with fileIds)

        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: 'Book removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.updateBook = async (req, res) => {
    try {
        const { title, author, category, affiliateLink, isPremium } = req.body;

        // Build update object
        const bookFields = {};
        if (title) bookFields.title = title;
        if (author) bookFields.author = author;
        if (category) bookFields.category = category;
        if (affiliateLink !== undefined) bookFields.affiliateLink = affiliateLink;
        if (isPremium !== undefined) bookFields.isPremium = isPremium;

        let book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        book = await Book.findByIdAndUpdate(
            req.params.id,
            { $set: bookFields },
            { new: true }
        );

        res.json(book);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Track affiliate clicks
exports.trackAffiliateClick = async (req, res) => {
    try {
        const { source, userId } = req.body;
        const bookId = req.params.id;

        // Validate book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Create click record
        const affiliateClick = new AffiliateClick({
            bookId,
            userId: userId || null,
            source: source || 'other',
            userAgent: req.headers['user-agent'],
            referrer: req.headers['referer'] || req.headers['referrer']
        });

        await affiliateClick.save();

        // Update book with click count (optional - add field to Book model)
        await Book.findByIdAndUpdate(bookId, {
            $inc: { affiliateClicks: 1 }
        });

        res.json({ success: true, message: 'Click tracked' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Tracking failed' });
    }
};

// Get affiliate analytics for a book
exports.getAffiliateAnalytics = async (req, res) => {
    try {
        const bookId = req.params.id;

        // Total clicks
        const totalClicks = await AffiliateClick.countDocuments({ bookId });

        // Clicks by source
        const clicksBySource = await AffiliateClick.aggregate([
            { $match: { bookId: require('mongoose').Types.ObjectId(bookId) } },
            { $group: { _id: '$source', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Clicks over time (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const clicksOverTime = await AffiliateClick.aggregate([
            {
                $match: {
                    bookId: require('mongoose').Types.ObjectId(bookId),
                    timestamp: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Unique users who clicked
        const uniqueUsers = await AffiliateClick.distinct('userId', {
            bookId,
            userId: { $ne: null }
        });

        res.json({
            totalClicks,
            clicksBySource,
            clicksOverTime,
            uniqueUsersCount: uniqueUsers.length
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch analytics' });
    }
};

