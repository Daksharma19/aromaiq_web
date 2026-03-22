# AromaIQ — Full-Stack Website Build Prompt

---

## PROJECT OVERVIEW

Build a full-stack startup + ecommerce website for **AromaIQ** — an AI-powered smart aroma diffuser that reads the user's mood and automatically selects and activates the right essential oil blend. The site serves two goals simultaneously: (1) sell the diffuser and scent refills, and (2) capture a pre-launch waitlist with early-bird pricing.

The tone is **dark luxury** — not tech-startup, not generic wellness. Think Jo Malone meets Sonos. Expensive, quiet, confident. Every detail should feel like a premium physical product brand.

---

## TECH STACK

```
Framework:      Next.js 14 (App Router)
Styling:        Tailwind CSS v3 (custom config)
Animation:      Framer Motion v11
Background FX:  React Bits — "Aurora" / "Color Bends" (reactbits.dev) for inner sections
Fonts:          Cormorant Garant (display/headings) + DM Sans (body/UI)
                → Load via next/font from Google Fonts
Icons:          Lucide React
Forms:          React Hook Form + Zod validation
State:          Zustand (cart state)
Backend:        Next.js API Routes (App Router)
Database:       Prisma + PostgreSQL (Supabase)
Auth:           None needed (guests can checkout)
Payments:       Razorpay (Indian payment gateway)
Email:          Resend (waitlist confirmation emails)
Deployment:     Vercel
```

---

## DESIGN TOKENS — HARDCODE THESE EVERYWHERE

```js
// tailwind.config.js — extend colors like this:
colors: {
  obsidian: '#0E0C0A',      // primary background
  'obsidian-light': '#1A1714', // cards, surfaces
  'obsidian-mid': '#2C2520',   // elevated surfaces
  gold: '#C9A96E',             // primary accent, CTAs
  'gold-light': '#E8C98A',     // hover states
  'gold-muted': '#8A6E47',     // subtle gold
  ivory: '#F5EDD8',            // primary text on dark
  'ivory-muted': '#C4B89A',    // secondary text
  walnut: '#3D2B1F',           // dark warm brown
  'walnut-light': '#7A5C3C',   // medium warm brown
}

// Typography scale
fontFamily: {
  display: ['Cormorant Garant', 'serif'],   // all headings, hero text
  body: ['DM Sans', 'sans-serif'],          // all UI, body copy, nav
}
```

**Typography rules:**
- All `<h1>` through `<h3>` → `font-display`, light weight (300–400), large tracking
- All body copy, buttons, labels, nav → `font-body`
- Hero headline: `text-6xl md:text-8xl lg:text-9xl font-display font-light tracking-tight`
- Section headings: `text-4xl md:text-5xl font-display font-light italic`
- NEVER use bold on display font — the elegance comes from weight contrast

---

## FILE STRUCTURE

```
/app
  layout.tsx              ← Root layout, fonts, metadata
  page.tsx                ← Home page (assembles all sections)
  /shop
    page.tsx              ← Shop / product listing
    /[slug]
      page.tsx            ← Individual product page
  /waitlist
    page.tsx              ← Dedicated waitlist page
  /api
    /waitlist
      route.ts            ← POST: save email to DB, send Resend email
    /orders
      route.ts            ← POST: create Razorpay order
    /payment
      /verify
        route.ts          ← POST: verify Razorpay signature
/components
  /layout
    Navbar.tsx
    Footer.tsx
  /sections
    HeroSection.tsx
    ProblemSolution.tsx
    HowItWorks.tsx
    HardwareShowcase.tsx
    ScentLibrary.tsx
    AppPreview.tsx
    SocialProof.tsx
    ScienceSection.tsx
    ShopSection.tsx
    WaitlistSection.tsx
    FoundersSection.tsx
    FAQSection.tsx
  /ui
    Button.tsx
    ScentCard.tsx
    ProductCard.tsx
    CartDrawer.tsx
    CountdownTimer.tsx
    WaitlistForm.tsx
    MoodFilter.tsx
  /backgrounds
    ColorBends.tsx        ← React Bits wrapper component
    VideoBackground.tsx   ← Hero video wrapper
/lib
  prisma.ts
  razorpay.ts
  resend.ts
  cart-store.ts           ← Zustand cart
/prisma
  schema.prisma
```

