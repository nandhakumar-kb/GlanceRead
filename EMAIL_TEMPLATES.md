# 📧 Affiliate Email Automation Templates

## Setup Instructions

### 1. **Email Service Integration**
Use a free email service like:
- **SendGrid** (100 emails/day free)
- **Mailgun** (5,000 emails/month free)
- **AWS SES** (62,000 emails/month free)

### 2. **Implementation**
Add these endpoints to your backend to send automated emails.

---

## Email Template 1: "Just Finished Reading"
**Trigger:** User completes reading a book  
**Timing:** Immediately after  
**Goal:** Capitalize on high engagement

### Subject Line:
```
Loved {{bookTitle}}? Get the Full Book with 30% OFF 🎁
```

### Email Body:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316, #ec4899); padding: 30px; text-align: center; color: white; border-radius: 10px; }
        .content { background: #f8f9fa; padding: 30px; margin: 20px 0; border-radius: 10px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #f97316, #ec4899); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        .social-proof { background: #fff; padding: 15px; border-left: 4px solid #f97316; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 You Just Finished "{{bookTitle}}"!</h1>
        </div>
        
        <div class="content">
            <p>Hi {{userName}},</p>
            
            <p>Great job finishing the summary of <strong>{{bookTitle}}</strong>! We hope you enjoyed the key insights.</p>
            
            <p><strong>Want to dive deeper?</strong> The full book has:</p>
            <ul>
                <li>✓ Detailed case studies and real-world examples</li>
                <li>✓ Actionable exercises and worksheets</li>
                <li>✓ Stories that inspire lasting change</li>
            </ul>
            
            <div class="social-proof">
                <strong>⭐ 4.5/5 rating</strong> from 2,341+ readers<br>
                <em>"This book changed my life!" - Amazon Review</em>
            </div>
            
            <p><strong>Special Offer:</strong> Get 30% OFF for the next 24 hours!</p>
            
            <center>
                <a href="{{affiliateLink}}" class="btn">
                    📚 Get Full Book - 30% OFF
                </a>
            </center>
            
            <p style="font-size: 12px; color: #666;">
                *This is an affiliate link. We earn a small commission at no extra cost to you.
            </p>
        </div>
        
        <div class="footer">
            <p>Happy Reading! 📖<br>Team GlanceRead</p>
            <p><a href="{{unsubscribeLink}}">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>
```

---

## Email Template 2: "Still Thinking?"
**Trigger:** User clicked affiliate link but didn't purchase  
**Timing:** 2 days after click  
**Goal:** Overcome objections, provide social proof

### Subject Line:
```
{{bookTitle}} is waiting for you... (Free chapter inside!)
```

### Email Body:
```html
<!DOCTYPE html>
<html>
<body>
    <div class="container">
        <h2>Hey {{userName}},</h2>
        
        <p>We noticed you were interested in <strong>{{bookTitle}}</strong> but haven't grabbed it yet.</p>
        
        <p><strong>Here's why 2,000+ readers love this book:</strong></p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3>Top Reader Reviews:</h3>
            <blockquote>"This book completely changed how I think about {{topic}}!"</blockquote>
            <blockquote>"I wish I'd read this 10 years ago."</blockquote>
            <blockquote>"Clear, practical, and life-changing."</blockquote>
        </div>
        
        <p><strong>Still undecided?</strong> Here's a FREE sample chapter to help you decide:</p>
        
        <center>
            <a href="{{sampleChapterLink}}" class="btn">📖 Read Free Chapter</a>
        </center>
        
        <p style="margin-top: 30px;">Ready to get the full book?</p>
        <center>
            <a href="{{affiliateLink}}" class="btn">Get Full Book Now</a>
        </center>
    </div>
</body>
</html>
```

---

## Email Template 3: "Book Bundle Offer"
**Trigger:** User reads 3+ books in a category  
**Timing:** After 3rd book  
**Goal:** Upsell book bundles

### Subject Line:
```
Love {{category}} books? Get these 3 bestsellers (Save ₹450!)
```

### Email Body:
```html
<!DOCTYPE html>
<html>
<body>
    <div class="container">
        <h2>We noticed you love {{category}} books! 📚</h2>
        
        <p>Based on your reading, we've curated the perfect book bundle for you:</p>
        
        <div style="background: #fff; border: 2px solid #f97316; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #f97316;">Ultimate {{category}} Bundle</h3>
            
            <ul>
                <li><strong>{{book1}}</strong> - ₹599</li>
                <li><strong>{{book2}}</strong> - ₹449</li>
                <li><strong>{{book3}}</strong> - ₹399</li>
            </ul>
            
            <p><del style="color: #999;">Regular Price: ₹1,447</del></p>
            <h2 style="color: #f97316;">Bundle Price: ₹999 (Save ₹450!)</h2>
        </div>
        
        <center>
            <a href="{{bundleLink}}" class="btn">Get Bundle - Save ₹450</a>
        </center>
        
        <p style="font-size: 12px; color: #666; text-align: center;">
            Offer expires in 48 hours ⏰
        </p>
    </div>
</body>
</html>
```

---

## Email Template 4: "Reading Challenge"
**Trigger:** Monthly newsletter  
**Timing:** 1st of every month  
**Goal:** Engagement + multiple affiliate sales

### Subject Line:
```
🏆 January Reading Challenge: Read 5 Books, Win Prizes!
```

### Email Body:
```html
<!DOCTYPE html>
<html>
<body>
    <div class="container">
        <div class="header">
            <h1>🏆 This Month's Reading Challenge</h1>
        </div>
        
        <div class="content">
            <h2>Challenge: Read 5 Books in 30 Days</h2>
            
            <p><strong>Prizes:</strong></p>
            <ul>
                <li>🥇 1st Place: ₹1,000 Amazon Gift Card</li>
                <li>🥈 2nd-5th Place: Free Lifetime Subscription</li>
                <li>🎁 All Participants: Exclusive book discount codes</li>
            </ul>
            
            <h3>Recommended Books for This Challenge:</h3>
            
            <div style="display: grid; gap: 20px; margin: 20px 0;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px;">
                    <h4>1. {{book1Title}}</h4>
                    <p>{{book1Description}}</p>
                    <a href="{{book1AffiliateLink}}" class="btn">Get Book →</a>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px;">
                    <h4>2. {{book2Title}}</h4>
                    <p>{{book2Description}}</p>
                    <a href="{{book2AffiliateLink}}" class="btn">Get Book →</a>
                </div>
                
                <!-- Repeat for books 3-5 -->
            </div>
            
            <center>
                <a href="{{challengeLink}}" class="btn">Join Challenge Now</a>
            </center>
        </div>
    </div>
</body>
</html>
```

---

## Backend Implementation

### 1. **Send Email on Book Completion**

```javascript
// server/controllers/emailController.js
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendBookCompletionEmail = async (userId, bookId) => {
    try {
        const user = await User.findById(userId);
        const book = await Book.findById(bookId);
        
        if (!book.affiliateLink) return; // Skip if no affiliate link
        
        const msg = {
            to: user.email,
            from: 'hello@glanceread.com',
            subject: `Loved ${book.title}? Get the Full Book with 30% OFF 🎁`,
            html: renderEmailTemplate('book-completion', {
                userName: user.username,
                bookTitle: book.title,
                affiliateLink: book.affiliateLink,
                unsubscribeLink: `${process.env.CLIENT_URL}/unsubscribe?id=${user._id}`
            })
        };
        
        await sendgrid.send(msg);
        console.log('Book completion email sent');
    } catch (err) {
        console.error('Email send failed', err);
    }
};
```

### 2. **Trigger in Progress Update**

```javascript
// server/controllers/userController.js
exports.updateProgress = async (req, res) => {
    try {
        const { bookId, progress, sessionTime } = req.body;
        
        // ... existing progress update code ...
        
        // If user completed the book (100% progress)
        if (progress === 100) {
            // Send email after 5 minutes (user likely finished viewing)
            setTimeout(() => {
                sendBookCompletionEmail(req.user.id, bookId);
            }, 5 * 60 * 1000);
        }
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update progress' });
    }
};
```

---

## A/B Testing Email Subjects

Test these variations to see what converts best:

### For Book Completion:
1. "Loved {{bookTitle}}? Get 30% OFF the Full Book 🎁"
2. "{{userName}}, here's your exclusive discount on {{bookTitle}}"
3. "You just unlocked a special offer on {{bookTitle}}"
4. "Want more? Get {{bookTitle}} with limited-time discount"

### For Re-engagement:
1. "Still thinking about {{bookTitle}}?"
2. "Free chapter: {{bookTitle}} is waiting for you"
3. "2,341+ readers bought this. Here's why..."
4. "Your {{bookTitle}} discount expires in 24 hours"

---

## Expected Results

### Email Open Rates:
- Book completion email: **35-45%** (high engagement)
- Retargeting email: **20-30%**
- Newsletter: **15-25%**

### Click-Through Rates:
- Book completion: **10-15%** (click affiliate link)
- Retargeting: **5-8%**
- Bundle offers: **12-18%**

### Conversion (Email Click → Purchase):
- Immediate (within 1 hour): **5-8%**
- Within 24 hours: **10-15%**
- Within 7 days: **15-20%**

### Revenue Impact:
At 10,000 users/month:
- 3,000 books completed
- 1,050 email opens (35%)
- 150 clicks to affiliate link (10% of opens)
- 23 purchases (15% conversion)
- **₹828/month** from email automation alone

---

## Compliance & Best Practices

✅ **Always include unsubscribe link**  
✅ **Disclose affiliate links**  
✅ **Don't spam - max 2-3 emails/week**  
✅ **Personalize with user's name and reading history**  
✅ **Test subject lines and CTAs**  
✅ **Track open rates and optimize**

---

Ready to implement? Start with Template 1 (book completion email) for immediate results! 🚀
