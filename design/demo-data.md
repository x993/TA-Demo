# Demo Dataset Blueprint

> Complete fixture contract for the Credit Oversight demo.
> This document defines all named entities, relationships, and storylines.

---

## 1. Properties (10)

| ID | Name | City | State | Asset Class | Tenants |
|----|------|------|-------|-------------|---------|
| P1 | Riverside Tower | Chicago | IL | Office | 5 |
| P2 | Park Plaza Shopping Center | Dallas | TX | Retail | 4 |
| P3 | Lakewood Business Park | Atlanta | GA | Office | 3 |
| P4 | Gateway Industrial Complex | Phoenix | AZ | Industrial | 3 |
| P5 | Metropolitan Center | Boston | MA | Office | 4 |
| P6 | Southfield Retail Center | Detroit | MI | Retail | 3 |
| P7 | Harbor Point Office Tower | Seattle | WA | Office | 2 |
| P8 | Crossroads Distribution Hub | Denver | CO | Industrial | 2 |
| P9 | Willowbrook Plaza | Austin | TX | Retail | 2 |
| P10 | Summit Technology Park | San Jose | CA | Office | 2 |

---

## 2. Tenants (30)

### Public Tenants (15)

| ID | Display Name | Ticker | CIK | Industry | Properties | Status |
|----|--------------|--------|-----|----------|------------|--------|
| T1 | Apex Retail Group | APEX | 0001234567 | Retail | P2, P6 | **Critical** |
| T2 | Northstar Apparel Inc | NSTR | 0001234568 | Retail | P2, P9 | **Critical** |
| T3 | Meridian Healthcare Systems | MHCS | 0001234569 | Healthcare | P1, P5 | Watch |
| T4 | TechFlow Solutions | TFLO | 0001234570 | Technology | P3, P10 | Watch |
| T5 | Continental Logistics Corp | CLOG | 0001234571 | Logistics | P4, P8 | Watch |
| T6 | Vertex Financial Services | VRTX | 0001234572 | Financial | P1 | Watch |
| T7 | BlueSky Manufacturing | BSKY | 0001234573 | Manufacturing | P4 | **Improving** |
| T8 | Granite Construction Holdings | GRNT | 0001234574 | Construction | P8 | **Improving** |
| T9 | Pacific Energy Partners | PCEP | 0001234575 | Energy | P7 | Stable |
| T10 | Midwest Banking Corp | MWBC | 0001234576 | Financial | P1 | Stable |
| T11 | National Insurance Group | NAIG | 0001234577 | Insurance | P5 | Stable |
| T12 | Premier Foods Inc | PFDI | 0001234578 | Consumer | P6 | Stable |
| T13 | Atlantic Shipping Co | ATSC | 0001234579 | Logistics | P4 | Stable |
| T14 | Redwood Pharmaceuticals | RWPH | 0001234580 | Healthcare | P10 | **Improving** |
| T15 | Sterling Media Group | STMG | 0001234581 | Media | P7 | Watch |

### Private Tenants (15)

| ID | Display Name | Website | Industry | Properties | Status |
|----|--------------|---------|----------|------------|--------|
| T16 | Morrison & Associates Law | morrisonlaw.com | Legal | P1 | Stable |
| T17 | Evergreen Consulting Group | evergreencg.com | Consulting | P3 | Stable |
| T18 | Brightside Dental Partners | brightsidedental.com | Healthcare | P2 | Stable |
| T19 | Urban Fitness Collective | urbanfitness.co | Fitness | P6, P9 | **Critical** |
| T20 | Cascade Coffee Roasters | cascadecoffee.com | F&B | P2 | Stable |
| T21 | Pinnacle Engineering LLC | pinnacleeng.com | Engineering | P3 | Stable |
| T22 | Harmony Wellness Spa | harmonywellness.com | Wellness | P9 | Watch |
| T23 | Keystone Accounting Services | keystoneacct.com | Accounting | P5 | Stable |
| T24 | Silverline Interiors | silverlineint.com | Design | P5 | Stable |
| T25 | Quantum Data Systems | quantumdata.io | Technology | P10 | **Improving** |
| T26 | Ridgeline Property Management | ridgelinepm.com | Real Estate | P3 | Stable |
| T27 | Coastal Marketing Agency | coastalmktg.com | Marketing | P7 | Stable |
| T28 | Summit HR Solutions | summithr.com | HR Services | P1 | Stable |
| T29 | Trailhead Outdoor Gear | trailheadgear.com | Retail | P6 | Watch |
| T30 | Nova Tech Repairs | novatechrepairs.com | Services | P4 | Stable |

---

## 3. Lease Map