---

## DATABASE SCHEMA (Prisma)

```prisma
model WaitlistEntry {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}

model Product {
  id          String      @id @default(cuid())
  slug        String      @unique
  name        String
  description String
  price       Float
  type        ProductType // DIFFUSER | SCENT_BOTTLE | BUNDLE
  imageUrl    String
  inStock     Boolean     @default(true)
  OrderItem   OrderItem[]
}

model Order {
  id              String      @id @default(cuid())
  razorpayOrderId String      @unique
  razorpayPaymentId String?
  status          OrderStatus @default(PENDING)
  total           Float
  customerEmail   String
  customerName    String
  customerPhone   String
  items           OrderItem[]
  createdAt       DateTime    @default(now())
}

model OrderItem {
  id        String  @id @default(cuid())
  order     Order   @relation(fields: [orderId], references: [id])
  orderId   String
  product   Product @relation(fields: [productId], references: [id])
  productId String
  quantity  Int
  price     Float
}

enum ProductType { DIFFUSER SCENT_BOTTLE BUNDLE }
enum OrderStatus { PENDING PAID FAILED REFUNDED }
```

---

## COMPONENT-BY-COMPONENT SPECS

---

### `Navbar.tsx`

- Sticky, `position: fixed`, full width
- Background: transparent initially → on scroll past 80px, transition to `bg-obsidian/90 backdrop-blur-md border-b border-gold/10`
- Use Framer Motion `useScroll` to drive the background opacity
- Left: AromaIQ logo in `font-display text-xl text-ivory tracking-widest` — the "IQ" in gold
- Center (desktop): nav links `Shop · How It Works · Scents · Our Story` in `font-body text-sm text-ivory-muted uppercase tracking-widest hover:text-gold transition`
- Right: Cart icon (Lucide `ShoppingBag`) with item count badge in gold + "Pre-order" CTA button
- Mobile: hamburger → full-screen overlay menu with Framer Motion staggered link entries
- The "Pre-order" button: `border border-gold text-gold hover:bg-gold hover:text-obsidian transition-all duration-300 px-5 py-2 text-sm font-body tracking-wider`

---

### `HeroSection.tsx` — VIDEO BACKGROUND

**This is the most important section. Take the most care here.**

```
Layout:
  - Full viewport height (100svh)
  - Video fills the entire background (object-cover, autoplay, muted, loop, playsInline)
  - Over the video: a layered overlay system:
      Layer 1: bg-obsidian/60  (darkens the video)
      Layer 2: linear-gradient from obsidian (bottom 30%) to transparent (upward)
      Layer 3: subtle noise texture SVG overlay at 3% opacity (for film grain feel)
  - Video source: /public/videos/hero.mp4 (placeholder path — user will replace)
  - Fallback poster image: /public/images/hero-poster.jpg
```

**Content layout (centered, stacked):**
```
[tiny label]  "POWERED BY AI · EST. 2025"  ← font-body, gold, tracking-[0.3em], text-xs

[headline]
  "Breathe
   Differently."                            ← font-display, 7xl-9xl, ivory, font-light
                                             ← "Differently" has a thin gold underline (CSS)
                                             ← Animate: each word slides up + fades in, 150ms stagger

[subheadline]
  "AromaIQ reads your mood and fills the    ← font-body, ivory-muted, text-lg, max-w-md, centered
   room with exactly what you need."

[CTA row]
  [Primary]  "Shop Now"                     ← gold bg, obsidian text
  [Secondary] "Join Waitlist"               ← border gold, gold text → hover fills gold

[scroll indicator]
  Animated chevron-down in gold             ← subtle bounce animation
  "Scroll to explore" text
```

