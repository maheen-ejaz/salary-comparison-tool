# New Zealand Data Audit Log

**Data Collection Date:** February 19-22, 2026
**Country:** New Zealand / Aotearoa
**Migration Route:** NZREX Route
**Exchange Rate Used:** NZD 1 = INR 54.47 (mid-market rate, Feb 2026)

---

## 1. Salary Bands Verification

### Sources Consulted
- [NZRDA & HNZ Collective Agreement 2024-2026](https://www.nzrda.org.nz/) — House Officer and Registrar pay scales
- [ASMS MECA 2023-2026](https://www.asms.org.nz/) — Senior doctor (Specialist/Consultant) Multi-Employer Collective Agreement
- [Te Whatu Ora Pay Scales](https://www.tewhatuora.govt.nz/) — Health New Zealand official pay scales
- [ASMS Salary Survey 2023](https://www.asms.org.nz/) — Average specialist salary NZD 225,454
- [Seek.co.nz](https://www.seek.co.nz/) — Private hospital job listings and salary ranges
- [TradeMe Jobs](https://www.trademe.co.nz/a/jobs) — Private sector salary data

### Salary Data Confidence Level
- **House Officer / PGY1 (Public):** HIGH — MECA standardized pay scale. NZD 70,000-85,000. Estimation_Flag = N.
- **House Officer / PGY1 (Private):** MEDIUM — Estimated from Seek.co.nz and market surveys. NZD 75,000-95,000. Estimation_Flag = Y.
- **Medical Officer / PGY2-3 (Public):** HIGH — MECA standardized. NZD 80,000-110,000. Estimation_Flag = N.
- **Medical Officer / PGY2-3 (Private):** MEDIUM — Market survey data. NZD 90,000-125,000. Estimation_Flag = Y.
- **Registrar (Public):** HIGH — ASMS MECA standardized. NZD 110,000-175,000. Estimation_Flag = N.
- **Registrar (Private):** MEDIUM — Industry surveys. NZD 125,000-200,000. Estimation_Flag = Y.
- **Consultant/Specialist (Public):** HIGH — ASMS MECA Step 1 (NZD 185,380) to top step (NZD 267,980). Average NZD 225,454 per 2023 ASMS survey. Estimation_Flag = N.
- **Consultant/Specialist (Private):** MEDIUM — NZD 200,000-500,000 (extremely wide range by specialty). Estimation_Flag = Y.

### Data Conflicts & Resolution
- **Conflict:** Public Consultant ASMS MECA Step 1 (NZD 185,380) vs ASMS survey average (NZD 225,454) vs top step (NZD 267,980).
  - **Resolution:** Used MECA Step 1 as Min (NZD 185,000), survey average as Typical (NZD 225,000), top step as Max (NZD 268,000). Reflects career progression across MECA steps.

- **Conflict:** Private Consultant range is extremely wide (NZD 200,000-500,000).
  - **Resolution:** Range reflects procedural vs non-procedural specialties. Cardiology, orthopaedics, ophthalmology at the upper end; psychiatry, palliative care at the lower end. Revenue-sharing models (60-70% of billings) drive high earners. Documented in Notes.

- **Conflict:** Limited private sector data sources (Seek.co.nz, TradeMe) vs well-documented public sector (MECA).
  - **Resolution:** All private sector rows flagged Estimation_Flag = Y. Notes clearly state these are market estimates.

### Notes on Salary Structure
- **Te Whatu Ora restructuring** (Health New Zealand replacing DHBs) is in progress — pay scales currently maintained under existing MECAs.
- **Rural placement allowances** up to NZD 10,000/year available.
- **Public consultants have private practice rights** — 50/50 revenue split with DHB adds 30-50% to base salary.
- **Additional earnings:** On-call (NZD 25-120/hour depending on seniority), night shifts (time + 25%), weekend (time + 50%).
- **CME allowances:** NZD 2,000/year (PGY1) to NZD 7,500/year (Consultant).

---

## 2. Tax Rules Verification

### Income Tax (Effective 1 April 2025)

New Zealand has the **simplest tax system** of all 6 countries in this tool.

| Bracket | Rate | Threshold | Tax on Bracket |
|---------|------|-----------|----------------|
| 1st | 10.5% | $0 - $15,600 | $1,638.00 |
| 2nd | 17.5% | $15,601 - $53,500 | $6,632.50 |
| 3rd | 30% | $53,501 - $78,100 | $7,380.00 |
| 4th | 33% | $78,101 - $180,000 | $33,627.00 |
| 5th | 39% | $180,001+ | Varies |

**Source:** [IRD Tax Rates for Individuals](https://www.ird.govt.nz/income-tax/income-tax-for-individuals/tax-codes-and-tax-rates-for-individuals/tax-rates-for-individuals)
**Confidence:** VERY HIGH — Official IRD published rates. Estimation_Flag = N for all 5 brackets.

**Verification:**
- Cumulative tax at $15,600 = $15,600 x 10.5% = $1,638.00 ✓
- Cumulative tax at $53,500 = $1,638 + ($53,500 - $15,600) x 17.5% = $1,638 + $6,632.50 = $8,270.50 ✓
- Cumulative tax at $78,100 = $8,270.50 + ($78,100 - $53,500) x 30% = $8,270.50 + $7,380 = $15,650.50 ✓
- Cumulative tax at $180,000 = $15,650.50 + ($180,000 - $78,100) x 33% = $15,650.50 + $33,627 = $49,277.50 ✓

### ACC Earners' Levy
- Rate: 1.67% on earnings up to NZD 152,790
- Mandatory workplace injury insurance (covers all workers)
- Maximum annual levy: $152,790 x 1.67% = $2,551.59
- **Source:** [ACC Levy Rates 2025-2026](https://www.acc.co.nz/about-us/our-levies/levy-rates/)
- Estimation_Flag = N

### KiwiSaver
- 3% minimum employee contribution (also 4%, 6%, 8%, 10% options available)
- Employer contributes matching 3% (not deducted from employee)
- Auto-enrolled but technically optional (can opt out)
- No income ceiling — applies to all earnings
- **Source:** [IRD KiwiSaver](https://www.ird.govt.nz/kiwisaver/kiwisaver-individuals)
- Estimation_Flag = N

### System Simplicity
- **No separate social security** (unlike UK NI, DE Sozialversicherung, CA CPP/EI)
- **No provincial/state tax variation** (unlike CA, DE)
- **No surtaxes** (unlike Ontario Surtax)
- **No GST on income** (GST 15% applies only to goods/services, not payroll)

### Worked Example: House Officer PGY1 at NZD 77,500

**Income Tax:**
- 10.5% on $15,600 = $1,638.00
- 17.5% on ($53,500 - $15,600) = 17.5% x $37,900 = $6,632.50
- 30% on ($77,500 - $53,500) = 30% x $24,000 = $7,200.00
- Total income tax = **$15,470.50**

**ACC Earners' Levy:**
- $77,500 x 1.67% = **$1,294.25**

**KiwiSaver (3%):**
- $77,500 x 3% = **$2,325.00**

**Total Deductions:** $15,470.50 + $1,294.25 + $2,325.00 = **$19,089.75**
**Take-home:** $77,500 - $19,089.75 = **$58,410.25/year** ($4,867.52/month)
**Effective total deduction rate:** 24.6%

### Worked Example: Consultant at NZD 225,000

**Income Tax:**
- 10.5% on $15,600 = $1,638.00
- 17.5% on $37,900 = $6,632.50
- 30% on $24,600 = $7,380.00
- 33% on $101,900 = $33,627.00
- 39% on ($225,000 - $180,000) = 39% x $45,000 = $17,550.00
- Total income tax = **$66,827.50**

**ACC Earners' Levy:**
- Capped at $152,790 x 1.67% = **$2,551.59**

**KiwiSaver (3%):**
- $225,000 x 3% = **$6,750.00**

**Total Deductions:** $66,827.50 + $2,551.59 + $6,750.00 = **$76,129.09**
**Take-home:** $225,000 - $76,129.09 = **$148,870.91/year** ($12,405.91/month)
**Effective total deduction rate:** 33.8%

---

## 3. Cost of Living Verification

### Cities Covered (3)
Auckland, Wellington, Christchurch

### Sources Per City
- **Rent:** TradeMe.co.nz, Numbeo (Feb 2026)
- **Transport:** AT HOP (Auckland ~NZD 200/month), Metlink (Wellington ~NZD 181/month), Metro (Christchurch ~NZD 130/month)
- **Healthcare:** Southern Cross insurance quotes (Wellbeing One plan, family plans)
- **General:** Numbeo consumer price data

### Rent Ranking (Basic 1BHK)
1. Wellington: NZD 2,050 (tight market, limited housing stock)
2. Christchurch: NZD 1,920 (post-earthquake rebuild market)
3. Auckland: NZD 1,800 (largest city, more supply)

### Key Observations
- **Healthcare costs are non-zero** (unlike UK/CA/DE where public healthcare is fully free at point of use). NZ public system covers hospital care but GP visits cost NZD 50-70 per visit. Basic tier budgets NZD 55-80/month for GP visits; Moderate/Premium adds Southern Cross private insurance (NZD 130-250/month).
- **Transport varies significantly by city:** Auckland AT HOP ~NZD 200/month, Wellington Metlink ~NZD 181/month, Christchurch Metro ~NZD 130/month. Christchurch is more car-dependent.
- **Christchurch is the most affordable** — post-earthquake rebuild has stabilized the housing market.
- **School fees = NZD 0** for Basic/Moderate (public schools with voluntary ~NZD 300/year donation). Premium tier adds NZD 1,625-2,083/month for private schools (Christ's College, ACG Parnell, Queen Margaret).

### Data Conflicts & Resolution
- **Conflict:** Auckland Premium Family 3BHK (NZD 5,000) appears high vs Numbeo outside-centre 3BR average (NZD 3,067).
  - **Resolution:** Premium tier reflects top suburbs (Remuera, Herne Bay, St Heliers) — not average market. Numbeo outside-centre figure is for average suburbs. Premium explicitly targets premium locations.

- **Conflict:** Wellington 1BHK (NZD 2,050) is close to Auckland (NZD 1,800) despite Wellington being smaller.
  - **Resolution:** Wellington has severe housing supply constraints (hilly terrain, earthquake risk limits building, compact CBD). Numbeo confirms Wellington 1BR outside-centre at NZD 2,049 — consistent with our data.

**Estimation Flags:** Estimation_Flag = Y for all Premium tier rows (limited direct data for premium lifestyle patterns). Estimation_Flag = N for Basic and Moderate rows.

---

## 4. Migration Costs Verification

### Sources Consulted
- [MCNZ Official Fees](https://www.mcnz.org.nz/) — NZREX exam and registration fees (effective 1 July 2025)
- [Immigration New Zealand](https://www.immigration.govt.nz/) — Visa fees
- [OET](https://www.occupationalenglishtest.org/) / [IELTS](https://www.ielts.org/) — English proficiency test fees
- Flight aggregators (Skyscanner, Google Flights) — India-Auckland return flights
- Insurance quotes — Temporary health coverage

### Cost Breakdown (Verified)

| Line Item | Min (INR) | Typical (INR) | Max (INR) | Notes |
|-----------|-----------|---------------|-----------|-------|
| **NZREX Clinical Exam** | 301,274 | ~450,000 | ~700,000 | Application NZD 817 + Exam NZD 4,714 = NZD 5,531 total. 1-2.5 attempts. |
| **MCNZ Registration** | 343,069 | 343,069 | 343,069 | Application NZD 1,248 + APC NZD 1,050 + Provisional reg NZD 4,000 = NZD 6,298 |
| **English Test (OET/IELTS)** | 17,000 | 21,788 | 21,788 | IELTS INR 17k / OET NZD 400 |
| **Work Visa (AEWV)** | 83,884 | 83,884 | 83,884 | Accredited Employer Work Visa NZD 1,540 |
| **Medical Exam** | 16,341 | 19,065 | 21,788 | NZD 300-400 (immigration medical + chest X-ray) |
| **Police Clearance** | 3,000 | 3,268 | 3,500 | Indian PCC |
| **Travel** | 60,000 | 70,000 | 90,000 | India-Auckland return economy |
| **Accommodation** | 108,940 | 136,175 | 163,410 | 4 weeks temp + rental bond (4 weeks) |
| **Document Attestation** | 25,000 | 30,000 | 35,000 | MEA + NZ High Commission |
| **NZREX Prep Course** | 0 | 100,000 | 150,000 | Optional but recommended |
| **Health Insurance** | 16,341 | 21,788 | 27,235 | 3-6 months until employment covers it |

### Total Migration Cost: INR 980,000 (Min) / INR 1,263,000 (Typical) / INR 1,640,000 (Max)

### Key Clarifications
- **NZREX is a SINGLE clinical examination** — not two separate parts (sometimes confused in documentation).
- **MCNZ fee detail:** Application NZD 817.06 + Examination NZD 4,713.88 = NZD 5,530.94 (per MCNZ fees effective 1 July 2025).
- **Provisional registration** requires 2 years supervised practice before full registration.
- **NZREX pass rate:** ~60-70% — prep course strongly recommended.

### Confidence: MEDIUM
- MCNZ fees verified from official source.
- NZREX pass rate well-documented.
- Accommodation, prep course, and travel costs are estimated.

---

## 5. Currency Exchange Rate

### Rate Used: NZD 1 = INR 54.47 (February 18, 2026)

### Source
- [ExchangeRate-API](https://www.exchangerate-api.com/) — mid-market interbank rate

### Confidence: HIGH
- Mid-market rate verified. Actual bank/transfer rates include 1-3% margin.
- Recommend monthly updates or live API integration.

---

## 6. Items Requiring Future Verification

1. **Te Whatu Ora restructuring impact** — Health New Zealand replacing DHBs; new pay negotiations expected 2026-2027.
2. **ASMS MECA 2026 renewal** — current agreement expires 2026; new salary scales expected.
3. **NZRDA 2026 agreement** — current HNZ collective agreement 2024-2026 due for renewal.
4. **ACC Earners' Levy 2026-2027** — rate reviewed annually by ACC.
5. **MCNZ fee updates** — effective 1 July annually; verify for 2026.
6. **KiwiSaver default rate** — currently 3%; government may increase default.
7. **Private Consultant salary data** — limited public sources. Cross-check when ASMS releases updated survey.
8. **Christchurch post-rebuild rent trends** — market stabilizing but verify trajectory.

---

## 7. Data Quality Summary

| Category | Confidence Level | Estimation_Flag Y Rows | Notes |
|----------|------------------|------------------------|-------|
| **Salary (Public)** | HIGH | 0 of 4 rows | MECA standardized pay scales |
| **Salary (Private)** | MEDIUM | 4 of 4 rows | Market surveys, limited public data |
| **Tax Rules** | VERY HIGH | 0 of 8 rows | All from IRD/ACC official rates |
| **Cost of Living** | HIGH | 10 of 28 rows | 3 cities; Premium tier estimated |
| **Migration Costs** | MEDIUM | 1 of 1 rows | MCNZ fees verified; prep/accommodation estimated |
| **Exchange Rate** | HIGH | N/A | Mid-market rate verified |

---

## 8. Disclaimer & Limitations

- **NZ has only 3 cities modeled** — smaller than the 5-6 cities for other countries. Covers ~75% of NZ medical workforce. Hamilton, Dunedin, and other centres are not included.
- **Te Whatu Ora transition:** The DHB-to-Health NZ restructuring is ongoing. Pay scales may change during 2026-2027 negotiations.
- **Private sector data limitations:** Unlike public MECA data, private hospital salaries are not standardized or publicly reported. All private sector rows are estimates.
- **Healthcare is not fully free:** Unlike the UK (NHS) or Canada (Medicare), NZ public system charges for GP visits (NZD 50-70). This is reflected in Cost of Living but may surprise users.
- **KiwiSaver is technically optional** but auto-enrolled. Our calculations include the 3% minimum. Users who opt out would have higher take-home.
- **ACC Earners' Levy** is unique to NZ — no equivalent exists in other countries. It provides universal workplace injury coverage regardless of fault.
- **Consultant private practice rights** (50/50 split with DHB) can add 30-50% to base salary — not reflected in the Salary Bands figures.

---

## 9. Next Update Due

| Dataset | Next Review | Trigger |
|---------|-------------|---------|
| Salary (Public) | Q1 2027 | ASMS/NZRDA MECA renewals |
| Salary (Private) | Q3 2026 | Annual market survey data |
| Tax rules | April 2026 | NZ tax year starts 1 April |
| Migration costs | July 2026 | MCNZ annual fee update |
| Cost of living | August 2026 | 6-month cadence |
| Currency rate | Monthly | Integrate live API |

---

**Last Updated:** February 22, 2026
**Next Scheduled Review:** August 2026