| Tenant | Property | Suite/Unit | Est. Rent Share |
|--------|----------|------------|-----------------|
| T1 (Apex Retail) | P2 | Anchor | 35% |
| T1 (Apex Retail) | P6 | Anchor | 40% |
| T2 (Northstar Apparel) | P2 | Suite 200 | 15% |
| T2 (Northstar Apparel) | P9 | Suite 100 | 25% |
| T3 (Meridian Healthcare) | P1 | Floors 8-10 | 20% |
| T3 (Meridian Healthcare) | P5 | Floor 12 | 10% |
| T4 (TechFlow) | P3 | Building B | 30% |
| T4 (TechFlow) | P10 | Suite 500 | 15% |
| T5 (Continental Logistics) | P4 | Warehouse A | 40% |
| T5 (Continental Logistics) | P8 | Building 1 | 50% |
| T6 (Vertex Financial) | P1 | Floors 15-18 | 25% |
| T7 (BlueSky Mfg) | P4 | Warehouse B | 35% |
| T8 (Granite Construction) | P8 | Building 2 | 50% |
| T9 (Pacific Energy) | P7 | Floors 5-7 | 40% |
| T10 (Midwest Banking) | P1 | Floors 1-3 | 20% |
| T11 (National Insurance) | P5 | Floors 8-10 | 25% |
| T12 (Premier Foods) | P6 | Suite 150 | 20% |
| T13 (Atlantic Shipping) | P4 | Warehouse C | 25% |
| T14 (Redwood Pharma) | P10 | Suite 800 | 30% |
| T15 (Sterling Media) | P7 | Floors 10-12 | 35% |
| T16 (Morrison Law) | P1 | Suite 2200 | 8% |
| T17 (Evergreen Consulting) | P3 | Suite 300 | 15% |
| T18 (Brightside Dental) | P2 | Suite 50 | 5% |
| T19 (Urban Fitness) | P6 | Suite 300 | 15% |
| T19 (Urban Fitness) | P9 | Suite 200 | 30% |
| T20 (Cascade Coffee) | P2 | Kiosk | 3% |
| T21 (Pinnacle Eng) | P3 | Suite 400 | 20% |
| T22 (Harmony Wellness) | P9 | Suite 300 | 20% |
| T23 (Keystone Acct) | P5 | Suite 1500 | 8% |
| T24 (Silverline Int) | P5 | Suite 1800 | 7% |
| T25 (Quantum Data) | P10 | Suite 200 | 20% |
| T26 (Ridgeline PM) | P3 | Suite 100 | 10% |
| T27 (Coastal Mktg) | P7 | Suite 800 | 10% |
| T28 (Summit HR) | P1 | Suite 500 | 5% |
| T29 (Trailhead Gear) | P6 | Suite 400 | 12% |
| T30 (Nova Tech) | P4 | Unit 10 | 5% |

---

## 4. Snapshots

| Snapshot | as_of_date | Description |
|----------|------------|-------------|
| Current | 2026-01-17 | "This week" — primary demo view |
| Previous | 2026-01-10 | "Last week" — for delta comparison |

---

## 5. Storylines

### 5.1 Critical (3)

---

#### CRITICAL-1: Apex Retail Group (T1)

**Event Type:** `liquidity_stress`
**Severity:** 88 | **Confidence:** 0.85 | **Time Horizon:** immediate

**Headline:** Apex Retail discloses going concern warning and covenant breach in Q3 10-Q

**What Changed:**
Apex Retail Group disclosed substantial doubt about its ability to continue as a going concern in its Q3 2025 10-Q filing. The company breached its debt service coverage ratio covenant and is in active negotiations with lenders for a forbearance agreement. Same-store sales declined 18% year-over-year.

**Why It Matters:**
- Apex is anchor tenant at two properties (P2, P6) representing 35-40% of rent at each location
- Going concern language triggers potential lease termination clauses
- Covenant breach may accelerate debt maturity, forcing restructuring or bankruptcy
- Co-tenancy clauses at Park Plaza may allow other tenants to renegotiate if Apex vacates

**Recommended Actions:**
- Review lease termination provisions and co-tenancy clauses immediately
- Model rent replacement scenarios assuming 50% and 100% vacancy
- Engage legal counsel to assess landlord rights under forbearance scenarios
- Identify potential replacement anchor tenants proactively

**What to Watch Next:**
- Forbearance agreement terms (expected within 30 days)
- Q4 earnings call for updated guidance

**Evidence Sources:**