**Framer Motion entrance:** Use `AnimatePresence` + `motion.div` with `initial={{ opacity: 0, y: 40 }}` → `animate={{ opacity: 1, y: 0 }}` with staggered `delay` per element (0.3s, 0.6s, 0.9s, 1.2s)

---

### `ProblemSolution.tsx` — COLOR BENDS BACKGROUND

```
Background: <ColorBends /> from React Bits
  - Colors: obsidian, walnut, gold (dark and warm, NOT bright/neon)
  - Wrap in a dark overlay: bg-obsidian/70 to keep text readable
  - The Color Bends should be SUBTLE — this is luxury, not a rave

Layout: Two-column split on desktop, stacked on mobile
  Left column:
    Small label: "THE PROBLEM"
    Heading: "Generic diffusers
              can't read a room."   ← font-display, italic, 4xl
    Body: Two paragraphs about how aromatherapy is powerful but
          manual blending is guesswork and effort
    3 pain-point items with thin gold left-border lines:
      — "15 oils. No idea which to use."
      — "Wrong scent ruins the whole mood."
      — "Timers, apps, manual switches — all friction."

  Right column:
    Small label: "THE SOLUTION"  
    Heading: "AromaIQ thinks
              for you."
    Body: AI detects time of day, ambient context, and your usage
          patterns. Selects and blends automatically.
    3 feature pills (border gold/10, bg obsidian-light):
      ✦ Mood-aware AI engine
      ✦ 4-chamber precision diffuser  
      ✦ Zero-friction mobile control
```

---

### `HowItWorks.tsx` — COLOR BENDS BACKGROUND

```
Background: <ColorBends /> with slower animation, warmer gold/walnut tones

Section heading: "Three steps to
                  perfect ambience."   ← centered, font-display, italic

Layout: Horizontal stepper on desktop, vertical on mobile

Step cards (3 total) — each card:
  - bg-obsidian-light border border-gold/15 rounded-2xl p-8
  - Large step number: "01" "02" "03" in font-display text-6xl text-gold/20
  - Icon: custom SVG (phone, brain/sparkle, diffuser waves)
  - Step heading: font-display text-2xl ivory
  - Step body: font-body text-ivory-muted text-sm leading-relaxed

  Step 01: "Open the app"
           "Set your mood, activity, or just let AromaIQ decide automatically."

  Step 02: "AI selects your blend"
           "Our engine picks from 15 essential oils based on your mood profile and time of day."

  Step 03: "Your room transforms"
           "The 4-chamber diffuser activates within seconds. Adjust intensity anytime."

Between steps: thin gold horizontal connector line (desktop only) with animated
               travelling dot (Framer Motion keyframes, gold dot sliding left to right)
```

---

### `HardwareShowcase.tsx`

```
Background: solid bg-obsidian (no effect — let the product breathe)

Layout: Sticky scroll section
  - Use Framer Motion useScroll + useTransform for parallax
  - Large centered product image/video on the right (60% width)
  - On scroll, 4 feature callouts appear sequentially on the left:

    Callout 1 (appears at 0% scroll through section):
      "Four Independent Chambers"
      "Each module controls a separate essential oil.
       Mix up to 4 scents simultaneously."

    Callout 2 (25% scroll):
      "ESP32 Precision Control"
      "MOSFET-driven misting modules with
       millisecond response time."

    Callout 3 (50% scroll):
      "WiFi + Bluetooth Ready"
      "Seamless connection to the AromaIQ app.
       No hub required."

    Callout 4 (75% scroll):
      "Whisper-Quiet Operation"  
      "Below 30dB. You'll smell it before you hear it."

  - Each callout: number dot (gold) + heading (font-display ivory) + body (font-body ivory-muted)
  - Active callout: full opacity. Inactive: opacity-30. Smooth Framer transition.

  Connector lines: thin gold vertical line on the left, connecting all 4 dots
```

---

### `ScentLibrary.tsx` — COLOR BENDS BACKGROUND

