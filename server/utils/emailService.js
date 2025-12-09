const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Easy start for MVP (Requires App Password) or use SMTP
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendWelcomeEmail = async (email, username, referralCode) => {
    try {
        const mailOptions = {
            from: '"GlanceRead" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: 'Welcome to GlanceRead! 📚 Here are 5 Free Books',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #4F46E5;">Welcome to GlanceRead, ${username}! 🚀</h2>
                    <p>You've just joined the smartest community of readers. To get you started, we've unlocked <strong>5 Premium Books</strong> for you.</p>
                    
                    <h3>🎁 Your Free Trial is Active!</h3>
                    <p>You have <strong>7 Days of Premium Access</strong>. Read as much as you can!</p>
                    
                    <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; font-weight: bold;">Invite Friends & Get Free Months:</p>
                        <p style="margin: 5px 0 0 0; color: #4F46E5;">Your Code: ${referralCode}</p>
                    </div>

                    <a href="https://glanceread.com" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Reading Now</a>
                    
                    <p style="margin-top: 30px; font-size: 12px; color: #6B7280;">If you verify your payment via GPay, you get instant Lifetime access!</p>
                </div>
            `
        };

        if (process.env.EMAIL_USER) {
            await transporter.sendMail(mailOptions);
            console.log(`[EMAIL] Welcome sent to ${email}`);
        } else {
            console.log(`[EMAIL MOCK] Welcome email would go to ${email} (Configure ENV to send real mail)`);
        }
    } catch (error) {
        console.error('[EMAIL ERROR]', error);
    }
};