| ID | Type | Title | Publisher | Date | Tier |
|----|------|-------|-----------|------|------|
| E1-1 | sec_filing | Form 10-Q Q3 2025 | SEC EDGAR | 2026-01-14 | 1 |
| E1-2 | sec_filing | Form 8-K Current Report | SEC EDGAR | 2026-01-15 | 1 |
| E1-3 | news | "Apex Retail warns of going concern, seeks lender relief" | Reuters | 2026-01-15 | 2 |
| E1-4 | news | "Retail sector distress deepens as Apex joins troubled list" | Wall Street Journal | 2026-01-16 | 2 |

**Key Excerpts:**

> **E1-1:** "These conditions raise substantial doubt about the Company's ability to continue as a going concern... The Company was not in compliance with the debt service coverage ratio covenant under its senior secured credit facility as of September 30, 2025."

> **E1-2:** "The Company has entered into discussions with its lenders regarding potential amendments to or waivers of certain covenants under its credit agreement."

> **E1-3:** "Apex Retail Group Inc said on Wednesday it has 'substantial doubt' about its ability to remain in business, as the struggling department store operator seeks relief from lenders after breaching debt covenants."

---

#### CRITICAL-2: Northstar Apparel Inc (T2)

**Event Type:** `bankruptcy_or_restructuring`
**Severity:** 92 | **Confidence:** 0.88 | **Time Horizon:** immediate

**Headline:** Northstar Apparel announces store closure program and explores strategic alternatives including potential Chapter 11

**What Changed:**
Northstar Apparel announced plans to close 150 of its 400 stores nationwide and retained Kirkland & Ellis to explore strategic alternatives, including a potential Chapter 11 filing. The company's revolving credit facility was fully drawn and liquidity is projected to be exhausted by Q2 2026.

**Why It Matters:**
- Northstar occupies space at P2 (Park Plaza) and P9 (Willowbrook Plaza)
- "Strategic alternatives" with restructuring counsel is a strong bankruptcy signal
- Combined with Apex distress, Park Plaza now has 50% of anchor rent at risk
- Store closure list not yet released — our locations may be affected

**Recommended Actions:**
- Determine if P2 and P9 locations are on closure list (contact tenant directly)
- Prepare for lease rejection scenario in Chapter 11
- Assess combined impact with Apex at Park Plaza — property may need repositioning
- Review security deposits and letter of credit coverage

**What to Watch Next:**
- Store closure list (expected within 2 weeks)
- Any DIP financing announcements
- Chapter 11 filing (if it occurs)

**Evidence Sources:**

| ID | Type | Title | Publisher | Date | Tier |
|----|------|-------|-----------|------|------|
| E2-1 | press_release | "Northstar Apparel Announces Comprehensive Transformation Plan" | Company IR | 2026-01-13 | 1 |
| E2-2 | news | "Northstar taps Kirkland & Ellis as it weighs bankruptcy" | Bloomberg | 2026-01-14 | 2 |
| E2-3 | news | "Apparel retailer Northstar to shutter 150 stores" | CNBC | 2026-01-13 | 2 |
| E2-4 | sec_filing | Form 8-K Current Report | SEC EDGAR | 2026-01-13 | 1 |

**Key Excerpts:**

> **E2-1:** "As part of this transformation, the Company plans to close approximately 150 underperforming locations and has retained Kirkland & Ellis LLP and Lazard to advise on strategic alternatives to strengthen its balance sheet."

> **E2-2:** "Northstar Apparel Inc. has hired law firm Kirkland & Ellis LLP as it weighs options including a potential bankruptcy filing, according to people familiar with the matter."

> **E2-4:** "The Company's liquidity position has deteriorated significantly. Based on current projections, the Company expects available liquidity to be insufficient to meet obligations beyond the second quarter of 2026."

---

#### CRITICAL-3: Urban Fitness Collective (T19)

**Event Type:** `operational_disruption`
**Severity:** 82 | **Confidence:** 0.78 | **Time Horizon:** near_term

**Headline:** Urban Fitness abruptly closes 8 locations citing "cash flow challenges"; landlord lawsuits filed

**What Changed:**
Urban Fitness Collective, a private regional fitness chain, abruptly closed 8 of its 12 locations this week without notice to landlords. Multiple landlords have filed lawsuits for breach of lease. Local news reports indicate the company failed to make January rent payments at most locations.

**Why It Matters:**
- Urban Fitness occupies space at P6 (Southfield) and P9 (Willowbrook)
- Abrupt closure pattern suggests severe financial distress, not orderly wind-down
- Combined with Northstar at P9, Willowbrook now has 55% of rent at elevated risk
- Private company with limited financial visibility — situation may be worse than reported

**Recommended Actions:**
- Confirm rent payment status for January at both locations
- Issue default notice if rent is unpaid
- Assess security deposit and guarantor coverage
- Begin marketing space for re-tenanting immediately

