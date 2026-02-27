# Australian Tax Rules 2025-26 — Data Audit Log

**Audit Date:** 18 February 2026
**Financial Year:** 2025-26 (1 July 2025 – 30 June 2026)
**File Created:** `data/processed/au/AU_Tax_Rules.csv`

---

## 1. Income Tax Brackets (Australian Tax Residents)

### Confirmed Rates (2025-26)

The Stage 3 tax cuts took effect on 1 July 2024 via the *Treasury Laws Amendment (Cost of Living Tax Cuts) Act 2024*. These rates apply for both 2024-25 and 2025-26. No further changes have been legislated for 2025-26.

| Taxable Income        | Rate  | Tax on this income                          |
|----------------------|-------|---------------------------------------------|
| $0 – $18,200         | 0%    | Nil                                         |
| $18,201 – $45,000    | 16%   | 16c for each $1 over $18,200               |
| $45,001 – $135,000   | 30%   | $4,288 plus 30c for each $1 over $45,000   |
| $135,001 – $190,000  | 37%   | $31,288 plus 37c for each $1 over $135,000 |
| $190,001+            | 45%   | $51,638 plus 45c for each $1 over $190,000 |

**Verification:**
- $4,288 = ($45,000 - $18,200) x 0.16 = 26,800 x 0.16 = $4,288 ✓
- $31,288 = $4,288 + ($135,000 - $45,000) x 0.30 = $4,288 + $27,000 = $31,288 ✓
- $51,638 = $31,288 + ($190,000 - $135,000) x 0.37 = $31,288 + $20,350 = $51,638 ✓

**Source:** ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents
**Estimation Flag:** N — legislated rates, no estimation required.

### Low Income Tax Offset (LITO) — 2024-25 / 2025-26

LITO is automatically applied by the ATO at assessment time. It reduces income tax payable (but cannot create a refund below zero).

| Taxable Income        | LITO Amount                                        |
|-----------------------|----------------------------------------------------|
| $0 – $45,000         | $700                                               |
| $45,001 – $66,667    | $700 - (income - $45,000) x 0.05                  |
| $66,668 – $100,000   | $0 (fully phased out)                              |
| $100,001+            | $0                                                  |

**Note:** LITO fully phases out at $45,000 + ($700 / 0.05) = $45,000 + $14,000 = **$59,000**. Income between $59,001 and $100,000 receives no LITO. The ATO website lists the phase-out range as $45,001-$66,667 but the offset reaches $0 at $59,000 under the single 5c/dollar reduction rate.

**IMPORTANT FOR THE TOOL:** LITO is not included in the CSV as a separate tax type because it is a tax offset (reduces tax payable) not a tax rate (applied to a bracket). The web tool should:
1. Calculate income tax using the marginal bracket rates
2. Calculate LITO based on income
3. Subtract LITO from income tax payable (floor at $0)

If the tool does NOT implement LITO, tax calculations will be overstated by up to $700 for incomes below $59,000. For the doctor salary ranges in AU_Salary_Bands.csv (intern $85,930+), LITO = $0, so the impact is nil for most scenarios.

### Low and Middle Income Tax Offset (LMITO)

LMITO ended on 30 June 2023. It does NOT apply to 2024-25 or 2025-26. Do not include it.

---

## 2. Medicare Levy

### Standard Rate
- **2% of taxable income** — flat rate on entire taxable income (not marginal)
- Unchanged for 2025-26

### Low-Income Threshold (Singles)
- **2024-25: $26,000** (confirmed by ATO)
- **2025-26: Not yet published** as of February 2026
- The threshold is typically indexed annually based on CPI. It may increase to approximately $26,500-$27,000 but this is speculative.
- **CSV uses $26,000** as the baseline with Estimation_Flag = Y
- **Action required:** Check ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy periodically for the 2025-26 threshold announcement.

### Shade-in (Phase-in) Calculation
For income between the threshold and the shade-in ceiling:
- **Levy = 10% x (taxable income - threshold)**
- The 10% shade-in rate ensures a gradual phase-in
- **Shade-in ceiling** = threshold / (1 - levy_rate / shade_in_rate)
  = $26,000 / (1 - 0.02/0.10)
  = $26,000 / (1 - 0.2)
  = $26,000 / 0.80
  = **$32,500**

