# Livora: Your International Literary Hub

You are a senior staff software engineer, product architect, UX/UI designer, e-commerce specialist and startup CTO.

Your mission is to design and build a production-ready MVP for an e-commerce startup selling NEW/ALL best-selling books exclusively in ENGLISH and FRENCH. so the platform must be in french, english and turkish!

PROJECT WORKING NAME:

LIVORA

TAGLINE:

International Books. The startup is based and plan to sell in Turkey.

IMPORTANT:

LIVORA is a NEW independent commercial brand.

It is officially founded by two co-founders:

1. Stéphane YEMELI

   - Founder of YEMELINK

   - Full-stack developer

   - Product/technology lead

   - UX/UI

   - Branding

   - Content

   - Social media

   - Growth/marketing

   - Analytics

   - Platform architecture

2. Nickel Feumo

   - Founder of Algo Finance

   - Finance lead

   - Pricing

   - Financial planning

   - Suppliers

   - Inventory

   - Procurement

   - Cash management

   - Logistics

   - Financial risk

YEMELINK and Algo Finance are the two companies officially behind the project, but LIVORA must have its OWN visual identity, customer-facing brand and commercial experience.

Do NOT design this as a YEMELINK website.

Do NOT design this as an Algo Finance website.

Do NOT make the two parent companies visually dominate the storefront.

They are the founders/backers.

LIVORA is the customer-facing brand.

--------------------------------------------------

1. BUSINESS MODEL

--------------------------------------------------

LIVORA is a niche e-commerce platform based in Bolu, Turkey.

The platform sells all time best sellers and NEW books:

- English books

- French books

- International best-sellers

- BookTok/Bookstagram trending titles

- Business books

- Self-development

- Fiction

- Fantasy

- Romance

- Mystery/thriller

- Classics

- Academic/educational titles when commercially relevant

- French-language books for students, schools and francophone communities

The company intentionally DOES NOT attempt to compete with generalist bookstores on catalogue size.

The competitive advantage is:

- curated selection

- availability

- discovery

- fast purchasing

- competitive pricing

- English/French specialization

- BookTok-driven merchandising

- student/community acquisition

- intelligent inventory

- dynamic pricing

- low working capital requirements

- excellent UX

- data-driven procurement

The initial operating model is LEAN.

Start with:

- small inventory

- micro-stocks

- highly demanded books

- pre-orders where appropriate

- supplier-based replenishment

- data-driven purchasing

- low fixed costs

The business launches from Bolu and progressively expands throughout Turkey.

--------------------------------------------------

2. PRODUCT VISION

--------------------------------------------------

Build TWO connected products:

A. CUSTOMER STOREFRONT

A premium modern bookstore optimized for conversion.

B. ADMIN / OPERATIONS PLATFORM

A business operating system allowing the founders to manage:

- books

- inventory

- suppliers

- orders

- pricing

- competitor prices

- procurement

- customers

- promotions

- analytics

- financial metrics

- content

- ambassadors

- website configuration

The admin system is extremely important.

The founders must NOT need to edit source code every time they want to:

- add a book

- change a price

- change inventory

- create a promotion

- feature a book

- update a supplier

- modify homepage sections

- see sales

- monitor competitors

Everything operational must be manageable from the dashboard.

--------------------------------------------------

3. TECH STACK

--------------------------------------------------

Preferred stack:

Frontend:

- Next.js

- React

- TypeScript

- Tailwind CSS

Backend:

- Next.js server architecture / API routes where appropriate

- Supabase

- PostgreSQL

Authentication:

- Supabase Auth

Database:

- PostgreSQL / Supabase

Hosting:

- Vercel

Images:

- Supabase Storage or optimized external storage

Analytics:

- Google Analytics 4 or equivalent

- internal event tracking

Email:

- transactional email provider compatible with the architecture

Payments:

Architecture must support Turkish payment providers and 3D Secure.

Do not hard-code a payment provider.

Create a payment abstraction layer so providers can be changed later.

Possible future integrations:

- iyzico

- PayTR

- other Turkey-compatible payment gateway

Shipping:

Create a shipping abstraction layer.

Do not hard-code the application around one courier.

Potential carriers can later include:

- Yurtiçi Kargo

- MNG / successor network

- Aras

- Sürat

- Hepsijet

- other suitable Turkish carriers

The architecture must allow carrier integration later.

--------------------------------------------------

4. LANGUAGE