**What to Watch Next:**
- Whether remaining 4 locations (including ours) stay open
- Any bankruptcy filing
- Guarantor financial capacity

**Evidence Sources:**

| ID | Type | Title | Publisher | Date | Tier |
|----|------|-------|-----------|------|------|
| E3-1 | news | "Urban Fitness closes 8 gyms overnight, members locked out" | Detroit Free Press | 2026-01-15 | 2 |
| E3-2 | news | "Fitness chain owes landlords millions after sudden closures" | Austin Business Journal | 2026-01-16 | 2 |
| E3-3 | court | "Southfield Mall LLC v. Urban Fitness Collective" | Wayne County Circuit Court | 2026-01-16 | 1 |

**Key Excerpts:**

> **E3-1:** "Members of Urban Fitness Collective arrived to find doors locked and a handwritten sign citing 'cash flow challenges' at eight locations across Michigan and Texas that closed without warning this week."

> **E3-2:** "At least five landlords have filed lawsuits against Urban Fitness Collective seeking unpaid rent totaling more than $2.3 million. The company reportedly failed to pay January rent at most locations."

---

### 5.2 Watch (6)

---

#### WATCH-1: Meridian Healthcare Systems (T3)

**Event Type:** `covenant_or_debt_event`
**Severity:** 68 | **Confidence:** 0.72 | **Time Horizon:** near_term

**Headline:** Meridian Healthcare amends credit facility with tighter covenants and pricing increase

**What Changed:**
Meridian Healthcare disclosed an amendment to its senior credit facility that provides covenant relief but increases pricing by 75 basis points and adds new financial reporting requirements. The company narrowly avoided a covenant breach in Q3.

**Why It Matters:**
- Amendment signals lender concern about credit trajectory
- Higher borrowing costs will pressure margins
- Meridian occupies significant space at P1 and P5
- Healthcare sector facing reimbursement headwinds

**Recommended Actions:**
- Monitor Q4 earnings for covenant compliance
- Review lease expiration timing
- Assess tenant's ability to absorb rent increases at renewal

**What to Watch Next:**
- Q4 2025 earnings and updated guidance
- Any further credit facility changes

**Evidence Sources:**

| ID | Type | Title | Publisher | Date | Tier |
|----|------|-------|-----------|------|------|
| E4-1 | sec_filing | Form 8-K Credit Agreement Amendment | SEC EDGAR | 2026-01-10 | 1 |
| E4-2 | news | "Meridian secures breathing room from lenders" | Modern Healthcare | 2026-01-11 | 2 |

**Key Excerpts:**

> **E4-1:** "The Amendment provides for, among other things, (i) a waiver of the Company's compliance with the Total Leverage Ratio covenant for the fiscal quarter ended September 30, 2025, and (ii) an increase in the applicable margin by 0.75%."

---

#### WATCH-2: TechFlow Solutions (T4)

**Event Type:** `earnings_shock_or_guidance_cut`
**Severity:** 62 | **Confidence:** 0.70 | **Time Horizon:** near_term

**Headline:** TechFlow cuts FY26 guidance by 20% citing enterprise spending slowdown

**What Changed:**
TechFlow Solutions reduced its FY26 revenue guidance from $450M to $360M, citing delayed enterprise deals and longer sales cycles. The company also announced a 15% workforce reduction.

**Why It Matters:**
- Significant guidance cut suggests demand deterioration
- Layoffs may reduce space needs at P3 and P10
- Tech sector tenant with growth-dependent business model
- May seek lease modifications or early termination

**Recommended Actions:**
- Proactively engage tenant on space needs
- Review early termination provisions
- Model scenarios for partial space give-back

**What to Watch Next:**
- Q4 earnings for signs of stabilization
- Any sublease marketing activity

**Evidence Sources:**

| ID | Type | Title | Publisher | Date | Tier |
|----|------|-------|-----------|------|------|
| E5-1 | sec_filing | Form 8-K Guidance Update | SEC EDGAR | 2026-01-12 | 1 |
| E5-2 | news | "TechFlow slashes outlook, cuts 15% of staff" | TechCrunch | 2026-01-12 | 2 |

**Key Excerpts:**

> **E5-1:** "The Company is updating its fiscal year 2026 revenue guidance to a range of $350 million to $370 million, down from prior guidance of $440 million to $460 million, reflecting a more challenging demand environment."

---

#### WATCH-3: Continental Logistics Corp (T5)

**Event Type:** `operational_disruption`
**Severity:** 58 | **Confidence:** 0.65 | **Time Horizon:** near_term

**Headline:** Continental Logistics loses major Amazon contract, stock drops 25%