**Verification at ceiling:** 10% x ($32,500 - $26,000) = 10% x $6,500 = $650 = 2% x $32,500 ✓

**Above $32,500:** Standard 2% of total taxable income applies.

**Source:** ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy/medicare-levy-reduction-for-low-income-earners

---

## 3. Medicare Levy Surcharge (MLS)

MLS applies ONLY to taxpayers who:
1. Do NOT hold appropriate private patient hospital cover, AND
2. Earn above the MLS income threshold

This is a **policy choice** — purchasing private health insurance avoids the MLS entirely.

### 2024-25 Thresholds (using as baseline for 2025-26 — not yet confirmed)

| Income (Singles)      | Income (Families)       | MLS Rate |
|----------------------|------------------------|----------|
| $0 – $93,000        | $0 – $186,000          | 0%       |
| $93,001 – $108,000  | $186,001 – $216,000    | 1.0%     |
| $108,001 – $144,000 | $216,001 – $288,000    | 1.25%    |
| $144,001+           | $288,001+              | 1.5%     |

**MLS income** = taxable income + reportable fringe benefits + total net investment losses (not just taxable income).

**Estimation Flag:** Y — 2025-26 thresholds not yet confirmed. Using 2024-25 figures.

**Note for the tool:** MLS should be displayed as an informational note, NOT automatically deducted. The tool should show: "If you do not hold private hospital cover, an additional Medicare Levy Surcharge of X% ($Y) would apply."

**Source:** ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge

---

## 4. Superannuation Guarantee

### Rate Schedule (Legislated)

| Financial Year | SG Rate |
|---------------|---------|
| 2023-24       | 11.0%   |
| 2024-25       | 11.5%   |
| **2025-26**   | **12.0%** |

The 12% rate from 1 July 2025 is the **final step** in the legislated SG schedule. It is enshrined in the *Superannuation Guarantee (Administration) Act 1992* as amended by the *Treasury Laws Amendment (Your Future, Your Super) Act 2021*.

### Key Points
- **EMPLOYER-PAID** — SG is not deducted from the employee's gross salary. It is an additional cost to the employer, paid on top of gross salary.
- Applies to **Ordinary Time Earnings (OTE)** — base salary plus some allowances, but excluding overtime in most cases.
- **No minimum earnings threshold** from 1 July 2022 (previously, employees earning <$450/month were excluded).
- **Maximum Super Contributions Base (MSCB):** Employers are not required to pay SG on earnings above the MSCB. For 2024-25, the quarterly MSCB is $65,070 (annual equivalent ~$260,280). The 2025-26 MSCB will be indexed — expect approximately $66,000-$67,000/quarter.

**Source:** ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee
**Estimation Flag:** N — legislated rate.

---

## 5. Tax Residency for 482 Visa Holders

### Summary
Doctors on Subclass 482 (Temporary Skill Shortage) visas are **generally treated as Australian tax residents** under existing ATO residency tests, provided they:
1. Reside in Australia for more than 183 days (183-day test), OR
2. Have their domicile in Australia (domicile test), OR
3. Satisfy the Commonwealth superannuation fund test

Most 482 visa holders who relocate to Australia to work will satisfy the residency test from arrival (or shortly after) because they intend to reside in Australia for the duration of their visa (typically 2-4 years).

### Implications for Tax Residents
- Access to the **$18,200 tax-free threshold**
- Access to **LITO** and other tax offsets
- Subject to **Medicare Levy** (2%)
- Taxed on **worldwide income** (not just Australian-sourced income)