--------------------------------------------------

The customer-facing application must support:

- Turkish

- English

The initial catalogue contains:

- English books

- French books

French must be treated as a BOOK LANGUAGE, not necessarily as the website language.

The database therefore needs:

book_language:

- EN

- FR

and future extensibility for:

- TR

- DE

- ES

etc.

The UI must be internationalization-ready from day one.

Default customer language:

Turkish.

Allow the customer to switch language.

URLs should be SEO-friendly and localization-ready.

--------------------------------------------------

5. BRAND IDENTITY

--------------------------------------------------

LIVORA must feel:

- premium

- modern

- literary

- technological

- trustworthy

- international

- young

- editorial

- minimal

Avoid:

- generic Amazon-like layouts

- old-fashioned bookstore designs

- overly childish BookTok aesthetics

- excessive gradients

- excessive glassmorphism

- clutter

- fake urgency

- cheap-looking marketplace UI

Visual direction:

Primary:

deep navy / almost black

Secondary:

warm off-white / ivory

Accent:

subtle cyan inherited from the technology DNA of YEMELINK

Optional secondary accent:

deep burgundy / book red

Use generous whitespace.

Typography:

modern premium sans-serif for UI

with an elegant serif accent for editorial/book sections if appropriate.

The storefront should feel like:

"modern technology meets an independent international bookstore."

--------------------------------------------------

6. CUSTOMER STOREFRONT

--------------------------------------------------

Create the following pages.

HOME PAGE

Sections:

1. Hero

   - strong statement

   - English & French books

   - CTA: Explore Books

   - secondary CTA: Trending Now

2. Trending Now

   - BookTok / social trend products

   - horizontally scrollable on mobile

3. Best Sellers

4. New Arrivals

5. English Books

6. French Books

7. Curated Collections

Examples:

- Books everyone is talking about

- 5 books to read this month

- Beginner-friendly English books

- French classics

- Business books

- Books for university students

- Books under X TL

8. Social proof

9. Why LIVORA?

Examples:

- Carefully selected

- New books only

- English & French specialists

- Fast delivery in Turkey

- Secure payment

10. Newsletter / community CTA

11. Footer

--------------------------------------------------

7. BOOK CATALOGUE

--------------------------------------------------

Create a powerful catalogue page.

Filters:

- language

- category

- genre

- author

- publisher

- price

- availability

- format

- popularity

- rating

- newest

- best-selling

- trending

Sorting:

- Recommended

- Best sellers

- Price low → high

- Price high → low

- Newest

- Trending

Search:

Search by:

- title

- author

- ISBN

- publisher

- category

Search must support typo tolerance where practical.

Autocomplete should show:

- cover

- title

- author

- language

- price

--------------------------------------------------

8. BOOK PRODUCT PAGE

--------------------------------------------------

This is one of the most important pages.

Display:

- high-quality cover

- title

- author

- language

- ISBN

- publisher

- publication date

- format

- pages

- description

- price

- previous price if legitimate

- availability

- estimated delivery

- stock status

- quantity selector

- Add to Cart

- Buy Now

Also display:

- "Why you'll like it"

- related books

- customers also bought

- similar books

- trending indicator when legitimate

- social proof

- reviews

Important:

Clearly distinguish:

IN STOCK

LOW STOCK

AVAILABLE TO ORDER

PRE-ORDER

OUT OF STOCK

Never fabricate scarcity.

--------------------------------------------------

9. BOOK DISCOVERY

--------------------------------------------------

This is a core differentiator.

Create a discovery experience inspired by:

- Netflix recommendation UX

- Spotify discovery

- BookTok trends

BUT do not copy their UI.

Create sections such as:

"Trending on BookTok"

"Readers are buying this week"

"If you liked X"

"Popular with students"

"French readers' picks"

"English best sellers"

"Under 500 TL"

"Weekend reads"

"Business & career"

"Currently trending"

The admin must be able to manually curate these collections.

Later the system should also calculate them automatically.

--------------------------------------------------

10. CART

--------------------------------------------------

Cart must display:

- products

- quantity

- unit price

- subtotal

- shipping

- discount

- total

Add:

- free shipping threshold

- coupon field

- estimated delivery

- stock validation

Do not allow overselling.

Inventory must be reserved during checkout/payment according to a configurable reservation timeout.

--------------------------------------------------

11. CHECKOUT

--------------------------------------------------

