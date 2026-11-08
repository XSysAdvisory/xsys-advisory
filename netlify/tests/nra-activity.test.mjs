import test from "node:test";
import assert from "node:assert/strict";
import {formatNraActivity,normalizeCompanyName} from "../lib/nra-activity.mjs";
test("owner's exact example",()=>assert.equal(formatNraActivity({trainerCode:"ra",activity:"Training ISO 22000",company:"PT ABC",date:"2026-11-20"}),"NRA-RA_Training ISO 22000_ABC_201126"));
test("legal prefix stripped, client preserved",()=>assert.equal(normalizeCompanyName("CV. Maju Bersama"),"Maju Bersama"));
test("reject impossible dates",()=>assert.throws(()=>formatNraActivity({trainerCode:"RA",activity:"Training",company:"ABC",date:"2026-02-30"})));
test("reject invalid trainer codes",()=>assert.throws(()=>formatNraActivity({trainerCode:"R",activity:"Training",company:"ABC",date:"2026-11-20"})));
test("reject blank company",()=>assert.throws(()=>normalizeCompanyName("PT ")));
