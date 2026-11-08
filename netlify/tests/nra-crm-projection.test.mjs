import test from "node:test";
import assert from "node:assert/strict";
import {planNraRecord,verifyCalendarIsolation} from "../lib/nra-crm-projection.mjs";
const valid={trainerCode:"RA",activity:"Training ISO 22000",company:"PT ABC",date:"2026-11-20",leadId:"lead-test",owner:"XSys"};
test("draft maps to official identifier without booking",()=>{const x=planNraRecord(valid);assert.equal(x.identifier,"NRA-RA_Training ISO 22000_ABC_201126");assert.equal(x.calendarAction,"NONE");assert.equal(x.syncState,"NOT_SYNCED")});
test("Traineed cannot enter XSys CRM projection",()=>assert.throws(()=>planNraRecord({...valid,owner:"Traineed Indonesia"})));
test("confirmed booking not inferred from lead",()=>assert.throws(()=>planNraRecord({...valid,status:"Confirmed"})));
test("missing lead id rejected",()=>assert.throws(()=>planNraRecord({...valid,leadId:""})));
test("legacy calendar events flagged without deletion",()=>assert.deepEqual(verifyCalendarIsolation([{id:"legacy",summary:"Traineed | Training ISO 37001"}])[0].action,"NO_AUTOMATIC_DELETE"));