Create a clean one-page or optimized multi-step checkout.

Customer information:

- name

- surname

- email

- phone

- Turkish shipping address

- city

- district

- postal code

- address details

Support guest checkout.

Allow account creation after purchase.

Show:

- products

- shipping

- discount

- total

- payment method

- delivery estimate

Payment must be modular.

Prepare architecture for:

- iyzico

- PayTR

- future providers

3D Secure must be supported where required.

NEVER store raw card data.

--------------------------------------------------

12. CUSTOMER ACCOUNT

--------------------------------------------------

Customers can:

- create account

- login

- reset password

- view orders

- track orders

- manage addresses

- manage profile

- view wishlist

- view recently viewed books

- leave reviews

- manage newsletter preferences

Wishlist:

Users can save books.

If a wishlist item comes back in stock:

send notification.

If price drops:

send notification if enabled.

--------------------------------------------------

13. ORDER MANAGEMENT

--------------------------------------------------

Order statuses:

- Pending payment

- Paid

- Processing

- Preparing

- Shipped

- Delivered

- Cancelled

- Returned

- Refunded

Admin can update status.

Customer sees tracking timeline.

Architecture must support courier tracking integration later.

--------------------------------------------------

14. INVENTORY MANAGEMENT

--------------------------------------------------

This is a critical business feature.

Each book has:

- SKU

- ISBN

- supplier

- supplier SKU

- cost

- currency

- exchange rate at purchase

- landed cost

- selling price

- quantity

- reserved quantity

- available quantity

- reorder threshold

- target stock

- supplier lead time

Calculate:

Available stock =

physical stock - reserved stock

Create alerts:

LOW STOCK

REORDER NOW

OUT OF STOCK

SLOW MOVING

DEAD STOCK

TRENDING / HIGH VELOCITY

--------------------------------------------------

15. INVENTORY INTELLIGENCE

--------------------------------------------------

Track:

- sales velocity

- units sold/day

- units sold/week

- units sold/month

- stock cover

- days of inventory

- reorder point

- average supplier lead time

Suggested reorder formula:

Reorder Point =

Average Daily Sales × Supplier Lead Time

+ Safety Stock

Allow founders to override the recommendation.

--------------------------------------------------

16. SUPPLIER MANAGEMENT

--------------------------------------------------

Create supplier dashboard.

Supplier fields:

- company name

- contact

- email

- phone

- city

- country

- payment terms

- currency

- lead time

- MOQ

- discount

- notes

- active/inactive

Track supplier performance:

- average delivery time

- order accuracy

- availability

- price competitiveness

- cancellation rate

Allow multiple suppliers per book.

--------------------------------------------------

17. PROCUREMENT

--------------------------------------------------

Create Purchase Orders.

Admin can:

- create purchase order

- select supplier

- select books

- quantity

- cost

- currency

- expected delivery

- notes

Purchase order statuses:

- Draft

- Sent

- Confirmed

- Partially received

- Received

- Cancelled

When stock is received:

automatically update inventory.

Record:

- purchase cost

- currency

- exchange rate

- landed cost

- received quantity

--------------------------------------------------

18. FINANCIAL ENGINE

--------------------------------------------------

The financial dashboard is primarily for Nickel Feumo / Algo Finance.

Every SKU must support:

purchase currency:

- TRY

- EUR

- USD

purchase cost

exchange rate

shipping/import cost

landed cost

selling price

payment fee

shipping cost

discount

estimated return cost

contribution margin

gross margin %

contribution margin %

The system must calculate these automatically.

Example:

Landed Cost =

Book Purchase Cost

+ International Shipping

+ Import/Customs Costs if applicable

+ Local Transport

+ Other Allocated Costs

Contribution Margin =

Selling Price

- Landed Cost

- Payment Fee

- Shipping Subsidy

- Packaging

- Expected Return Cost

- Variable Marketing Cost

--------------------------------------------------

19. FX RISK MANAGEMENT

--------------------------------------------------

Because suppliers may invoice in EUR/USD while customers pay in TRY:

Create FX fields.

For every foreign-currency purchase:

- purchase currency

- purchase exchange rate

- purchase date

- TRY equivalent

Admin should see:

Current FX rate

Purchase FX rate

FX variation

Potential margin impact

Create alerts if:

FX movement > configurable threshold.

Example:

If EUR/TRY moves more than 3% from the rate used to calculate a SKU price:

