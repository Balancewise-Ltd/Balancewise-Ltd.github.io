'use strict';
const cmds=["claude \"Summarise this week's reports\"","agent deploy --name \"invoice-processor\"","mcp connect --server \"email\" --server \"crm\"","claude --workflow \"process support tickets\"","agent list --status running"];
let i=0;const el=document.getElementById('typeTarget');
function type(){if(!el)return;const cmd=cmds[i%cmds.length];let j=0;el.textContent='';
const t=setInterval(()=>{el.textContent+=cmd[j++];if(j>=cmd.length){clearInterval(t);setTimeout(()=>{const e=setInterval(()=>{el.textContent=el.textContent.slice(0,-1);if(!el.textContent){clearInterval(e);i++;setTimeout(type,500);}},30);},2000);}},52);}
setTimeout(type,1200);