**What Changed:**
Continental Logistics announced that Amazon will not renew its delivery services contract, which represented 30% of the company's revenue. The contract expires in June 2026.

**Why It Matters:**
- Major revenue concentration loss
- May need to downsize warehouse footprint
- Occupies significant space at P4 and P8 (industrial)
- Stock decline may trigger debt covenant issues

**Recommended Actions:**
- Monitor for lease modification requests
- Assess alternative tenant demand for industrial space
- Review financial covenants in lease

**What to Watch Next:**
- Replacement contract announcements
- Q4 earnings and guidance

**Evidence Sources:**

| ID | Type | Title | Publisher | Date | Tier |
|----|------|-------|-----------|------|------|
| E6-1 | sec_filing | Form 8-K Material Contract | SEC EDGAR | 2026-01-08 | 1 |
| E6-2 | news | "Continental Logistics tumbles after losing Amazon deal" | FreightWaves | 2026-01-08 | 2 |

**Key Excerpts:**

> **E6-1:** "The Company was notified that Amazon.com Services LLC will not renew the Delivery Service Partner Agreement upon its expiration on June 30, 2026. This contract represented approximately 30% of the Company's consolidated revenues."

---

#### WATCH-4: Vertex Financial Services (T6)

**Event Type:** `litigation_or_regulatory`
**Severity:** 65 | **Confidence:** 0.68 | **Time Horizon:** structural

**Headline:** Vertex Financial faces SEC investigation over accounting practices

**What Changed:**
Vertex Financial disclosed receipt of an SEC subpoena related to revenue recognition practices in its advisory business. The company stated it is cooperating with the investigation.

**Why It Matters:**
- SEC investigations can result in material fines and restatements
- Reputational damage in financial services sector
- Vertex occupies premium floors at Riverside Tower (P1)
- Investigation timeline uncertain — could persist for years

**Recommended Actions:**
- Monitor SEC filings for investigation updates
- No immediate action required but elevated monitoring warranted

**What to Watch Next:**
- SEC investigation developments
- Any earnings restatements

**Evidence Sources:**

| ID | Type | Title | Publisher | Date | Tier |
|----|------|-------|-----------|------|------|
| E7-1 | sec_filing | Form 8-K Legal Proceedings | SEC EDGAR | 2026-01-06 | 1 |

**Key Excerpts:**

> **E7-1:** "On January 3, 2026, the Company received a subpoena from the Securities and Exchange Commission relating to an investigation of the Company's revenue recognition practices. The Company is cooperating fully with the SEC."

---

#### WATCH-5: Sterling Media Group (T15)

**Event Type:** `liquidity_stress`
**Severity:** 60 | **Confidence:** 0.62 | **Time Horizon:** near_term

**Headline:** Sterling Media draws down revolver, hires restructuring advisor

**What Changed:**
Sterling Media Group fully drew its $150M revolving credit facility and engaged Alvarez & Marsal as a financial advisor. The company cited "proactive balance sheet management" but the moves suggest liquidity pressure.

**Why It Matters:**
- Full revolver draw is a classic distress signal
- Restructuring advisor engagement elevates bankruptcy risk
- Sterling occupies 3 floors at Harbor Point (P7)
- Media sector facing structural headwinds

**Recommended Actions:**
- Increase monitoring frequency
- Review lease security provisions
- Model vacancy scenarios for P7

**What to Watch Next:**
- Any asset sales or financing announcements
- Q4 earnings

**Evidence Sources:**

| ID | Type | Title | Publisher | Date | Tier |
|----|------|-------|-----------|------|------|
| E8-1 | sec_filing | Form 8-K Liquidity Update | SEC EDGAR | 2026-01-11 | 1 |
| E8-2 | news | "Sterling Media taps Alvarez & Marsal amid cash crunch" | Variety | 2026-01-12 | 2 |

**Key Excerpts:**

> **E8-1:** "The Company elected to draw the remaining $150 million available under its revolving credit facility to enhance financial flexibility."

> **E8-2:** "Sterling Media Group has retained restructuring firm Alvarez & Marsal to advise on options as the company grapples with declining advertising revenue and rising content costs."

---

#### WATCH-6: Harmony Wellness Spa (T22)

**Event Type:** `operational_disruption`
**Severity:** 56 | **Confidence:** 0.58 | **Time Horizon:** near_term

**Headline:** Harmony Wellness owner facing personal bankruptcy, business continuity uncertain

**What Changed:**
Local court filings reveal that the principal owner of Harmony Wellness Spa has filed for personal Chapter 7 bankruptcy, listing significant personal guarantees on business debts. The spa's operating status is uncertain.