```
Background: <ColorBends /> — cooler, more subtle variant

Section heading: "Fifteen oils.
                  Every mood."

Mood filter tabs (horizontal scroll on mobile):
  [ All ] [ Calm ] [ Focus ] [ Energy ] [ Sleep ] [ Romance ]
  — Active tab: bg-gold text-obsidian
  — Inactive: border border-gold/30 text-ivory-muted

  Filter mapping:
    Calm:    Lavender, Vetiver, Sandalwood, Chamomile
    Focus:   Peppermint, Eucalyptus, Bergamot, Rosemary
    Energy:  Grapeseed, Green Apple, Marigold, Citrus
    Sleep:   Cedarwood, Vetiver, Mogra, Vanilla
    Romance: Rose, Ylang Ylang, Sandalwood, Vanilla

Oil cards grid (4 cols desktop, 2 cols mobile):
  Each card — bg-obsidian-light rounded-xl border border-white/5 p-5 hover:border-gold/30
    - Scent name: font-display text-xl ivory
    - Origin/type: font-body text-xs text-gold uppercase tracking-widest  
    - Short mood description: "Grounds the mind. Earthy warmth."
    - Mood tag pills: rounded-full bg-gold/10 text-gold text-xs px-3 py-1
    - "Add to Kit" button (appears on hover with Framer Motion)

  Full scent list to seed:
    Cedarwood, Ylang Ylang, Grapeseed, Peppermint, Vetiver,
    Rose, Eucalyptus, Lavender, Bergamot, Vanilla,
    Mogra, Strawberry, Sandalwood, Marigold, Green Apple
```

---

### `AppPreview.tsx`

```
Background: bg-obsidian with large decorative gold circle (blurred, low opacity) in background

Layout: Split — left: copy + feature list, right: phone mockups

Left side:
  Label: "THE APP"
  Heading: "Your diffuser,
            in your pocket."
  Feature list (4 items with gold checkmarks):
    ✦ Auto Mode — AI runs everything
    ✦ Magic Mode — preset mood combinations  
    ✦ Manual Mode — full individual control
    ✦ Schedule — set morning / night routines

  "Available on iOS & Android" pill
  → App Store + Play Store button stubs

Right side:
  2 phone mockup frames (use a clean iPhone/Android SVG frame, not a screenshot)
  Inside the frames: show the app UI wireframe with the AromaIQ color scheme
  Frame 1: Home tab — 4 circular diffuser module controls
  Frame 2: Magic tab — preset mood cards (Sleep, Focus, Romance, Morning)
  
  Frames: slight rotation (frame 1: -3deg, frame 2: +3deg) for depth
  Framer Motion: frames slide up from bottom on scroll into view
```

---

### `SocialProof.tsx`

```
Background: bg-obsidian-light (slightly elevated surface)

Top strip — press/partner logos row:
  "As seen in / backed by" label
  Logos: JSW Ventures wordmark, college name (placeholder), etc.
  Style: ivory/20 opacity, grayscale

Review cards (3 cards, horizontal scroll on mobile):
  Each card: bg-obsidian rounded-2xl border border-white/5 p-6
    - 5 star rating in gold
    - Review text in font-display italic text-ivory text-lg
    - Reviewer: "— Priya M., Early Tester" in font-body ivory-muted text-sm
    - Small verified badge

  Sample reviews:
    "I stopped reaching for my phone to change scents. AromaIQ just knows."
    "The lavender-vetiver blend it chose for my 11pm work session was perfect."
    "Finally a diffuser that feels like it was made for 2025."

Stats row (3 metrics):
  "15" / "Essential oils"
  "4" / "Scent chambers"  
  "1" / "App to rule them all"
  Each: font-display text-6xl gold + font-body text-ivory-muted label below
```

---

### `ShopSection.tsx` — FULL ECOMMERCE

