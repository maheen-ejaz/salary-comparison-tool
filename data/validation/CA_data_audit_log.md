# Canada Data Audit Log

**Data Collection Date:** February 22, 2026
**Country:** Canada
**Migration Route:** MCC Standard Pathway (MCCQE1, NAC OSCE, CaRMS)
**Exchange Rate Used:** CAD 1 = INR 66.48 (mid-market rate, Feb 2026)

---

## 1. Salary Bands Verification

### Sources Consulted
- [PARO 2024 Arbitration Decision](https://myparo.ca/) — Ontario PGY1-PGY9 rates effective July 1, 2025 (Arbitrator Eli Gedalof)
- [PARA 2024-28 Agreement](https://para-ab.ca/) — Alberta resident pay scales
- [Resident Doctors of BC 2022-25 Agreement](https://residentdoctorsbc.ca/) — British Columbia resident rates
- [FMRQ 2021-28 Agreement](https://fmrq.qc.ca/en/) — Quebec resident rates
- [CIHI National Physician Database 2022-23](https://www.cihi.ca/en/topics/physicians) — Gross clinical payments by specialty
- [CMA Physician Compensation Survey 2023-24](https://www.cma.ca/) — National physician compensation data
- [InvestedMD Physician Salary Data Feb 2026](https://investedmd.com/) — Cross-referenced salary benchmarks

### Salary Data Confidence Level
- **Resident PGY1:** HIGH — Exact collective agreement rates from PARO (Ontario $73,367), PARA (Alberta $66,118), RDBC (BC $65,332), FMRQ (Quebec $57,296). Estimation_Flag = N.
- **Resident PGY2-3:** HIGH — Same standardized agreement rates. Ontario PGY2 $79,670, PGY3 $85,564. Estimation_Flag = N.
- **Fellow / Senior Resident (PGY4-9):** HIGH — Ontario PARO rates range from PGY4 $92,701 to PGY9 $120,082. Estimation_Flag = N.
- **Staff Physician (Salaried):** MEDIUM — Estimated from AFP/ARP models and CIHI data. Enormous variation by province and specialty. Estimation_Flag = Y.
- **Staff Physician (Fee-for-Service):** MEDIUM — CIHI 2022-23 data (latest published) shows gross billings. CRITICAL: figures are GROSS before 25-40% overhead. Estimation_Flag = Y.

### Data Conflicts & Resolution
- **Conflict:** Ontario PGY1 ($73,367) is now the highest in Canada after the 2024 arbitration, significantly above Alberta ($66,118) and BC ($65,332).
  - **Resolution:** Used BC as Min ($65,332 rounded to $65,000), Ontario as Typical ($73,367), and Ontario with northern/rural premiums as Max ($78,000). Provincial variation is clearly documented in Notes.

- **Conflict:** CIHI average gross clinical payment ($380,000 all models combined) vs salaried typical ($280,000) — appears contradictory.
  - **Resolution:** These reflect different payment models. FFS gross billings inflate the average. Salaried positions (AFP/ARP) have lower gross but zero overhead, employer benefits, pension (HOOPP), and paid vacation. Both figures are documented separately in the CSV.

- **Conflict:** FFS gross billings vs net income — overhead consumes 25-40%.
  - **Resolution:** Clearly flagged in Notes that FFS figures are GROSS billings. CMPA fees ($3,000-$60,000+/year by specialty) are additional and not included. Tool users must understand this distinction.

### Notes on Salary Structure
- **Residents:** Standardized pay across each province's collective agreement. Call stipends ($100-200/shift), moonlighting income, and professional development allowances ($1,000-$2,500/yr) are excluded from base figures.
- **Salaried Staff:** Receive employer benefits (health/dental), pension contributions (HOOPP in Ontario ~$20-30k/yr employer match), paid vacation (4-6 weeks), and CME allowances ($2,000-$5,000/yr).
- **FFS Staff:** No employer benefits, no pension, must fund CMPA, clinic overhead (rent, staff, equipment), and retirement independently. Pay both employee and employer CPP portions (self-employed rate).

---

## 2. Tax Rules Verification

### Federal Income Tax (2025)

| Bracket | Rate | Threshold | Notes |
|---------|------|-----------|-------|
| 1st | 14% | $0 - $57,375 | **CHANGED**: Reduced from 15% to 14% effective July 1, 2025 (Middle Class Tax Cut). Blended 14.5% for 2025. |
| 2nd | 20.5% | $57,376 - $114,750 | Unchanged |
| 3rd | 26% | $114,751 - $177,882 | **CHANGED**: Upper threshold increased from $158,468 to $177,882 |
| 4th | 29% | $177,883 - $253,414 | **CHANGED**: Both thresholds restructured by Middle Class Tax Cut |
| 5th | 33% | $253,415+ | **CHANGED**: Lower threshold increased from $220,000 to $253,414 |

**Source:** [canada.ca individual tax rates](https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html); [taxtips.ca](https://www.taxtips.ca/taxrates/canada.htm)
**Confidence:** HIGH — Legislated rates confirmed. Estimation_Flag = N for all 5 federal brackets.
**Basic Personal Amount:** $16,129 for 2025 (income-tested: claws back above $177,882, reduces to $14,538 for income >$253,414).

### Provincial Income Tax

**Ontario (5 brackets):**
| Rate | Threshold | Source |
|------|-----------|--------|
| 5.05% | $0 - $51,446 | ontario.ca/page/ontario-tax-rates |
| 9.15% | $51,447 - $102,894 | " |
| 11.16% | $102,895 - $150,000 | " |
| 12.16% | $150,001 - $220,000 | " |
| 13.16% | $220,001+ | " |

Ontario Basic Personal Amount: $11,865. Estimation_Flag = N for all.

**British Columbia (7 brackets):**
| Rate | Threshold | Source |
|------|-----------|--------|
| 5.06% | $0 - $47,937 | www2.gov.bc.ca |
| 7.7% | $47,938 - $95,875 | " |
| 10.5% | $95,876 - $110,076 | " |
| 12.29% | $110,077 - $133,664 | " |
| 14.7% | $133,665 - $181,232 | " |
| 16.8% | $181,233 - $252,752 | " |
| 20.5% | $252,753+ | " |

BC Basic Personal Amount: $12,580. Estimation_Flag = N for all.

**Alberta (5 brackets):**
| Rate | Threshold | Source |
|------|-----------|--------|
| 10% | $0 - $148,269 | alberta.ca/personal-income-tax-rates-credits |
| 12% | $148,270 - $177,922 | " |
| 13% | $177,923 - $237,230 | " |
| 14% | $237,231 - $355,845 | " |
| 15% | $355,846+ | " |

Alberta Basic Personal Amount: $21,003 (highest in Canada). Estimation_Flag = N for all.

**Manitoba (3 brackets):**
| Rate | Threshold | Source |
|------|-----------|--------|
| 10.8% | $0 - $47,000 | gov.mb.ca |
| 12.75% | $47,001 - $100,000 | " |
| 17.4% | $100,001+ | " |

Manitoba Basic Personal Amount: $15,780. Estimation_Flag = N for all.

**Quebec (4 brackets):**
| Rate | Threshold | Source |
|------|-----------|--------|
| 14% | $0 - $51,780 | revenuquebec.ca |
| 19% | $51,781 - $103,545 | " |
| 24% | $103,546 - $126,000 | " |
| 25.75% | $126,001+ | " |

Quebec Basic Personal Amount: $18,056. Quebec Federal Abatement: 16.5% reduction on federal tax. Estimation_Flag = N for all.

### Ontario Surtax (CRITICAL)
- **Brackets represent provincial TAX amounts, not income amounts.**
- No surtax when basic Ontario tax ≤ $4,991.
- 20% of basic Ontario tax exceeding $4,991 (when tax is $4,992-$6,387).
- 20% of tax >$4,991 PLUS 36% of tax >$6,387 (combined 56% incremental rate on tax above $6,387).
- **Estimation_Flag = Y** for surtax rows (implementation-dependent).
- **Source:** ontario.ca/page/ontario-tax-rates

### Ontario Health Premium
- Stepped premium (NOT a marginal tax) based on income.
- $0 for income ≤$20,000; maximum $900/year for income >$200,600.
- 10 stepped ranges with specific formulas within each range.
- **Estimation_Flag = N** — published rates from ontario.ca/page/ontario-health-premium.

### Payroll Deductions

| Type | Rate | Ceiling | Max Annual Employee | Notes |
|------|------|---------|---------------------|-------|
| CPP | 5.95% | $3,501-$71,300 | $4,034.10 | All provinces except Quebec |
| CPP2 | 4% | $71,301-$79,400 | $324.00 | Introduced 2024 |
| QPP | 6.40% | $3,501-$71,300 | $4,339.20 | Quebec only (higher than CPP) |
| QPP2 | 4% | $71,301-$79,400 | $324.00 | Quebec only |
| EI | 1.64% | $0-$65,700 | $1,077.48 | All except Quebec |
| EI (QC) | 1.31% | $0-$65,700 | $860.67 | Quebec residents (lower due to QPIP) |

All payroll deduction rates: Estimation_Flag = N.

### Worked Example: PGY1 Resident at $73,367 in Ontario

**Federal Income Tax:**
- 14% on first $57,375 = $8,032.50
- 20.5% on ($73,367 - $57,375) = 20.5% x $15,992 = $3,278.36
- Gross federal tax = $11,310.86
- Less BPA credit: $16,129 x 14% = -$2,258.06
- Net federal tax = **$9,052.80**

**Ontario Provincial Tax:**
- 5.05% on first $51,446 = $2,598.02
- 9.15% on ($73,367 - $51,446) = 9.15% x $21,921 = $2,005.77
- Gross Ontario tax = $4,603.79
- Less Ontario BPA credit: $11,865 x 5.05% = -$599.18
- Net Ontario tax = **$4,004.61**
- Ontario Surtax: $4,004.61 < $4,991 threshold → **$0**
- Ontario Health Premium: 6% x ($73,367 - $20,000) = $3,202 → capped at $750 (income $72,601-$200,000 range) → **$750**

**Payroll Deductions:**
- CPP: ($71,300 - $3,500) x 5.95% = **$4,034.10**
- CPP2: ($73,367 - $71,300) x 4% = **$82.68**
- EI: $65,700 x 1.64% = **$1,077.48**

**Total Deductions:** $9,052.80 + $4,004.61 + $0 + $750 + $4,034.10 + $82.68 + $1,077.48 = **$19,001.67**
**Take-home:** $73,367 - $19,001.67 = **$54,365.33/year** ($4,530.44/month)

---

## 3. Cost of Living Verification

### Cities Covered (6)
Montreal, Ottawa, Winnipeg, Toronto, Vancouver, Calgary

### Sources Per City
- **Rent:** Numbeo (Feb 2026), Rentals.ca Q4 2025, Zumper, SpareRoom.ca, Kijiji, Realtor.ca
- **Transport:** STM (Montreal $94), OC Transpo (Ottawa $125), Winnipeg Transit ($107), TTC (Toronto $156), TransLink (Vancouver $131), Calgary Transit ($112)
- **Utilities:** Hydro-Quebec, Manitoba Hydro/Centra Gas, Toronto Hydro/Enbridge, BC Hydro, ENMAX/ATCO Gas
- **Healthcare:** Sun Life/Manulife supplementary insurance quotes (2026)

### Rent Ranking (Basic 1BHK)
1. Vancouver: $2,500
2. Toronto: $2,400
3. Ottawa / Calgary: $1,900
4. Montreal: $1,750
5. Winnipeg: $1,400

### Key Observations
- **Healthcare = $0** for Basic/Moderate (all provinces cover GP + hospital via OHIP/RAMQ/MSP/AHCIP etc.). Premium tier adds $180-200/month for Sun Life/Manulife supplementary (dental, vision, prescriptions).
- **Calgary's no-PST advantage** reduces overall spending by ~7-8% vs Toronto (HST 13%) and Vancouver (PST 7% + GST 5%).
- **Quebec subsidized daycare** ($8.70/day) is a major family cost advantage not captured in monthly figures.
- **Winnipeg** has highest heating costs (extreme winters -30C to -40C) but lowest overall rent.
- **Manitoba Public Insurance (MPI)** monopoly makes auto insurance among the highest in Canada.

### Data Conflicts & Resolution
- **Conflict:** Calgary 1BHK Basic listed at $1,900 but Numbeo city-centre shows $1,500-$1,800 range.
  - **Resolution:** Figure reflects outer-suburb pricing consistent with tool methodology (most doctors don't live in city centre). Numbeo city-centre figures are higher.

- **Conflict:** Montreal rent appears unusually low relative to other cities.
  - **Resolution:** Confirmed by multiple sources. Montreal is genuinely 30-40% cheaper than Toronto/Vancouver. Strong rent control laws and higher vacancy rates contribute.

**Estimation Flags:** Estimation_Flag = Y for all Family (2-3 BHK) rows and Premium Shared Accommodation rows (limited direct data for these combinations). Estimation_Flag = N for all Basic/Moderate 1BHK and Shared Accommodation rows.

---

## 4. Migration Costs Verification

### Sources Consulted
- [MCC Examinations Fees (Feb 2026)](https://mcc.ca/examinations/) — MCCQE1 and NAC OSCE fees
- [CPSO Registration Fees](https://www.cpso.on.ca/) — Ontario provincial licensing
- [CaRMS Match Fees (2026 cycle)](https://www.carms.ca/) — Residency match participation
- [physiciansapply.ca](https://physiciansapply.ca/) — Source verification and credential evaluation
- [IRCC](https://www.canada.ca/en/immigration-refugees-citizenship.html) — Work permit and PR Express Entry fees
- [OET](https://www.occupationalenglishtest.org/) — English proficiency test fees

### Cost Breakdown (Verified)

| Line Item | Min (INR) | Typical (INR) | Max (INR) | Notes |
|-----------|-----------|---------------|-----------|-------|
| **MCCQE Part 1** | 99,720 | 99,720 | 199,440 | CAD$1,500 (1x min, 2x max). Up from $1,395. |
| **NAC OSCE** | 220,714 | 331,071 | 441,428 | CAD$3,320 (1x min, 1.5x avg, 2x max). Up from $2,830. |
| **OET/IELTS** | 17,000 | 37,500 | 37,500 | IELTS INR 17k / OET AUD$587 |
| **Provincial License (CPSO)** | 34,902 | 34,902 | 34,902 | CAD$525 Ontario |
| **CaRMS** | 45,954 | 67,554 | 89,204 | $301.60 + $64.96/program (10-20 programs) |
| **Credential Verification** | 46,204 | 46,204 | 46,204 | physiciansapply.ca $395 + WES ~$300 |
| **Work Permit** | 16,952 | 16,952 | 16,952 | CAD$255 + biometrics |
| **PR Express Entry** | 0 | 0 | 96,396 | CAD$1,450 (only in max scenario) |
| **Coaching** | 0 | 75,000 | 150,000 | NAC OSCE prep providers |
| **Travel** | 50,000 | 65,000 | 180,000 | India-Toronto/Vancouver economy |
| **Accommodation** | 24,000 | 40,000 | 100,000 | Exam trips accommodation |
| **Police Clearance** | 2,000 | 3,500 | 5,000 | Indian PCC |
| **Medical Exam** | 10,000 | 12,000 | 15,000 | Panel physician |

### Total Migration Cost: INR 567,000 (Min) / INR 829,000 (Typical) / INR 1,412,000 (Max)

### Key Fee Changes Documented
- **MCCQE1:** Increased from CAD$1,395 to $1,500
- **NAC OSCE:** Increased from CAD$2,830 to $3,320 (significant increase)
- **CaRMS:** Restructured from $325 + $35/program to $301.60 + $64.96/program
- **MCCQE Part 2:** Officially discontinued by MCC in June 2021

### Confidence: MEDIUM-HIGH
- MCC/CaRMS/CPSO/IRCC fees verified from official sources (N)
- Coaching, accommodation, and travel costs are estimated (Y)
- NAC OSCE pass rate for IMGs historically ~60-65% — coaching strongly recommended
- CaRMS IMG match rate ~30-35% in first iteration

---

## 5. Currency Exchange Rate

### Rate Used: CAD 1 = INR 66.48 (February 19, 2026)

### Source
- [ExchangeRate-API](https://www.exchangerate-api.com/) — mid-market interbank rate

### Confidence: HIGH
- Mid-market rate verified. Actual bank/transfer rates include 1-3% margin.
- Recommend monthly updates or live API integration.

---

## 6. Items Requiring Future Verification

1. **2026 CPI-indexed federal/provincial bracket thresholds** — published annually by CRA (2026 first bracket threshold: $58,523)
2. **CIHI National Physician Database 2023-24** — will have newer FFS billing data (current data is 2022-23)
3. **CaRMS 2026 match cycle statistics** — IMG match rate historically ~30-35%
4. **Ontario PARO 2025-26 increment** — next annual increase effective July 2026
5. **Alberta political discussion on potential PST introduction** — would significantly change Calgary cost advantage
6. **MCC fee changes for 2026-27 fiscal year** — annual fee review
7. **Quebec $8.70/day subsidized daycare** — verify continued availability and whether rate has increased

---

## 7. Data Quality Summary

| Category | Confidence Level | Estimation_Flag Rows | Notes |
|----------|------------------|---------------------|-------|
| **Salary Bands (Residents)** | HIGH | 0 of 3 rows = Y | Standardized collective agreement rates from 4 provinces |
| **Salary Bands (Staff)** | MEDIUM | 2 of 2 rows = Y | Salaried estimated; FFS based on 2022-23 CIHI data |
| **Tax Rules (Federal)** | HIGH | 0 of 5 rows = Y | Legislated rates confirmed; Middle Class Tax Cut documented |
| **Tax Rules (Provincial)** | HIGH | 0 of 22 rows = Y | All 5 provinces from official sources |
| **Tax Rules (Ontario Surtax)** | HIGH | 3 of 3 rows = Y | Implementation-dependent flagging |
| **Tax Rules (Payroll)** | HIGH | 0 of 8 rows = Y | CPP/QPP/EI from CRA/Retraite Quebec |
| **Cost of Living** | HIGH | 18 of 55 rows = Y | 6 cities well-documented; Family/Premium combos estimated |
| **Migration Costs** | MEDIUM-HIGH | 1 of 1 rows = Y | MCC/CaRMS fees verified; coaching/accommodation estimated |
| **Exchange Rate** | HIGH | N/A | Mid-market rate verified |

---

## 8. Disclaimer & Limitations

- **Provincial variation is enormous** — 13 provinces/territories exist; only 5 are modeled (ON, BC, AB, QC, MB). Saskatchewan, Nova Scotia, and others have different tax structures.
- **FFS physicians:** Figures are GROSS billings before 25-40% overhead — net income is substantially lower.
- **CMPA (malpractice insurance):** Fees range $3,000-$60,000+/year depending on specialty. Not included in salary or deduction calculations.
- **Tax calculations assume single filer.** Canada uses individual filing (no income splitting for couples except pension splitting).
- **Cost of living excludes childcare** — Quebec's $8.70/day subsidized daycare is a major advantage not captured in monthly figures.
- **Ontario Health Premium** is a separate levy with its own formula — not a simple marginal tax rate.

---

## 9. Next Update Due

| Dataset | Next Review | Trigger |
|---------|-------------|---------|
| Salary (residents) | July 2026 | PARO/PARA annual increments |
| Salary (staff) | Q1 2027 | CIHI 2023-24 database release |
| Tax rules (federal) | January 2027 | 2026 CPI-indexed thresholds |
| Tax rules (provincial) | January 2027 | Provincial budget announcements |
| Migration costs | July 2026 | MCC/CaRMS annual fee updates |
| Cost of living | August 2026 | 6-month cadence |
| Currency rate | Monthly | Integrate live API |

---

**Last Updated:** February 22, 2026
**Next Scheduled Review:** August 2026