**Why It Matters:**
- Personal bankruptcy of guarantor weakens lease security
- Small tenant but part of P9 tenant mix already stressed by Northstar and Urban Fitness
- Private company with no financial transparency

**Recommended Actions:**
- Verify current rent payment status
- Assess personal guarantee enforceability post-bankruptcy
- Prepare for potential vacancy

**What to Watch Next:**
- Business operating status
- Any lease assignment or sale attempts

**Evidence Sources:**

| ID | Type | Title | Publisher | Date | Tier |
|----|------|-------|-----------|------|------|
| E9-1 | court | "In re: James Morrison Chapter 7" | U.S. Bankruptcy Court W.D. Texas | 2026-01-09 | 1 |
| E9-2 | news | "Local spa owner files bankruptcy, business future unclear" | Austin American-Statesman | 2026-01-10 | 2 |

**Key Excerpts:**

> **E9-2:** "James Morrison, owner of the Harmony Wellness Spa chain, filed for personal Chapter 7 bankruptcy this week, listing debts of more than $1.2 million including personal guarantees on business leases."

---

### 5.3 Improving (4)

---

#### IMPROVING-1: BlueSky Manufacturing (T7)

**Event Type:** `earnings_beat_or_guidance_raise`
**Severity:** 70 | **Confidence:** 0.82 | **Time Horizon:** near_term
**Sentiment:** positive

**Headline:** BlueSky raises FY26 guidance after record Q3, announces facility expansion

**What Changed:**
BlueSky Manufacturing reported record Q3 results, beating estimates by 15%, and raised FY26 guidance by 20%. The company announced plans to expand its Phoenix facility, which would increase its footprint at P4.

**Why It Matters:**
- Strong operational momentum reduces credit risk
- Expansion plans suggest long-term commitment to P4
- Potential lease expansion opportunity
- Counter-balances Continental Logistics weakness at P4

**Recommended Actions:**
- Engage tenant on expansion plans proactively
- Prepare expansion proposal for additional space at P4
- Consider lease extension discussions

**What to Watch Next:**
- Expansion timeline and space requirements
- Continued earnings momentum

**Evidence Sources:**

| ID | Type | Title | Publisher | Date | Tier |
|----|------|-------|-----------|------|------|
| E10-1 | sec_filing | Form 8-K Earnings Release | SEC EDGAR | 2026-01-07 | 1 |
| E10-2 | press_release | "BlueSky Announces Phoenix Expansion" | Company IR | 2026-01-08 | 1 |

**Key Excerpts:**

> **E10-1:** "Q3 2025 revenue of $285 million exceeded guidance of $245-$250 million. The Company is raising its FY26 revenue guidance to $1.15-$1.20 billion from $950 million-$1.0 billion."

> **E10-2:** "BlueSky Manufacturing today announced plans to expand its Phoenix manufacturing facility by 150,000 square feet to meet growing demand."

---

#### IMPROVING-2: Granite Construction Holdings (T8)

**Event Type:** `debt_paydown_or_refinance`
**Severity:** 65 | **Confidence:** 0.78 | **Time Horizon:** structural
**Sentiment:** positive

**Headline:** Granite Construction completes debt refinancing, extends maturities to 2031

**What Changed:**
Granite Construction successfully refinanced its entire debt stack, extending maturities from 2027 to 2031 and reducing interest expense by $15M annually. Credit rating upgraded to BB+ from BB.

**Why It Matters:**
- Materially improved balance sheet and liquidity
- Rating upgrade signals improved creditworthiness
- Granite is 50% of rent at P8 — reduced risk for that property
- Infrastructure spending tailwinds support continued strength

**Recommended Actions:**
- Consider lease extension at favorable terms given improved credit
- Reclassify from Watch to Stable in next snapshot

**What to Watch Next:**
- Continued infrastructure project wins
- Credit rating trajectory

**Evidence Sources:**

| ID | Type | Title | Publisher | Date | Tier |
|----|------|-------|-----------|------|------|
| E11-1 | sec_filing | Form 8-K Debt Refinancing | SEC EDGAR | 2026-01-05 | 1 |
| E11-2 | news | "Granite Construction gets credit upgrade after refi" | Construction Dive | 2026-01-06 | 2 |

**Key Excerpts:**

> **E11-1:** "The Company completed the refinancing of its senior secured credit facilities, extending the maturity date to January 2031 and reducing the applicable interest rate margin by 50 basis points."

> **E11-2:** "S&P Global Ratings upgraded Granite Construction Holdings to BB+ from BB, citing improved liquidity and extended debt maturities following the company's successful refinancing."

---

#### IMPROVING-3: Redwood Pharmaceuticals (T14)