```
Background: bg-obsidian

Section heading: "Own your ambience."

Product cards (3 tiers) — CSS grid, 3 cols desktop, 1 col mobile:

  Card 1 — Starter Kit (₹4,999)
    Product image + name + description
    Includes: Diffuser unit + 2 starter scent bottles (30ml each)
    CTA: "Add to Cart"
    Badge: "Best for trying"

  Card 2 — Full Kit (₹7,999) ← FEATURED, gold border, "Most Popular" badge
    Product image + name + description
    Includes: Diffuser + 6 scent bottles (choose your mood packs)
    CTA: "Add to Cart" — filled gold button

  Card 3 — Monthly Refill Subscription (₹1,499/mo)
    2 new scent bottles per month, curated by AI mood profile
    CTA: "Subscribe"
    Badge: "Save 20%"

Cart Drawer (Zustand state → side drawer):
  - Slide in from right (Framer Motion x: "100%" → x: 0)
  - bg-obsidian-light, full height
  - List cart items with quantities
  - Total in gold
  - "Checkout with Razorpay" button → calls /api/orders → opens Razorpay modal

Razorpay integration:
  - POST /api/orders creates order_id
  - Frontend loads Razorpay checkout script
  - On success: POST /api/payment/verify (HMAC signature check)
  - On verified: show success modal, clear cart, email receipt via Resend
```

---

### `WaitlistSection.tsx` — COLOR BENDS BACKGROUND

```
Background: <ColorBends /> — warmest, most prominent use on the page

This is a conversion section. Center everything. Maximum focus.

Heading: "Be first.
          Pay less."           ← font-display, 5xl, ivory, centered

Subheading: "Join the waitlist for early-bird pricing and be the
             first to know when AromaIQ ships."   ← ivory-muted, centered

Countdown timer component (launch: Diwali 2025 → compute days/hours/mins/secs):
  4 blocks: DD · HH · MM · SS
  Each block: bg-obsidian-light rounded-xl px-6 py-4
  Number: font-display text-5xl gold
  Label: font-body text-xs ivory-muted uppercase tracking-widest

WaitlistForm:
  Single row: [Name input] [Email input] [Join Waitlist →]
  On mobile: stacked vertically
  
  Input style: bg-transparent border border-gold/30 text-ivory placeholder:text-ivory/30
               focus:border-gold rounded-xl px-5 py-4 font-body
  
  Button: bg-gold text-obsidian font-body font-medium px-8 py-4 rounded-xl
          hover:bg-gold-light active:scale-98 transition-all
  
  On submit: POST /api/waitlist → save to DB → Resend confirmation email
  Success state: replace form with "You're in. We'll see you at launch. 🪔"
                 (show only on success, use Framer AnimatePresence for swap)

Perks row below form (3 columns):
  🎁 Early bird pricing (20% off launch price)
  📦 Priority shipping
  🌿 Free starter scent pack
```

---

### `FoundersSection.tsx`

```
Background: bg-obsidian-mid

Heading: "Built by two students
          who just wanted better air."

Two founder cards side by side:
  Each: bg-obsidian-light rounded-2xl p-8 border border-white/5
    - Circular photo placeholder (gradient fill with initials)
    - Name: font-display text-2xl ivory
    - Title: "Co-founder" in font-body text-gold text-sm uppercase tracking-widest
    - Short bio (2 sentences max)

  Daksh: "Engineering student. Built AromaIQ because the right scent
          at the right moment changes everything — and no diffuser
          was smart enough to figure that out."

  Ayush: "Co-founder & tech lead. Turned the idea into hardware,
          one MOSFET at a time."

Mentor/backer callout below cards:
  "Backed by JSW Ventures · Mentored by Janam Mehta"
  In font-body text-sm text-ivory/50 centered, with thin gold horizontal rules on either side
```

---

### `FAQSection.tsx`

