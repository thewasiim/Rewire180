# Website Structure Documentation
## "Rewire 180" - Personal Transformation Coaching Platform

**Website Title:** Thewasiim  
**Total Pages:** 1 Single Page Website  
**Total Sections:** 6 Main Sections + Navigation + Footer

---

## 📋 COMPLETE WEBSITE BREAKDOWN

### **PAGE 1: Single Landing Page (index.html)**
This is a single-page website with multiple sections. Users navigate using anchor links in the navigation menu.

---

## 🗂️ DETAILED SECTION BREAKDOWN

### **SECTION 1: NAVIGATION BAR (Navbar)**
**ID:** `.main-navbar`  
**Location:** Fixed at the top of the page  
**Purpose:** Main navigation hub for the entire website

**Components:**
- **Logo:** "Rewire 180" with blue accent color on "180"
- **Desktop Navigation Links:**
  - Home (#home)
  - Skills (#skills)
  - Pricing (#vip-pricing)
  - Reviews (#reviews-section)
- **Mobile Menu (Hamburger):**
  - Same links as desktop for mobile responsiveness
  - Hamburger icon with 3 horizontal lines that toggle mobile menu open/close
  - Mobile menu slides down when hamburger is clicked
- **Features:**
  - Fixed positioning (stays at top while scrolling)
  - Semi-transparent background with blur effect
  - Responsive design (hides desktop nav on mobile, shows hamburger instead)

**JavaScript Functionality (navbar.js):**
- Toggle mobile menu on hamburger click
- Close menu when user clicks a link
- Close menu on ESC key press
- Prevent body scrolling when mobile menu is open

---

### **SECTION 2: HERO SECTION**
**ID:** `hero-section` / `#home`  
**Location:** Right below navbar  
**Purpose:** First impression and main call-to-action

**Components:**

1. **Eyebrow Text:**
   - "180 DAY TRANSFORMATION PROGRAM"
   - Small text above main headline for credibility

2. **Main Headline:**
   - "180 days to transform your body and build the confidence that lasts."
   - Large, bold text that communicates the core promise

3. **Subtitle:**
   - "In 180 days I help busy professionals build a strong body and unshakeable confidence and mindset without sacrificing their time."
   - Explains the value proposition and target audience

4. **Hero Video:**
   - Embedded YouTube video (b8YBOubZ29k)
   - Full-width responsive iframe
   - Shows the coaching methodology or testimonial

5. **Call-to-Action (CTA) Button:**
   - "START" button (blue background with subtle shadow)
   - Links to pricing section (#vip-pricing)
   - Hover effect: Lifts up with enhanced shadow
   - Encourages users to take the first step

**Purpose:** Capture attention and convince visitors to explore the program

---

### **SECTION 3: SKILLS / VIDEOS SECTION**
**ID:** `video-section-container` / `#skills`  
**Location:** Below hero section  
**Purpose:** Showcase the coaching approach with video content

**Components:**

1. **First Video Card:**
   - Embedded YouTube video (VIDEO_ID_1)
   - Description: "Follow this step-by-step system to build a strong body and unstoppable confidence."
   - "JOIN NOW" button links to #vip-pricing (VIP section)
   - Blue button with hover lift effect

2. **Second Video Card:**
   - Embedded YouTube video (VIDEO_ID_2)
   - Description: "Learn how to stay consistent, disciplined, and mentally sharp for life."
   - "JOIN NOW" button links to #method-pricing (Method Pricing)
   - Blue button with hover lift effect

**Purpose:** Educate prospects on the training methodology and build trust through visual content

---

### **SECTION 4: REVIEWS SECTION (Parts A & B)**

#### **Part A: Screenshot Reviews Grid**
**Class:** `.reviews-ss` / `#reviews-section`  
**Purpose:** Quick social proof using review screenshots

**Components:**
- **Header:**
  - "OUR REVIEWS" eyebrow text
  - "What Do Other Business Owners Say About The Mentorship?"
- **Review Grid:** 5 screenshot images (r1.png through r5.png)
  - Visual testimonials from satisfied clients
  - Grid layout for professional presentation

---

#### **Part B: Detailed Video Reviews**
**Class:** `.reviews-section`  
**Location:** Below screenshot reviews  
**Purpose:** Deeper social proof with actual client testimonials

**Components:**

1. **Review 1:**
   - Text testimonial about client success (first 4 clients signed)
   - Video testimonial (v1.mp4)

2. **Review 2:**
   - Text testimonial about business clarity and growth
   - Video testimonial (v2.mp4)

3. **Review 3:**
   - Text testimonial about follower growth and system clarity
   - Video testimonial (v3.mp4)

4. **Review 4:**
   - Text testimonial about execution and real results
   - Video testimonial (v4.mp4)

**Purpose:** Build credibility through detailed social proof and client success stories

---

### **SECTION 5: PRICING SECTION (Parts A & B)**

#### **Part A: The 180 Method (Primary)**
**ID:** `method-pricing` / `#method-pricing`  
**Purpose:** Main coaching program for most clients (appears first)

**Components:**

1. **Title:** "The 180 Method™" (with gold accent on "180")
2. **Type:** "PRIVATE COACHING"

3. **What You Get (Includes):**
   - Personalised weekly training (with gold checkmarks)
   - Tailored nutrition updates
   - Private coaching app access
   - Weekly check-ins
   - Daily accountability & motivation
   - Group video calls
   - Mindset coaching & confidence-building exercises
   - Practical strategies to believe in yourself and take consistent action
   - Train anywhere, anytime

4. **Important Note:** "This program requires honesty, effort, and willingness to challenge your mindset. Excuses and quitting aren't allowed."

5. **Program Options:**
   - **Option 1 – Monthly:** £1,000/month (gold text)
   - **Option 2 – Paid in Full:** £6,000 upfront (gold text)
   - Two-column layout with divider separator

6. **Warning:** "This is an investment in structure, accountability, and proximity. If you're looking for cheap coaching, this is not for you."

7. **CTA Button:** "Apply & Enrol" (red background with hover shadow)

**Styling Features:**
- Gold-colored pricing and accents
- Checkmarks in gold on list items
- Two-column pricing grid with decorative divider
- Red call-to-action button

---

#### **Part B: VIP Private Coaching (Premium)**
**ID:** `vip-pricing` / `#vip-pricing`  
**Purpose:** Premium coaching option for high-commitment clients (appears second)

**Components:**
- **Title:** "VIP" (gold accent) "Private Coaching"
- **Type:** "IN PERSON"
- **Note:** "Willing to relocate" (italic, gold color)
- **Description:** "Fully immersive coaching for clients who want a total transformation in body, mind, and confidence. 2–4 week intensive. UK & international. Includes training, nutrition, lifestyle, and mindset mastery."
- **Pricing Block:**
  - UK: Starting from £10,000 (gold text)
  - Abroad: Starting from £20,000 (gold text)
  - Top divider separating from description
- **Warning:** "This is an investment in structure, accountability, and proximity. If you're looking for cheap coaching, this is not for you."
- **CTA Button:** "Request VIP Consideration" (red background with hover shadow)

**Styling Features:**
- Subtle textured background with rounded corners
- Gold border accent
- Gold text for title span and "Willing to relocate"
- Red call-to-action button with shadow effect
- Professional card layout with blur backdrop

---

### **SECTION 6: FOOTER**
**Class:** `.site-footer`  
**Location:** Bottom of page  
**Purpose:** Additional navigation and legal information

**Components:**

1. **Left Section:**
   - Logo: "Rewire" + "180" (blue accent)
   - **Social Media Icons with Download Links:**
     - Instagram SVG (pink icon, 18×18px) - Downloads instagram.csv
     - YouTube SVG (red icon, 18×18px) - Downloads youtube.csv
     - TikTok SVG (black icon, 18×18px) - Downloads tiktok.csv
     - **Hover Effects:** Each icon lifts up with brand-colored shadow
       - Instagram: Pink/magenta shadow
       - YouTube: Red shadow
       - TikTok: Dark/black shadow

2. **Center Section (Legal Links):**
   - Support
   - Acceptable Use Policy
   - Privacy Policy (active state)
   - Consumer Goods Terms & Conditions
   - Piracy Policy
   - Refund Policy

3. **Right Section:**
   - Empty (SIGN IN button removed)

4. **Bottom:**
   - "POWERED BY TheWasiim"

**Purpose:** Provide legal compliance, social media downloads with hover effects, and secondary navigation

---

## 📊 VISUAL LAYOUT SUMMARY

```
┌─────────────────────────────────────┐
│   NAVBAR (Fixed at Top)             │
│ Logo | Menu | Hamburger (Mobile)    │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│  SECTION 1: HERO                    │
│  - Eyebrow text                     │
│  - Main headline & subtitle         │
│  - YouTube video                    │
│  - START button                     │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│  SECTION 2: SKILLS (Videos)         │
│  - 2 video cards                    │
│  - Descriptions & JOIN buttons      │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│  SECTION 3A: REVIEWS (Screenshots)  │
│  - Header with "OUR REVIEWS"        │
│  - 5 screenshot images              │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│  SECTION 3B: REVIEWS (Videos)       │
│  - 4 detailed client testimonials   │
│  - Text + Video for each            │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│  SECTION 4A: 180 METHOD PRICING     │
│  - Main coaching program (1st)      │
│  - Gold pricing & checkmarks        │
│  - £1k/month or £6k upfront         │
│  - "Apply & Enrol" button (red)     │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│  SECTION 4B: VIP PRICING            │
│  - Premium in-person option (2nd)   │
│  - Gold accents and border          │
│  - £10k-£20k pricing                │
│  - "Request VIP" button (red)       │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│  FOOTER                             │
│  Logo | Legal Links | Social | SignIn│
└─────────────────────────────────────┘
```

---

## 🎯 USER JOURNEY

1. **Land on page** → See Hero section with main promise
2. **Convinced?** → Click "START" to jump to #vip-pricing
3. **Want proof?** → Scroll to Skills videos (methodology)
4. **First JOIN button** → Links to #vip-pricing (VIP section)
5. **Second JOIN button** → Links to #method-pricing (180 Method)
6. **Need social proof?** → See Reviews section (screenshots + videos)
7. **Ready to buy?** → View Pricing options (180 Method first, then VIP)
8. **Download contacts?** → Click footer social icons to download CSV files

---

## 📱 RESPONSIVE FEATURES

- **Navbar:** Hamburger menu on mobile, full menu on desktop
- **Videos:** Full-width responsive iframes
- **Grid Layouts:** Auto-adjust from desktop to mobile
- **Mobile Menu:** Toggleable with keyboard support (ESC to close)

---

## 🔧 FILES USED

- **index.html** - Main structure and content
- **hero.css** - All styling for responsive design (buttons, pricing, footer, hover effects)
- **navbar.js** - JavaScript for mobile menu toggle functionality
- **downloads/instagram.csv** - Instagram contact data (for footer download)
- **downloads/youtube.csv** - YouTube channel data (for footer download)
- **downloads/tiktok.csv** - TikTok contact data (for footer download)

---

## ✨ KEY STYLING UPDATES (Latest Changes)

- **Buttons:** All CTAs now have consistent blue/red styling with lift + shadow on hover
- **Pricing Section Order:** 180 Method (primary) appears before VIP (premium)
- **VIP Section:** Gold accents, red CTA button, textured background
- **Method Section:** Gold pricing text, gold checkmarks on features, red CTA
- **Footer Social Icons:** SVG images (18×18px) with brand-color hover shadows
- **Footer:** Sign-in button removed, replaced with CSV download functionality
- **Removed:** Sign-in link, default shadow on START button

**Last Updated:** February 4, 2026