**Event Type:** `expansion_or_growth`
**Severity:** 68 | **Confidence:** 0.75 | **Time Horizon:** near_term
**Sentiment:** positive

**Headline:** Redwood Pharma announces FDA approval for lead drug, stock surges 40%

**What Changed:**
Redwood Pharmaceuticals received FDA approval for its lead oncology drug, a major de-risking event. The company announced plans to double its commercial team and expand headquarters operations.

**Why It Matters:**
- FDA approval removes major business risk
- Expansion plans suggest increased space needs at P10
- Stock surge improves balance sheet and access to capital
- Biotech tenant transitioning from development to commercial stage

**Recommended Actions:**
- Proactively discuss expansion options at Summit Technology Park
- Consider longer-term lease commitment given improved outlook

**What to Watch Next:**
- Commercial launch progress
- Additional pipeline developments

**Evidence Sources:**

| ID | Type | Title | Publisher | Date | Tier |
|----|------|-------|-----------|------|------|
| E12-1 | press_release | "Redwood Announces FDA Approval of REDX-101" | Company IR | 2026-01-09 | 1 |
| E12-2 | news | "Redwood Pharma soars on FDA nod for cancer drug" | BioPharma Dive | 2026-01-09 | 2 |

**Key Excerpts:**

> **E12-1:** "Redwood Pharmaceuticals today announced that the U.S. Food and Drug Administration has approved REDX-101 for the treatment of advanced non-small cell lung cancer. The Company plans to significantly expand its commercial organization and headquarters operations."

---

#### IMPROVING-4: Quantum Data Systems (T25)

**Event Type:** `liquidity_improvement`
**Severity:** 62 | **Confidence:** 0.70 | **Time Horizon:** near_term
**Sentiment:** positive

**Headline:** Quantum Data closes $50M Series C funding, achieves profitability

**What Changed:**
Quantum Data Systems, a private AI infrastructure company, closed a $50M Series C round and announced it achieved profitability for the first time in Q4 2025. The company plans to expand its engineering team.

**Why It Matters:**
- Private company now has strong balance sheet and profitability
- Funding validates business model and growth trajectory
- May seek additional space at P10
- Tech tenant with improving (not deteriorating) fundamentals

**Recommended Actions:**
- Engage on potential expansion needs
- Consider longer lease term at renewal

**What to Watch Next:**
- Headcount growth and space requirements
- Continued profitability

**Evidence Sources:**

| ID | Type | Title | Publisher | Date | Tier |
|----|------|-------|-----------|------|------|
| E13-1 | news | "Quantum Data raises $50M Series C, hits profitability" | TechCrunch | 2026-01-11 | 2 |
| E13-2 | press_release | "Quantum Data Systems Announces Series C Funding" | PR Newswire | 2026-01-11 | 2 |

**Key Excerpts:**

> **E13-1:** "Quantum Data Systems, which provides AI infrastructure for enterprise customers, has raised $50 million in Series C funding led by Sequoia Capital. The company also announced it achieved profitability in Q4 2025."

---

### 5.4 Stable (17)

The remaining 17 tenants have no material events in the current snapshot:

T9, T10, T11, T12, T13, T16, T17, T18, T20, T21, T23, T24, T26, T27, T28, T29*, T30

*T29 (Trailhead Outdoor Gear) was Watch in previous snapshot but improved to Stable after reporting solid holiday sales.

---

## 6. Portfolio-Level Synthesis

### 6.1 Portfolio Verdict

> **Portfolio status:** Risk increased modestly this week, driven by three retail tenant distress situations. Concentration risk elevated at two properties. No systemic deterioration detected — issues are sector-specific (retail) rather than portfolio-wide.

### 6.2 Executive Narrative Bullets

1. 🔴 **Priority 1:** Retail exposure deteriorated significantly due to three unrelated tenant distress events (Apex, Northstar, Urban Fitness). Two properties now have >50% rent at risk.

2. 🔴 **Priority 1:** Park Plaza (P2) has compounding risk — both anchor tenants (Apex, Northstar) disclosed material distress this week.

3. 🟡 **Priority 2:** Willowbrook Plaza (P9) tenant mix stressed — Northstar and Urban Fitness represent 55% of rent.

4. 🟡 **Priority 2:** Watch-list grew by 2 tenants (Sterling Media, Harmony Wellness). Both are liquidity-related.

5. ⚪ **Priority 3:** Four tenants showed credit improvement, partially offsetting deterioration.

### 6.3 Concentration Insights

- "Retail tenants account for 78% of all Critical/Watch exposure."
- "Two properties (P2, P9) contain 60% of portfolio credit risk signals."
- "Three tenants (Apex, Northstar, Urban Fitness) drive 85% of Critical exposure."