FLAG SKU FOR PRICE REVIEW.

Do not automatically change prices without configurable approval rules.

--------------------------------------------------

20. DYNAMIC PRICING

--------------------------------------------------

Create pricing intelligence.

For every SKU:

- own price

- competitor price 1

- competitor price 2

- competitor price 3

- market median

- minimum profitable price

- recommended price

- current margin

- target margin

Recommended price should consider:

- landed cost

- target margin

- competitor prices

- inventory level

- demand velocity

- FX

- promotions

NEVER simply copy competitor prices.

The system must enforce:

minimum profitable price.

Admin can approve/reject price recommendations.

Keep price history.

--------------------------------------------------

21. COMPETITOR PRICE TRACKING

--------------------------------------------------

Create a competitor monitoring module.

Initial competitors:

- D&R

- Kitapyurdu

- Amazon Türkiye

- İdefix

- other relevant Turkish bookstores

Track competitor information by ISBN whenever possible.

For each competitor:

- URL

- price

- stock status

- shipping information if available

- timestamp

- promotion

- edition

Show:

OUR PRICE

MARKET LOW

MARKET MEDIAN

MARKET HIGH

OUR MARGIN

Create alerts:

"We are 12% more expensive than market median."

"We are below market but margin is dangerously low."

"Competitor stock unavailable."

IMPORTANT:

Implement this in a legally and technically compliant manner.

Do not build a scraper that blindly bypasses anti-bot systems, authentication or access restrictions.

Prefer official APIs, public feeds, permitted crawling or manually imported competitor data when appropriate.

Make competitor connectors modular.

--------------------------------------------------

22. ADMIN DASHBOARD

--------------------------------------------------

Create a professional admin dashboard.

Main dashboard:

Revenue today

Revenue this week

Revenue this month

Orders today

Orders this week

Orders this month

Average order value

Conversion rate

Gross margin

Contribution margin

Cash position

Inventory value

Stock cover

Low-stock SKUs

Dead stock

Top-selling books

Fastest-growing books

Trending books

Competitor price alerts

Pending purchase orders

Pending orders

Returns

Charts:

- revenue

- orders

- margin

- AOV

- inventory value

- sales by category

- sales by language

- sales by city

- sales by SKU

Date filters:

- today

- 7 days

- 30 days

- 90 days

- custom

--------------------------------------------------

23. ADMIN ROLES

--------------------------------------------------

Create role-based access control.

Roles:

SUPER ADMIN

- everything

TECH / PRODUCT

- products

- content

- website

- analytics

- technical settings

FINANCE

- prices

- costs

- margins

- purchase orders

- financial dashboards

INVENTORY

- stock

- receiving

- procurement

CUSTOMER SUPPORT

- customers

- orders

- returns

Marketing:

- content

- promotions

- campaigns

- ambassadors

Do not expose sensitive financial information to roles that don't need it.

--------------------------------------------------

24. CONTENT MANAGEMENT SYSTEM

--------------------------------------------------

Admin must be able to manage homepage content.

Create:

Hero banners

Featured books

Collections

Categories

Editorial sections

Blog posts

Book guides

Promotional banners

Landing pages

SEO metadata

No code changes should be required.

--------------------------------------------------

25. BLOG / SEO ENGINE

--------------------------------------------------

SEO is important.

Create:

/books

/books/[slug]

/authors/[slug]

/categories/[slug]

/collections/[slug]

/blog/[slug]

SEO metadata:

- title

- description

- OG image

- canonical URL

- structured data

Use Schema.org where appropriate:

Book

Product

BreadcrumbList

Organization

Article

Generate:

sitemap.xml

robots.txt

Optimize:

Core Web Vitals

mobile performance

image optimization

server-side rendering

--------------------------------------------------

26. MARKETING / GROWTH DASHBOARD

--------------------------------------------------

Stéphane must be able to track:

traffic

organic traffic

social traffic

conversion

UTM campaigns

landing pages

top content

orders generated by campaign

revenue by campaign

Support:

TikTok

Instagram

Google

direct

SEO

ambassador links

referral codes

Create campaign tracking.

--------------------------------------------------

27. AMBASSADOR PROGRAM

--------------------------------------------------

Create a simple student ambassador system.

Each ambassador gets:

unique code

unique referral link

Track:

clicks

orders

revenue

commission/credit

Admin can see:

top ambassadors

orders

conversion

commission owed

