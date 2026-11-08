/** NRA CRM sync adapter: explicit fail-closed configuration, staging-only. */
export const STAGING_SHEET_ID="1GYndjkQc9aBDp5meO__FVZ7Pt1Kw0BOpyd_vj-4gUBk";
export const PRODUCTION_CRM_ID="19T9GXihaSwZHIlol1tV1qCr2RXbJFv36";
export function syncPreflight({spreadsheetId,credentialAvailable,enabled,organizer,mode}){
 if(spreadsheetId!==STAGING_SHEET_ID)return {ready:false,reason:"STAGING_ONLY"};
 if(spreadsheetId===PRODUCTION_CRM_ID)return {ready:false,reason:"PRODUCTION_BLOCKED"};
 if(organizer!=="XSys")return {ready:false,reason:"ORGANIZER_NOT_XSYS"};
 if(!credentialAvailable)return {ready:false,reason:"GOOGLE_CREDENTIAL_MISSING"};
 if(enabled!==true)return {ready:false,reason:"SYNC_DISABLED"};
 if(mode!=="dry-run")return {ready:false,reason:"DRY_RUN_ONLY"};
 return {ready:true,reason:"READY_FOR_DRY_RUN"};
}
export function mapLeadToStagingRow(lead){
 if(!lead||lead.source!=="nara_web"||!lead.id||!lead.created_at)return null;
 return {key:lead.id,sheet:"LEADS",rowValues:[lead.id,lead.created_at,lead.company||"",lead.name||"",lead.contact||"",lead.service||"",lead.details||""],action:"UPSERT_BY_LEAD_ID",mode:"DRY_RUN"};
}