### 6.4 Questions to Raise This Week

- "What is our contingency plan for Park Plaza if both anchors fail?"
- "Should we accelerate re-tenanting efforts at Willowbrook Plaza?"
- "Are we comfortable with retail concentration in the portfolio?"

### 6.5 Coverage

> **30 tenants reviewed. 13 required attention. 17 stable.**

---

## 7. Week-over-Week Delta

| Metric | Last Week | This Week | Change |
|--------|-----------|-----------|--------|
| Critical | 1 | 3 | +2 |
| Watch | 4 | 6 | +2 |
| Improving | 3 | 4 | +1 |
| Stable | 22 | 17 | -5 |
| Deteriorated | — | 4 | — |
| Improved | — | 1 | — |

**Tenants that deteriorated:**
- Apex Retail: Watch → Critical
- Northstar Apparel: Watch → Critical
- Urban Fitness: Stable → Critical
- Sterling Media: Stable → Watch

**Tenants that improved:**
- Trailhead Outdoor Gear: Watch → Stable

---

## 8. Evidence Source Index

| ID | Tenant | Type | Title | Tier |
|----|--------|------|-------|------|
| E1-1 | T1 | sec_filing | Form 10-Q Q3 2025 | 1 |
| E1-2 | T1 | sec_filing | Form 8-K Current Report | 1 |
| E1-3 | T1 | news | Reuters article | 2 |
| E1-4 | T1 | news | WSJ article | 2 |
| E2-1 | T2 | press_release | Transformation announcement | 1 |
| E2-2 | T2 | news | Bloomberg bankruptcy article | 2 |
| E2-3 | T2 | news | CNBC store closure article | 2 |
| E2-4 | T2 | sec_filing | Form 8-K liquidity | 1 |
| E3-1 | T19 | news | Detroit Free Press | 2 |
| E3-2 | T19 | news | Austin Business Journal | 2 |
| E3-3 | T19 | court | Landlord lawsuit | 1 |
| E4-1 | T3 | sec_filing | Form 8-K credit amendment | 1 |
| E4-2 | T3 | news | Modern Healthcare | 2 |
| E5-1 | T4 | sec_filing | Form 8-K guidance | 1 |
| E5-2 | T4 | news | TechCrunch | 2 |
| E6-1 | T5 | sec_filing | Form 8-K contract loss | 1 |
| E6-2 | T5 | news | FreightWaves | 2 |
| E7-1 | T6 | sec_filing | Form 8-K SEC subpoena | 1 |
| E8-1 | T15 | sec_filing | Form 8-K revolver draw | 1 |
| E8-2 | T15 | news | Variety | 2 |
| E9-1 | T22 | court | Chapter 7 filing | 1 |
| E9-2 | T22 | news | Austin American-Statesman | 2 |
| E10-1 | T7 | sec_filing | Form 8-K earnings | 1 |
| E10-2 | T7 | press_release | Expansion announcement | 1 |
| E11-1 | T8 | sec_filing | Form 8-K refinancing | 1 |
| E11-2 | T8 | news | Construction Dive | 2 |
| E12-1 | T14 | press_release | FDA approval | 1 |
| E12-2 | T14 | news | BioPharma Dive | 2 |
| E13-1 | T25 | news | TechCrunch funding | 2 |
| E13-2 | T25 | press_release | Series C announcement | 2 |

---

## 9. Demo Script Mapping

| Step | Action | Tenant/Property | What They See |
|------|--------|-----------------|---------------|
| 1 | Open app | — | Portfolio verdict + 5 priority bullets |
| 2 | Read verdict | — | "Risk increased modestly... retail sector" |
| 3 | Tap Priority 1 bullet | — | Expands to show Apex, Northstar, Urban Fitness |
| 4 | Tap Apex Retail | T1 | Full memo with going concern details |
| 5 | Tap "View Evidence" | T1 | Bottom sheet with 10-Q excerpt |
| 6 | Back, tap "Concentration" | — | "Two properties contain 60% of risk" |
| 7 | Tap Park Plaza | P2 | Property view showing Apex + Northstar |
| 8 | Tap "Questions to raise" | — | "What is our contingency plan..." |
| 9 | Switch to AM role | — | Brief filters to assigned properties |
| 10 | Tap a positive item | T7 | BlueSky expansion memo |
| 11 | Search "Redwood" | T14 | FDA approval improving story |

**Backup paths if asked:**
- "What about industrial?" → Show P4 with BlueSky improving, Continental watch
- "Show me something stable" → Search any stable tenant, show empty event timeline
- "How do you handle private companies?" → Show Urban Fitness (T19) with news + court sources

---

**End of demo dataset blueprint.**