This is central to the Bolu launch strategy.

--------------------------------------------------

28. PROMOTIONS

--------------------------------------------------

Create promotion engine.

Support:

percentage discount

fixed discount

coupon

bundle

free shipping

minimum order value

specific SKU

category

language

collection

Rules must have:

start date

end date

usage limit

minimum cart value

maximum discount

Never stack promotions accidentally.

--------------------------------------------------

29. REVIEWS

--------------------------------------------------

Customers can review purchased books.

Review fields:

rating

title

comment

Admin moderation.

Prevent reviews from customers who didn't purchase unless explicitly allowed.

Show:

average rating

review count

rating distribution

--------------------------------------------------

30. NOTIFICATIONS

--------------------------------------------------

Prepare notification system.

Email notifications:

order confirmation

payment confirmation

order shipped

order delivered

password reset

back in stock

price drop

wishlist notification

Future:

WhatsApp/SMS integration.

Notification preferences must be configurable.

--------------------------------------------------

31. DATA MODEL

--------------------------------------------------

Design a clean relational schema.

Minimum tables:

users

profiles

roles

books

authors

publishers

categories

book_categories

book_languages

collections

collection_books

inventory

inventory_movements

suppliers

supplier_books

purchase_orders

purchase_order_items

competitors

competitor_prices

prices

price_history

orders

order_items

payments

shipments

addresses

wishlists

wishlist_items

reviews

coupons

promotions

promotion_products

ambassadors

referrals

campaigns

analytics_events

notifications

blog_posts

homepage_sections

settings

audit_logs

Use UUIDs.

Use proper foreign keys.

Use timestamps.

Use indexes for:

ISBN

slug

author

title

language

category

supplier

order status

inventory

created_at

--------------------------------------------------

32. SECURITY

--------------------------------------------------

Security is non-negotiable.

Implement:

- Supabase Row Level Security

- role-based authorization

- server-side validation

- input validation

- secure environment variables

- no secrets in frontend

- rate limiting where appropriate

- secure authentication

- CSRF protections where relevant

- XSS protection

- SQL injection protection

- audit logs for sensitive admin actions

Never expose:

supplier costs

financial margins

internal inventory logic

admin data

to customers.

--------------------------------------------------

33. ADMIN AUDIT LOG

--------------------------------------------------

Record sensitive actions:

- price changed

- inventory adjusted

- purchase order created

- supplier modified

- refund issued

- promotion created

- admin login

- role changed

Store:

user

action

timestamp

entity

old value

new value

--------------------------------------------------

34. MOBILE FIRST

--------------------------------------------------

Most customers will likely discover LIVORA through social media.

Therefore:

MOBILE FIRST.

Test:

360px

390px

430px

Then tablet and desktop.

The mobile experience must be excellent.

Bottom navigation may be used.

Suggested mobile navigation:

Home

Explore

Search

Wishlist

Cart

--------------------------------------------------

35. PERFORMANCE

--------------------------------------------------

Target:

Lighthouse 90+ where realistically achievable.

Optimize:

- images

- fonts

- JavaScript

- server rendering

- caching

- database queries

- lazy loading

Product images must be optimized.

Do not load unnecessary admin code on customer pages.

--------------------------------------------------

36. CUSTOMER TRUST

--------------------------------------------------

Create trust elements:

Secure payment

New books only

Clear delivery estimates

Clear return policy

Customer support

Real reviews

Company information

Contact details

Do not use fake:

reviews

sales numbers

stock scarcity

discounts

testimonials

--------------------------------------------------

37. ANALYTICS EVENTS

--------------------------------------------------

Track at minimum:

page_view

search

book_view

add_to_cart

remove_from_cart

begin_checkout

payment_started

purchase

wishlist_add

wishlist_remove

coupon_applied

campaign_click

ambassador_click

review_submitted

Attach:

user/session

SKU

campaign

source

timestamp

--------------------------------------------------

38. BUSINESS INTELLIGENCE

--------------------------------------------------

Create reports:

Daily sales

Weekly sales

Monthly sales

Sales by language

Sales by category

Sales by book

Sales by city

Sales by acquisition source

Margin by SKU

Margin by category

Inventory aging

Stock turnover

Supplier performance

Competitor price positioning

Repeat customer rate

Customer lifetime value

CAC

Contribution after CAC

--------------------------------------------------

39. CUSTOMER SEGMENTATION

--------------------------------------------------