### Medicare Eligibility for 482 Visa Holders
- Australia has **Reciprocal Health Care Agreements (RHCAs)** with the UK, Ireland, New Zealand, Belgium, Finland, Italy, Malta, the Netherlands, Norway, Slovenia, and Sweden
- **India does NOT have an RHCA with Australia** — Indian 482 visa holders are generally NOT enrolled in Medicare automatically
- However, they may still be liable for the Medicare Levy unless they obtain a **Medicare Levy Exemption Certificate** from the ATO
- Many 482 visa holders from non-RHCA countries obtain private health insurance and may still be liable for the levy depending on their circumstances
- **Tool recommendation:** Assume Medicare Levy applies (conservative approach). Add a note: "482 visa holders from countries without a Reciprocal Health Care Agreement may be eligible for a Medicare Levy exemption — consult the ATO."

### Proposed Statutory Residency Test
The 2023-24 Federal Budget proposed a new statutory residency test to replace the existing common-law tests. As of February 2026, this has **not been legislated**. The existing tests (domicile, 183-day, superannuation, Commonwealth official) continue to apply.

**Source:** ato.gov.au/individuals-and-families/coming-to-australia-or-going-overseas/your-tax-residency; TR 98/17; IT 2681
**Estimation Flag:** N — established ATO guidance.

---

## 6. Worked Examples — Validation

### Calculation Method
For all examples below:
1. Income Tax: marginal rates (no LITO applied — LITO = $0 for all incomes above $59,000)
2. Medicare Levy: 2% of taxable income (all examples are well above the $32,500 shade-in ceiling)
3. MLS: NOT included (assumes private health insurance held or shown separately)
4. Superannuation: NOT deducted (employer-paid on top)
5. Take-home = Gross - Income Tax - Medicare Levy

---

### Example 1: Intern at $80,000

**Income Tax:**
| Bracket              | Rate | Calculation                           | Tax      |
|---------------------|------|---------------------------------------|----------|
| $0 – $18,200        | 0%   | $0                                    | $0       |
| $18,201 – $45,000   | 16%  | ($45,000 - $18,200) x 0.16 = $26,800 x 0.16 | $4,288   |
| $45,001 – $80,000   | 30%  | ($80,000 - $45,000) x 0.30 = $35,000 x 0.30 | $10,500  |
| **Total Income Tax** |      |                                       | **$14,788** |

**Medicare Levy:** $80,000 x 0.02 = **$1,600**

**Total Deductions:** $14,788 + $1,600 = **$16,388**

**Annual Take-Home:** $80,000 - $16,388 = **$63,612**
**Monthly Take-Home:** $63,612 / 12 = **$5,301**

**Comparison with your expected figures:**
- Your expected income tax: $14,617 — **Difference: $171**
- Your expected Medicare Levy: $1,600 — **Match** ✓
- Your expected take-home: $63,783 — **Difference: $171**

**Analysis of $171 discrepancy:** Your expected figure of $14,617 is $171 less than the pure bracket calculation of $14,788. This $171 does not correspond to the LITO ($0 at $80,000) or any other standard offset. It is possible that:
1. Your source used slightly different rounding, OR
2. Your source applied an offset not included here, OR
3. The expected figure was an approximation

**Recommendation:** Use $14,788 as the accurate figure based on the gazetted tax brackets. Verify at ato.gov.au/calculators-and-tools/tax-withheld-calculator.

**Note:** The AU_Salary_Bands.csv shows Intern (PGY1) at $85,930, not $80,000. At $85,930:
- Income Tax = $4,288 + ($85,930 - $45,000) x 0.30 = $4,288 + $12,279 = $16,567
- Medicare Levy = $85,930 x 0.02 = $1,719
- Take-home = $85,930 - $16,567 - $1,719 = $67,644/yr ($5,637/mo)

---

### Example 2: Registrar at $130,000

**Income Tax:**
| Bracket              | Rate | Calculation                              | Tax      |
|---------------------|------|------------------------------------------|----------|
| $0 – $18,200        | 0%   | $0                                       | $0       |
| $18,201 – $45,000   | 16%  | ($45,000 - $18,200) x 0.16              | $4,288   |
| $45,001 – $130,000  | 30%  | ($130,000 - $45,000) x 0.30 = $85,000 x 0.30 | $25,500  |
| **Total Income Tax** |      |                                          | **$29,788** |

**Medicare Levy:** $130,000 x 0.02 = **$2,600**