```
Background: bg-obsidian

Heading: "Questions, answered."

Accordion (8 items) — each item:
  - Border-bottom: 1px solid gold/10
  - Question: font-display text-lg ivory + expand icon (Framer Motion rotate on open)
  - Answer: font-body text-ivory-muted text-sm leading-relaxed (Framer height animation)
  
  Questions:
    1. "When does AromaIQ ship?"
       "We're targeting our first batch for Diwali 2025. Waitlist members ship first."
    2. "Which essential oils are included?"
       "We stock 15 oils — cedarwood, lavender, peppermint, rose, ylang ylang, bergamot,
        eucalyptus, vetiver, vanilla, mogra, grapeseed, sandalwood, marigold, green apple,
        and strawberry."
    3. "Does it work without the app?"
       "Yes — it has three onboard preset modes. The app unlocks full AI features."
    4. "Is it safe around kids and pets?"
       "All oils are 100% natural. We recommend standard aromatherapy precautions."
    5. "What does the subscription include?"
       "Two curated scent bottles per month, selected based on your mood history in the app."
    6. "How does the AI detect my mood?"
       "It learns from your usage patterns, time of day, and in-app feedback over time.
        No camera or microphone is used."
    7. "Can I use my own essential oils?"
       "Yes — all four chambers accept any standard essential oil."
    8. "What payment methods are accepted?"
       "UPI, cards, net banking, and EMI via Razorpay."
```

---

### `Footer.tsx`

```
bg-walnut (warmest section — feels like a closing)

Layout: 4-column grid desktop, 2-col tablet, 1-col mobile

Col 1: Brand
  AromaIQ logo in ivory, font-display
  Tagline: "Scent intelligence for modern living."
  Instagram link + email

Col 2: Shop
  Starter Kit · Full Kit · Subscriptions · Gift Cards (coming soon)

Col 3: Company
  Our Story · How It Works · The App · Press Kit

Col 4: Support
  FAQ · Shipping & Returns · Privacy Policy · Terms

Bottom bar:
  "© 2025 AromaIQ. Made with intention in India." (left)
  "Backed by JSW Ventures" (right, ivory/40)
```

---

## GLOBAL MOTION SYSTEM

```tsx
// /lib/motion-variants.ts — import these everywhere

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
}

export const slideFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
}

// Use this on all section wrappers (scroll-triggered):
// <motion.section
//   variants={staggerContainer}
//   initial="hidden"
//   whileInView="visible"
//   viewport={{ once: true, amount: 0.2 }}
// >
```

---

## COLOR BENDS COMPONENT WRAPPER

```tsx
// /components/backgrounds/ColorBends.tsx
// Install from reactbits.dev — copy the Aurora/ColorBends source
// Wrap it to accept an 'intensity' prop and our brand color presets:

type ColorBendsPreset = 'hero' | 'warm' | 'cool' | 'conversion'

const presets = {
  warm:       { colors: ['#0E0C0A', '#3D2B1F', '#C9A96E22', '#7A5C3C'] },
  cool:       { colors: ['#0E0C0A', '#1A1714', '#2C2520', '#C9A96E11'] },
  conversion: { colors: ['#3D2B1F', '#C9A96E33', '#7A5C3C', '#0E0C0A'] },
}

// Always place an overlay div on top:
// <div className="absolute inset-0 bg-obsidian/65 pointer-events-none z-10" />
// This is CRITICAL — without it, text becomes unreadable
```

---

## API ROUTES

### `POST /api/waitlist`
```ts
// Validate email + name (Zod)
// Upsert WaitlistEntry in Prisma (ignore duplicate emails)
// Send Resend email: "You're on the list — AromaIQ launches this Diwali"
// Return: { success: true, message: "You're in!" }
```

### `POST /api/orders`
```ts
// Accept: { items: [{productId, quantity}][], customerEmail, customerName, customerPhone }
// Calculate total from DB product prices (never trust client price)
// Create Razorpay order via razorpay.orders.create({ amount: total*100, currency: 'INR' })
// Save Order to DB with status PENDING
// Return: { orderId, razorpayOrderId, amount, currency, key: process.env.RAZORPAY_KEY_ID }
```