Create basic segments:

New customer

Returning customer

English reader

French reader

Student

High-value customer

Inactive customer

BookTok-acquired customer

Ambassador-acquired customer

Allow future personalization based on these segments.

--------------------------------------------------

40. HOMEPAGE MERCHANDISING

--------------------------------------------------

The admin should be able to drag/reorder homepage sections.

For example:

Hero

Trending

Best Sellers

French Picks

English Picks

Under 500 TL

New Arrivals

Editorial

Newsletter

Each section can be:

enabled

disabled

reordered

No developer required.

--------------------------------------------------

41. MVP SCOPE

--------------------------------------------------

DO NOT try to build every advanced feature before launch.

MVP MUST include:

Customer:

- homepage

- catalogue

- search

- filters

- product page

- cart

- checkout

- payment architecture

- customer account

- orders

- wishlist

Admin:

- dashboard

- products

- inventory

- suppliers

- orders

- pricing

- basic competitor monitoring

- promotions

- content management

- analytics

Infrastructure:

- authentication

- database

- RLS

- logging

- SEO

- responsive design

- analytics

Phase 2:

- advanced pricing engine

- automatic competitor monitoring

- ambassador dashboard

- recommendation engine

- advanced CRM

- courier APIs

- automated procurement suggestions

- advanced financial forecasting

Phase 3:

- AI recommendations

- personalized homepages

- demand forecasting

- intelligent procurement

- predictive inventory

- automated price recommendations

- advanced loyalty

- mobile application

--------------------------------------------------

42. IMPORTANT PRODUCT PRINCIPLE

--------------------------------------------------

DO NOT OVERENGINEER.

The goal is not to build Amazon.

The goal is to build the smallest possible system that can generate real orders and produce reliable data.

Every feature must answer:

"Does this help us sell books, protect margin, reduce operational work, or learn faster?"

If the answer is no:

DO NOT BUILD IT IN MVP.

--------------------------------------------------

43. INITIAL CATALOGUE

--------------------------------------------------

Create seed data architecture for:

English best sellers

French best sellers

BookTok books

Business books

Self-development

Fantasy

Romance

Mystery

Classics

Do not invent real-world availability or prices.

Use clearly marked demo products if seed data is required.

ISBN must be treated as the primary book identity.

--------------------------------------------------

44. ADMIN BUSINESS RULES

--------------------------------------------------

Create configurable settings for:

minimum margin %

minimum contribution margin

free shipping threshold

low-stock threshold

reorder threshold

safety stock

stock reservation time

default delivery estimate

FX alert threshold

competitor price alert %

maximum discount

minimum selling price

These MUST NOT be hard-coded.

The finance/admin user must be able to change them.

--------------------------------------------------

45. DATABASE INTEGRITY

--------------------------------------------------

Implement constraints to prevent:

negative stock

duplicate ISBN/edition records

duplicate active coupons

invalid order totals

invalid price below minimum profitable price

invalid supplier quantities

overselling

Use transactions where required.

--------------------------------------------------

46. ERROR HANDLING

--------------------------------------------------

Create polished empty states.

Examples:

No books found

No wishlist items

Cart empty

Out of stock

Payment failed

Order not found

Supplier unavailable

Competitor data unavailable

Never show raw technical errors to customers.

Log technical errors internally.

--------------------------------------------------

47. DESIGN SYSTEM

--------------------------------------------------

Create reusable components:

Button

Input

Select

Modal

Drawer

Toast

Card

BookCard

BookGrid

PriceDisplay

StockBadge

Rating

SearchBar

Navbar

Footer

Pagination

FilterPanel

CartItem

OrderTimeline

DashboardCard

DataTable

Chart

EmptyState

LoadingSkeleton

ConfirmDialog

Create consistent spacing and typography.

--------------------------------------------------

48. FILE / CODE ORGANIZATION

--------------------------------------------------

Use clean modular architecture.

Separate:

components

features

lib

services

database

types

hooks

utils

app routes

Do not create one giant file.

Use TypeScript strictly.

Avoid any unless absolutely necessary.

Document complex business logic.

--------------------------------------------------

49. DEVELOPMENT PROCESS

--------------------------------------------------

DO NOT immediately generate thousands of lines of code.

First:

STEP 1

Analyze requirements.

STEP 2

Create technical architecture.

STEP 3

Create database schema.

STEP 4

Create route/page map.

