import {formatNraActivity} from "./nra-activity.mjs";
/** Read-only planning projection. Never writes to Google Sheets or Calendar. */
export function planNraRecord({trainerCode,activity,company,date,service,leadId,owner,status="Draft"}){
 if(!leadId||typeof leadId!=="string")throw new Error("Lead reference required");
 if(!owner||owner!=="XSys")throw new Error("Non-XSys organizer excluded");
 if(status!=="Draft"&&status!=="Proposed")throw new Error("Only nonconfirmed drafts may be planned");
 const identifier=formatNraActivity({trainerCode,activity,company,date});
 return Object.freeze({identifier,leadId,owner:"XSys",service:service||"Training",status,trainerCode:trainerCode.toUpperCase(),date,calendarAction:"NONE",syncState:"NOT_SYNCED"});
}
export function verifyCalendarIsolation(events){
 if(!Array.isArray(events))throw new TypeError("Events must be an array");
 return events.map(e=>({id:e.id||null,title:e.summary||"",classification: /^NRA-[A-Z]{2}_/.test(e.summary||"")?"NRA_CANDIDATE":"REVIEW_NON_NRA",action:"NO_AUTOMATIC_DELETE"}));
}