**Total Deductions:** $29,788 + $2,600 = **$32,388**

**Annual Take-Home:** $130,000 - $32,388 = **$97,612**
**Monthly Take-Home:** $97,612 / 12 = **$8,134**

**Comparison with your expected figures:**
- Your expected income tax: $29,942 — **Difference: $154 (yours is higher)**
- Your expected Medicare Levy: $2,600 — **Match** ✓
- Your expected take-home: $97,458 — **Difference: $154**

**Analysis of $154 discrepancy:** Curiously, your expected income tax ($29,942) is HIGHER than the bracket calculation ($29,788) by $154. This is unusual — any offset would reduce tax, not increase it. Possible explanations:
1. A calculation error in the expected figures
2. Your source may have used pre-Stage-3 rates partially

**Recommendation:** Use $29,788 as the accurate figure.

**Note:** The AU_Salary_Bands.csv shows Registrar typical at $137,890. At $137,890:
- Income Tax = $4,288 + ($135,000 - $45,000) x 0.30 + ($137,890 - $135,000) x 0.37
            = $4,288 + $27,000 + $1,069.30
            = $32,357
- Medicare Levy = $137,890 x 0.02 = $2,758
- Take-home = $137,890 - $32,357 - $2,758 = $102,775/yr ($8,565/mo)

---

### Example 3: Consultant at $300,000

**Income Tax:**
| Bracket              | Rate | Calculation                                     | Tax      |
|---------------------|------|-------------------------------------------------|----------|
| $0 – $18,200        | 0%   | $0                                              | $0       |
| $18,201 – $45,000   | 16%  | ($45,000 - $18,200) x 0.16                     | $4,288   |
| $45,001 – $135,000  | 30%  | ($135,000 - $45,000) x 0.30 = $90,000 x 0.30  | $27,000  |
| $135,001 – $190,000 | 37%  | ($190,000 - $135,000) x 0.37 = $55,000 x 0.37 | $20,350  |
| $190,001 – $300,000 | 45%  | ($300,000 - $190,000) x 0.45 = $110,000 x 0.45 | $49,500  |
| **Total Income Tax** |      |                                                 | **$101,138** |

**Alternative quick calculation:** $51,638 + ($300,000 - $190,000) x 0.45 = $51,638 + $49,500 = $101,138 ✓

**Medicare Levy:** $300,000 x 0.02 = **$6,000**

**Total Deductions:** $101,138 + $6,000 = **$107,138**

**Annual Take-Home:** $300,000 - $107,138 = **$192,862**
**Monthly Take-Home:** $192,862 / 12 = **$16,072**

**Comparison with your expected figures:**
- Your expected income tax: $104,942 — **Difference: $3,804 (yours is higher)**
- Your expected Medicare Levy: $6,000 — **Match** ✓
- Your expected take-home: $189,058 — **Difference: $3,804**

**Analysis of $3,804 discrepancy:** Your expected income tax of $104,942 is significantly higher than the correct Stage 3 calculation of $101,138. The difference of $3,804 strongly suggests your expected figures were calculated using **pre-Stage-3 (pre-1 July 2024) tax brackets**:

Pre-Stage-3 brackets (2023-24):
- $0-$18,200 @ 0%
- $18,201-$45,000 @ 19%
- $45,001-$120,000 @ 32.5%
- $120,001-$180,000 @ 37%
- $180,001+ @ 45%

Let me verify: Pre-Stage-3 tax on $300,000:
- $0-$18,200 @ 0% = $0
- $18,201-$45,000 @ 19% = $26,800 x 0.19 = $5,092
- $45,001-$120,000 @ 32.5% = $75,000 x 0.325 = $24,375
- $120,001-$180,000 @ 37% = $60,000 x 0.37 = $22,200
- $180,001-$300,000 @ 45% = $120,000 x 0.45 = $54,000
- Total = $105,667

That gives $105,667, not $104,942. So the expected figures don't cleanly match either regime.

**The expected figures may have been calculated with the original (pre-revision) Stage 3 brackets** that were proposed in 2019:
- $0-$18,200 @ 0%
- $18,201-$45,000 @ 19%
- $45,001-$200,000 @ 30%
- $200,001+ @ 45%