STEP 5

Create design system.

STEP 6

Create implementation roadmap.

STEP 7

Implement authentication and database.

STEP 8

Implement admin core.

STEP 9

Implement storefront.

STEP 10

Implement checkout.

STEP 11

Implement inventory/order flows.

STEP 12

Implement analytics.

STEP 13

Test everything.

STEP 14

Optimize.

STEP 15

Prepare deployment.

At every step:

- keep the app runnable

- avoid breaking existing functionality

- use migrations

- test critical flows

--------------------------------------------------

50. ACCEPTANCE TESTS

--------------------------------------------------

Before declaring MVP complete, verify:

CUSTOMER:

[ ] User can browse books

[ ] Search works

[ ] Filters work

[ ] Product page works

[ ] Add to cart works

[ ] Cart calculates correctly

[ ] Checkout validates data

[ ] Payment architecture works

[ ] Order is created

[ ] Inventory decreases correctly

[ ] Customer receives confirmation

[ ] Customer sees order

[ ] Wishlist works

[ ] Mobile experience works

ADMIN:

[ ] Admin login works

[ ] Admin can create book

[ ] Admin can edit book

[ ] Admin can change price

[ ] Admin can adjust inventory

[ ] Admin can create supplier

[ ] Admin can create purchase order

[ ] Admin can receive stock

[ ] Admin can manage orders

[ ] Admin sees margin

[ ] Admin sees low-stock alerts

[ ] Admin sees sales analytics

[ ] Admin can create promotion

[ ] Admin can edit homepage

[ ] Admin can see competitor data

FINANCE:

[ ] Purchase currency recorded

[ ] FX rate recorded

[ ] Landed cost calculated

[ ] Gross margin calculated

[ ] Contribution margin calculated

[ ] Minimum profitable price calculated

[ ] Price history recorded

SECURITY:

[ ] RLS enabled

[ ] Admin permissions enforced

[ ] Customers cannot access other orders

[ ] Financial data protected

[ ] Secrets protected

[ ] Audit logs working

--------------------------------------------------

51. WHAT I EXPECT FROM YOU

--------------------------------------------------

Act as the CTO of this startup.

Do not merely create a template.

Make product decisions when requirements are obvious.

When there are multiple reasonable options, choose the option that:

1. minimizes cost

2. minimizes complexity

3. maximizes speed to market

4. protects data

5. preserves future scalability

Do not build unnecessary enterprise architecture.

Do not add random features.

Do not use fake data in production logic.

Do not invent supplier information.

Do not invent competitor prices.

Do not invent stock availability.

Use demo data only where clearly identified.

--------------------------------------------------

52. FIRST TASK

--------------------------------------------------

Before writing the application code, produce:

1. Complete system architecture

2. Database ERD/schema

3. Page/route architecture

4. Component architecture

5. Admin architecture

6. Authentication/RBAC architecture

7. Payment architecture

8. Inventory architecture

9. Pricing/FX architecture

10. Competitor monitoring architecture

11. Analytics architecture

12. Deployment architecture

13. Security architecture

14. MVP vs Phase 2 vs Phase 3 feature matrix

15. Exact implementation order

Then begin implementation.

Do not stop at the architecture.

After presenting the architecture, start building the MVP.

--------------------------------------------------

53. FINAL PRODUCT PHILOSOPHY

--------------------------------------------------

Build LIVORA as:

"THE SMART INTERNATIONAL BOOKSTORE FOR TURKEY."

Not the biggest bookstore.

Not the cheapest bookstore.

The smartest niche bookstore.

The system should allow two founders to run a sophisticated e-commerce operation with a very small team.

Stéphane should be able to operate:

PRODUCT + TECH + BRAND + GROWTH.

Nickel should be able to operate:

FINANCE + PRICING + SUPPLY + INVENTORY.

The software should connect those two worlds.

TECH → demand data

DEMAND → inventory decision

INVENTORY → procurement

PROCUREMENT → landed cost

LANDED COST → pricing

PRICING → margin

MARGIN → cash

CASH → growth

That loop is the heart of LIVORA.

Build the machine around that loop.


Don't forget to add this two logos I just uploaded somewhere on the homepage as partners and sponsors and please make the admin part so that the admin can manage,change,add, erase or do absolutely anything and everything on the plateform! let's build the next Ecommerce giant!

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5430a0a1-012f-49fb-bb76-ed5b2a522d30).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
