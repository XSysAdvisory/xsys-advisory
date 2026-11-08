/** Pure, side-effect-free trainer assignment checks. Never books a calendar. */
const norm=s=>typeof s==="string"?s.trim().toUpperCase():"";
export function validateTrainerDirectory(trainers){
 if(!Array.isArray(trainers))throw new TypeError("Directory must be an array");
 const seen=new Set();
 return trainers.map(t=>{
  const code=norm(t.code);
  if(!/^[A-Z]{2}$/.test(code))throw new Error("Invalid trainer code");
  if(seen.has(code))throw new Error("Duplicate trainer code: "+code);
  if(!t.name||typeof t.name!=="string")throw new Error("Missing trainer name");
  seen.add(code);
  return {...t,code};
 });
}
export function checkAssignment({trainerCode,topic,start,end,assignments=[],trainers=[]}){
 const directory=validateTrainerDirectory(trainers);
 const trainer=directory.find(t=>t.code===norm(trainerCode));
 if(!trainer)return {eligible:false,reason:"TRAINER_NOT_REGISTERED"};
 if(trainer.active!==true)return {eligible:false,reason:"TRAINER_NOT_ACTIVE"};
 if(!Array.isArray(trainer.skills)||!trainer.skills.some(s=>norm(s)===norm(topic)))return {eligible:false,reason:"SKILL_NOT_VERIFIED"};
 const from=Date.parse(start),to=Date.parse(end);
 if(!Number.isFinite(from)||!Number.isFinite(to)||from>=to)return {eligible:false,reason:"INVALID_TIME"};
 if(trainer.availabilityVerified!==true)return {eligible:false,reason:"AVAILABILITY_NOT_VERIFIED"};
 for(const a of assignments){
  if(a.cancelled===true)continue;
  const aStart=Date.parse(a.start),aEnd=Date.parse(a.end);
  if(!Number.isFinite(aStart)||!Number.isFinite(aEnd))return {eligible:false,reason:"ASSIGNMENT_DATA_INCOMPLETE"};
  if(from<aEnd&&to>aStart&&norm(a.trainerCode)===trainer.code)return {eligible:false,reason:"TRAINER_TIME_CONFLICT"};
 }
 return {eligible:true,reason:"TRAINER_CHECK_PASSED",note:"Resource, travel, platform and owner confirmation still required"};
}