### `POST /api/payment/verify`
```ts
// Accept: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
// Verify HMAC: crypto.createHmac('sha256', secret).update(orderId + '|' + paymentId)
// If valid: update Order status to PAID, send receipt email via Resend
// Return: { success: true } or { success: false, error: 'Invalid signature' }
```

---

## ENV VARIABLES NEEDED

```env
DATABASE_URL=
DIRECT_URL=                    # Supabase direct URL for Prisma migrations
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_RAZORPAY_KEY_ID=   # Exposed to client for Razorpay checkout
NEXT_PUBLIC_SITE_URL=
```

---

## PACKAGES TO INSTALL

```bash
npm install framer-motion zustand @prisma/client prisma
npm install razorpay resend
npm install react-hook-form @hookform/resolvers zod
npm install lucide-react
npm install @next/font

# React Bits (Color Bends) — copy component source from reactbits.dev/backgrounds
# Search: "Aurora" or "Color Bends" — copy the TSX directly into /components/backgrounds/
```

---

## IMPORTANT DESIGN RULES — READ BEFORE CODING

1. **Never use white backgrounds.** The entire site is dark. `bg-obsidian` is the floor.
2. **Never use Inter, Roboto, or system fonts.** Cormorant Garant for display, DM Sans for UI. No exceptions.
3. **Gold is an accent, not a fill.** Use it sparingly — CTAs, labels, highlights, borders. Do not make entire sections gold.
4. **The video hero must be darkened.** Minimum `bg-obsidian/60` overlay. The product should be barely visible — evocative, not a demo reel.
5. **Color Bends should be dark and moody.** Not a colourful gradient. The brand palette is warm blacks and amber gold. If it looks like a tech startup's hero, reduce the brightness and saturation.
6. **All headings are light weight.** `font-light` or `font-extralight` on Cormorant Garant. Heavy display fonts kill the luxury feel.
7. **Spacing is generous.** Minimum `py-24` on all sections. Luxury brands give content room to breathe.
8. **Mobile first.** Build mobile layout first, then scale up. Every section must work perfectly on 375px width.
9. **No bounce animations.** All motion should use `ease: [0.22, 1, 0.36, 1]` (custom ease-out). Bouncy = cheap.
10. **Images are placeholders.** Use `/public/images/placeholder-*.jpg` paths. The developer will replace them.

---

## BUILD ORDER (sequential — do not skip steps)

```
Phase 1 — Foundation
  [ ] next.config.js + tailwind.config.js with full token system
  [ ] layout.tsx with fonts, metadata, global CSS
  [ ] Zustand cart store
  [ ] Prisma schema + migrations (npx prisma migrate dev)

Phase 2 — Layout Components  
  [ ] Navbar.tsx (with scroll behavior)
  [ ] Footer.tsx
  [ ] ColorBends.tsx wrapper
  [ ] VideoBackground.tsx wrapper
  [ ] All motion variants (lib/motion-variants.ts)

Phase 3 — Page Sections (top to bottom)
  [ ] HeroSection (video BG)
  [ ] ProblemSolution (Color Bends)
  [ ] HowItWorks (Color Bends)
  [ ] HardwareShowcase
  [ ] ScentLibrary (Color Bends + mood filter)
  [ ] AppPreview
  [ ] SocialProof
  [ ] ShopSection + CartDrawer (Zustand)
  [ ] WaitlistSection (Color Bends + countdown)
  [ ] FoundersSection
  [ ] FAQSection
  [ ] Assemble in page.tsx

Phase 4 — Backend
  [ ] POST /api/waitlist (Prisma + Resend)
  [ ] POST /api/orders (Razorpay)
  [ ] POST /api/payment/verify (HMAC)

Phase 5 — Polish
  [ ] All Framer Motion scroll animations
  [ ] Mobile responsiveness audit
  [ ] Lazy loading images (next/image)
  [ ] SEO metadata per page
  [ ] Loading states on all forms and buttons
```

---

*Built for AromaIQ — AI-powered smart aroma diffuser. Palette: Obsidian · Gold · Ivory · Walnut.*