Tax on $300,000 under original Stage 3:
- $0-$18,200 @ 0% = $0
- $18,201-$45,000 @ 19% = $26,800 x 0.19 = $5,092
- $45,001-$200,000 @ 30% = $155,000 x 0.30 = $46,500
- $200,001-$300,000 @ 45% = $100,000 x 0.45 = $45,000
- Total = $96,592

That's too low. The expected figures don't match any clean bracket set.

**Recommendation:** Use $101,138 as the accurate figure for 2025-26 under the revised Stage 3 brackets. The expected figure of $104,942 appears to be incorrect for the current tax regime.

---

## 7. Corrected Summary Table

| Career Stage | Gross ($) | Income Tax ($) | Medicare Levy ($) | Take-Home ($) | Monthly ($) |
|-------------|-----------|---------------|-------------------|--------------|-------------|
| Intern      | 80,000    | 14,788        | 1,600             | 63,612       | 5,301       |
| Registrar   | 130,000   | 29,788        | 2,600             | 97,612       | 8,134       |
| Consultant  | 300,000   | 101,138       | 6,000             | 192,862      | 16,072      |

### Using actual AU_Salary_Bands.csv salary figures:

| Career Stage              | Gross ($) | Income Tax ($) | Medicare Levy ($) | Take-Home ($) | Monthly ($) |
|--------------------------|-----------|---------------|-------------------|--------------|-------------|
| Intern (PGY1)            | 85,930    | 16,567        | 1,719             | 67,644       | 5,637       |
| RMO (PGY2-3) Typical     | 101,590   | 21,265        | 2,032             | 78,293       | 6,524       |
| Registrar Typical         | 137,890   | 32,357        | 2,758             | 102,775      | 8,565       |
| Consultant Typical Public | 253,084   | 79,988        | 5,062             | 168,034      | 14,003      |
| Consultant Typical Private| 400,000   | 146,138       | 8,000             | 245,862      | 20,489      |

---

## 8. Items Requiring Future Verification

| Item | Current Value | Status | Action |
|------|--------------|--------|--------|
| Income Tax brackets 2025-26 | Same as 2024-25 (Stage 3) | CONFIRMED — legislated, no changes | None |
| Medicare Levy threshold 2025-26 (singles) | $26,000 (2024-25 value) | NOT YET PUBLISHED | Check ato.gov.au quarterly |
| Medicare Levy Surcharge thresholds 2025-26 | $93,000/$108,000/$144,000 (2024-25) | NOT YET PUBLISHED | Check ato.gov.au quarterly |
| Superannuation Guarantee 12% | From 1 July 2025 | CONFIRMED — legislated | None |
| Maximum Super Contributions Base 2025-26 | ~$65,070/qtr (2024-25) | NOT YET PUBLISHED | Check ato.gov.au when announced |
| 482 visa tax residency treatment | Resident under common-law tests | CONFIRMED — established ATO guidance | None |
| Proposed statutory residency test | Not yet legislated | MONITOR | Check treasury.gov.au for updates |
| LITO 2025-26 | $700 max (same as 2024-25) | LIKELY UNCHANGED | Confirm when ATO publishes 2025-26 details |

---

## 9. CSV Row Summary

The file `AU_Tax_Rules.csv` contains **14 data rows** (plus header):
- Income Tax: 5 rows (Tax_Type = "Income Tax")
- Medicare Levy: 3 rows (Tax_Type = "Medicare Levy")
- Medicare Levy Surcharge: 4 rows (Tax_Type = "Medicare Levy Surcharge")
- Superannuation Guarantee: 1 row (Tax_Type = "Superannuation Guarantee")
- Tax Residency info: 1 row (Tax_Type = "Tax Residency (482 Visa)")

**Rows with Estimation_Flag = Y:** 6 (Medicare Levy threshold rows + MLS threshold rows — all due to 2025-26 thresholds not yet published)
**Rows with Estimation_Flag = N:** 8 (all others — based on legislated rates or established ATO guidance)
