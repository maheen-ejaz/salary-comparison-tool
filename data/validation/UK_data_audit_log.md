# UK Data Audit Log

This file records source conflicts, cross-check results, and any data quality issues discovered during collection or use.

---

## Collection Session: February 17, 2026

### Exchange Rate
- **Source used:** ExchangeRate-API (api.exchangerate-api.com) mid-market rate
- **Rate:** 1 GBP = £123.60 INR
- **AUD/INR used for OET:** 1 AUD = ₹63.42 (OFX/Wise mid-market)
- **Status:** No conflicts. Single authoritative source used.

---

### Salary Data

**FY1/FY2 Salaries:**
- Agent research found two different figures:
  - NHS Pay Circular 2025-26 (M&D 2/2025): FY1=£38,831, FY2=£44,439
  - An older 2024-25 reference: FY1=£32,082-£35,790 range
- **Decision:** Used 2025-26 figures (from 1 April 2025) as these are current. The 2024-25 figures reflect the pre-deal pay scale and are now superseded.
- **Flag:** Estimation_Flag = N (official circular confirmed)

**Registrar Salary Range:**
- CT1/ST1-2 = £49,909; ST3-4 = £61,825; ST8 = £73,992 — all from NHS pay circular
- **Status:** No conflicts. Direct from pay circular.

**Consultant Salaries:**
- Primary source: NHS pay award 2025-26 (gov.uk) — Threshold 1: £109,725; Max: £145,478
- Nuffield Trust 2025 reports average total earnings including supplements at ~£161,600
- **Decision:** Used £109,725 as Min, ~£128,000 as Typical (mid-range thresholds), £145,478 as Max (base pay only)
- **Note:** The £161,600 figure includes Clinical Excellence Awards and supplements — useful context but not the base figure for tax calculations

**Private Sector Salaries:**
- No standardised published rates available
- BMA Private Practice Survey 2024 referenced but specific figures not publicly available at granular level
- IMG Connect 2025 cited for consultant private earnings
- **Decision:** Used researched ranges with Estimation_Flag = Y and detailed Notes
- **Verification needed:** Cross-check against BMA Private Practice Survey when available (BMA members only)

---

### Tax Data (2025-26)

**National Insurance Rate:**
- Research confirms NI main rate = 8% for 2025-26 (reduced from 12% → 10% Jan 2024, then to 8% April 2024; confirmed unchanged for 2025-26 per Autumn Budget 2024)
- Sources consistent across: gov.uk, FreeAgent, Meranti Accounting, Crunch.co.uk
- **Status:** Confirmed, Estimation_Flag = N

**NHS Pension Tiers:**
- Research found 6 tiers (not 5 as originally estimated in the plan)
- Thresholds uplifted by 3.6% from April 2025 (confirmed from NHSBSA official source and gov.uk report)
- New tier 5 (£50,846–£65,190 @ 10.7%) was confirmed as a distinct tier separate from the old structure
- **Status:** Updated plan from 5 to 6 tiers. All from NHSBSA official source. Estimation_Flag = N

**Personal Allowance Withdrawal:**
- Confirmed: PA starts withdrawing at £100,000, fully withdrawn at £125,140 → 60% effective marginal rate
- This is critical context for consultant pay calculations and flagged in Notes column

---

### Migration Costs

**PLAB Fees:**
- PLAB 1: £283 (agent found 2026 updated fee — up from £239 previously)
- PLAB 2: £1,036 (agent found 2026 updated fee — up from £906 previously)
- **Verification needed:** Cross-check directly at gmc-uk.org/registration-and-licensing/managing-your-registration/fees-and-funding/fees-for-doctors to confirm 2026 fee schedule (agent may have used secondary sources)

**Visa Fees:**
- Skilled Worker Visa: £769 (increased April 9, 2025 from £719)
- **Status:** Confirmed from DavidsonMorris immigration law source

**Immigration Health Surcharge:**
- £1,035/year confirmed for 2026 from DavidsonMorris
- 3-year total: £3,105 = ₹383,778 at £1=₹123.60
- **Note:** This is the single largest component of migration costs — prominently display in tool

**Coaching Fees:**
- Range ₹8,000–₹1,05,000 confirmed from GATEIIT, MedRevisions, market research
- **Status:** Wide range acknowledged; used ₹50,000 as typical. Estimation_Flag = Y

**Certificate Attestation:**
- Official MEA fee: ₹50-200/document
- Service charges from private agencies vary widely
- **Decision:** Used ₹10,000 as typical estimate (multiple documents needed: MBBS certificate, transcripts, experience letters, ID)
- **Status:** Estimation_Flag = Y

---

### Cost of Living Data

**London Rent (1BHK):**
- Numbeo: £2,337/month (city centre)
- Rightmove search: £1,800–£2,800 (zone-dependent)
- **Decision:** Used Numbeo figure as it represents a standardised average. Rightmove listings skew high as they show asking price not agreed rent.

**Edinburgh Rent (1BHK):**
- Numbeo: £1,181/month
- Rightmove: £1,100–£1,400 range
- **Decision:** Used Numbeo figure (£1,181). Sources consistent.

**Manchester Rent (Family 3-bed):**
- Numbeo city-centre 3-bed: £2,330
- Rightmove 2-3 bed family homes: £1,100–£1,500
- **Decision:** Used £1,500 (Rightmove upper realistic for accessible family areas) rather than Numbeo city-centre figure. City-centre 3-bed data in Numbeo is less reliable than 1-bed data.
- **Flag:** Estimation_Flag = Y

**Birmingham Rent (Shared):**
- SpareRoom range: £540–£775
- Numbeo outside-centre 1-bed: £825 (not directly comparable to shared room)
- **Decision:** Used midpoint of SpareRoom range: £658

**Cardiff Transport:**
- Agent found £60/month for Cardiff Bus monthly pass
- Also mentioned PlusBus at £4.50/day which at 20 working days = £90/month
- **Decision:** Used £60 as the monthly pass for basic/moderate. PlusBus is a day-ticket option, not a monthly pass.

**Edinburgh Scottish Income Tax:**
- Flagged in every Edinburgh row in Notes
- Not modelled in Tax_Rules.csv (uses rUK rates as placeholder)
- **Action required:** Either add a separate Scotland tax table before launch, or prominently flag in UI

---

## Items Requiring Manual Re-Verification Before Launch

| Priority | Item | Action |
|---|---|---|
| HIGH | PLAB 1/2 fees (£283/£1,036) | Verify directly at gmc-uk.org fee schedule — secondary sources used |
| HIGH | Edinburgh Scottish Income Tax rates | Add Scotland-specific Tax_Rules rows or add UI warning |
| MEDIUM | Consultant typical salary (£128,000) | Verify against BMA pay tracker for current mid-career consultant |
| MEDIUM | Private sector salary ranges | Cross-check against BMA Private Practice Survey (members only) |
| LOW | Manchester family 3-bed rent | Re-check Zoopla rental index for Q1 2026 |
| LOW | Coaching fees | Survey current PLAB coaching market (fees change frequently) |

---

## Next Update Due

| Dataset | Next Review | Notes |
|---|---|---|
| All salary figures | April 2026 | NHS pay year |
| All tax rules | April 2026 | UK tax year |
| NHS pension tiers | April 2026 | Uplifted annually |
| GMC/Visa fees | October 2026 | Check for updates |
| Cost of living | August 2026 | 6-month cadence |
| Currency rate | Monthly | Integrate live API in web tool |
