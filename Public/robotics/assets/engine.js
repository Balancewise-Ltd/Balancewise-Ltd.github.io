/* Pure course state: no server, accounts or ROS execution. */
(function(root){
'use strict';
const VERSION='balancewise-robotics-2026-10-11-v1';
function fresh(){return {version:VERSION,completed:[],attempts:{},resume:null};}
// Earlier exports use a course-code prefix. Accept that release's schema while
// writing only the public game's name into new progress and downloaded backups.
function compatible(raw){return !!raw&&typeof raw.version==='string'&&Array.isArray(raw.completed)&&(raw.version===VERSION||/^[a-z]+\d{4}-2026-10-11-v1$/.test(raw.version));}
function clean(raw,sections){
 const state=fresh(),ids=sections.map(s=>s.id);
 if(!compatible(raw))return state;
 const done=new Set(raw.completed);
 for(const id of ids){if(!done.has(id))break;state.completed.push(id);}
 if(raw.attempts&&typeof raw.attempts==='object')for(const id of ids){const n=raw.attempts[id];if(Number.isInteger(n)&&n>=0&&n<=1000000)state.attempts[id]=n;}
 if(raw.resume&&ids.includes(raw.resume.id)&&ids.indexOf(raw.resume.id)<=state.completed.length){const s=sections[ids.indexOf(raw.resume.id)];state.resume={id:s.id,card:Math.max(0,Math.min(Number.isInteger(raw.resume.card)?raw.resume.card:0,s.cards.length-1))};}
 return state;
}
function unlocked(state,sections,id){const i=sections.findIndex(s=>s.id===id);return i>=0&&i<=state.completed.length;}
function choose(state,sections,id){if(!unlocked(state,sections,id))throw Error('Pass the preceding section first.');const section=sections.find(s=>s.id===id);return {id,card:0,stage:'study',q:0,feedback:null,seen:0,section};}
function advance(session){if(session.stage!=='study')throw Error('Read the section before the game.');session.card=Math.min(session.card+1,session.section.cards.length-1);session.seen=Math.max(session.seen,session.card);return session;}
function startQuiz(state,session){if(session.stage!=='study'||session.card!==session.section.cards.length-1||session.seen!==session.section.cards.length-1)throw Error('Finish the small steps first.');session.stage='quiz';session.q=0;session.feedback=null;state.attempts[session.id]=(state.attempts[session.id]||0)+1;return session;}
function answer(state,sections,session,index){if(session.stage!=='quiz'||session.feedback)throw Error('This question is not waiting for an answer.');const q=session.section.quiz[session.q];if(!Number.isInteger(index)||index<0||index>=q.choices.length)throw Error('Choose one of the displayed answers.');const correct=index===q.answer;session.feedback={correct,selected:index,why:q.why,remediate:q.remediate};if(!correct){session.stage='failed';session.card=0;session.seen=0;state.resume={id:session.id,card:0};}return correct;}
function nextQuestion(state,sections,session){if(session.stage!=='quiz'||!session.feedback||!session.feedback.correct)throw Error('Answer this question correctly first.');session.feedback=null;if(session.q+1<session.section.quiz.length){session.q++;return false;}session.stage='passed';const pos=sections.findIndex(s=>s.id===session.id);if(pos===state.completed.length)state.completed.push(session.id);const next=sections[pos+1];state.resume=next?{id:next.id,card:0}:{id:session.id,card:0};return true;}
function restart(session){session.card=0;session.seen=0;session.q=0;session.stage='study';session.feedback=null;return session;}
function shuffle(question,seed){const list=question.choices.map((text,index)=>({text,index}));let n=0;for(let i=0;i<String(seed).length;i++)n=(Math.imul(n,31)+String(seed).charCodeAt(i))>>>0;for(let i=list.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[list[i],list[j]]=[list[j],list[i]];}return list;}
root.CourseEngine={VERSION,compatible,fresh,clean,unlocked,choose,advance,startQuiz,answer,nextQuestion,restart,shuffle};
})(typeof globalThis!=='undefined'?globalThis:this);
