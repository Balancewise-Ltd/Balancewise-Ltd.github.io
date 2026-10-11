from pathlib import Path
import json,re,hashlib,collections
import gi
gi.require_version('JavaScriptCore','4.1')
from gi.repository import JavaScriptCore as JSC
root=Path(__file__).resolve().parents[1]
course=json.loads((root/'research/course.json').read_text())
sections=[s for w in course['weeks'] for s in w['sections']]
ids=[s['id'] for s in sections]
assert len(ids)==len(set(ids))
for s in sections:
 assert len(s['cards'])>=3,s['id']
 assert len(s['quiz'])>=3,s['id']
 assert s['source']['file'] and s['source']['pages']
 for card in s['cards']:assert card['title'] and card['text'] and all(isinstance(t,str) and t for t in card['text'])
 for q in s['quiz']:
  assert len(q['choices'])>=3 and len(set(q['choices']))==len(q['choices'])
  assert isinstance(q['answer'],int) and 0<=q['answer']<len(q['choices'])
  assert q['prompt'] and q['why'] and q['remediate']
 for r in s.get('research',[]):assert r['url'].startswith('https://') and r['title'] and r['addition'] and r['anchor']
for w in course['weeks']:
 # Source order is never allowed to move from demo back into lecture.
 if w.get('support'):continue
 seen_demo=False
 for s in w['sections']:
  demo='Demonstration' in s['source']['file']
  assert not(seen_demo and not demo),(w['number'],s['id'])
  seen_demo=seen_demo or demo
assert 'fetch(' not in (root/'assets/app.js').read_text()
assert '@import' not in (root/'assets/style.css').read_text()
for file in ['assets/course.js','assets/slide-index.js','assets/engine.js','assets/app.js']:
 context=JSC.Context.new()
 # Syntax check in an unexecuted Function body.
 context.evaluate('new Function('+json.dumps((root/file).read_text())+')',-1)
 exc=context.get_exception()
 assert exc is None,(file,exc.to_string() if exc else '')
ctx=JSC.Context.new()
def evaluate(script):
 result=ctx.evaluate(script,-1)
 exc=ctx.get_exception()
 if exc:raise AssertionError(exc.to_string())
 return result
for file in ['assets/course.js','assets/slide-index.js','assets/engine.js']:evaluate((root/file).read_text())
evaluate('''
function assert(ok,msg){if(!ok)throw Error(msg);}
function rejects(fn,msg){let caught=false;try{fn();}catch(_){caught=true;}assert(caught,msg);}
const ss=COURSE.weeks.flatMap(w=>w.sections);
let st=CourseEngine.fresh();
assert(CourseEngine.unlocked(st,ss,ss[0].id),'first section opens');
assert(!CourseEngine.unlocked(st,ss,ss[1].id),'second section locked');
rejects(()=>CourseEngine.choose(st,ss,ss[1].id),'cannot bypass course gate');
for(const sect of ss){
 let x=CourseEngine.choose(st,ss,sect.id);
 rejects(()=>CourseEngine.startQuiz(st,x),'cannot start unread section');
 while(x.card<sect.cards.length-1)CourseEngine.advance(x);
 CourseEngine.startQuiz(st,x);
 const before=st.completed.length;
 let wrong=(sect.quiz[0].answer+1)%sect.quiz[0].choices.length;
 assert(!CourseEngine.answer(st,ss,x,wrong),'wrong answer rejected');
 assert(x.stage==='failed'&&x.card===0&&x.seen===0,'failure starts section over');
 assert(st.completed.length===before,'earlier passes kept');
 rejects(()=>CourseEngine.nextQuestion(st,ss,x),'no continue after failure');
 CourseEngine.restart(x);
 rejects(()=>CourseEngine.startQuiz(st,x),'must reread before retry');
 while(x.card<sect.cards.length-1)CourseEngine.advance(x);
 CourseEngine.startQuiz(st,x);
 for(let i=0;i<sect.quiz.length;i++){
  assert(CourseEngine.answer(st,ss,x,sect.quiz[i].answer),'correct answer accepted');
  rejects(()=>CourseEngine.answer(st,ss,x,sect.quiz[i].answer),'no double answer');
  const passed=CourseEngine.nextQuestion(st,ss,x);
  assert(passed===(i===sect.quiz.length-1),'pass only on final question');
 }
 assert(st.completed.length===before+1,'unlock exactly one section');
 const perm=CourseEngine.shuffle(sect.quiz[0],sect.id+':2');
 assert(perm.filter(c=>c.index===sect.quiz[0].answer).length===1,'shuffle keeps correct mapping');
}
assert(st.completed.length===ss.length,'whole course completable');
const replay=CourseEngine.choose(st,ss,ss[0].id);
while(replay.card<replay.section.cards.length-1)CourseEngine.advance(replay);
CourseEngine.startQuiz(st,replay);
CourseEngine.answer(st,ss,replay,(replay.section.quiz[0].answer+1)%replay.section.quiz[0].choices.length);
assert(st.completed.length===ss.length,'replay failure preserves earned progress');
const gap=CourseEngine.clean({version:CourseEngine.VERSION,completed:[ss[0].id,ss[2].id],attempts:{[ss[0].id]:-7},resume:{id:ss[2].id,card:999}},ss);
assert(gap.completed.length===1&&gap.resume===null,'import preserves prefix and locked resume guard');
const restored=CourseEngine.clean(JSON.parse(JSON.stringify(st)),ss);
assert(restored.completed.length===ss.length,'progress round trip');
assert(CourseEngine.clean({version:'other',completed:ss.map(s=>s.id)},ss).completed.length===0,'old course version rejected');
''')
# Runtime smoke test of the complete interface in a simulated DOM.
ctx=JSC.Context.new()
evaluate('''
let rendered='',handlers={},saved={};
const leftSlider={value:'0.25',addEventListener(type,fn){this.update=fn;}},rightSlider={value:'0.35',addEventListener(type,fn){this.update=fn;}};
const wheelOut={textContent:''},wheelPath={value:'',setAttribute(key,value){this.value=value;}};
const wheelLab={querySelector(key){return {'[data-wheel="left"]':leftSlider,'[data-wheel="right"]':rightSlider,'[data-wheel-output]':wheelOut,'[data-wheel-path]':wheelPath}[key];}};
const lidarSlider={value:'20',addEventListener(type,fn){this.update=fn;}},lidarOut={textContent:''};
const lidarLab={querySelector(key){return key==='input'?lidarSlider:lidarOut;}};
const mockApp={get innerHTML(){return rendered;},set innerHTML(v){rendered=v;},querySelector(key){if(key==='[data-lab="wheels"]'&&rendered.includes('data-lab="wheels"'))return wheelLab;if(key==='[data-lab="lidar"]'&&rendered.includes('data-lab="lidar"'))return lidarLab;return null;},prepend(){}};
const mockNode={setAttribute(){},focus(){},addEventListener(){},textContent:'',click(){}};
globalThis.window=globalThis;
globalThis.location={hash:''};
globalThis.document={getElementById(id){return id==='app'?mockApp:mockNode;},addEventListener(type,fn){handlers[type]=fn;},createElement(){return {...mockNode};}};
globalThis.localStorage={getItem(k){return saved[k]||null;},setItem(k,v){saved[k]=v;}};
globalThis.scrollTo=()=>{};globalThis.addEventListener=()=>{};globalThis.confirm=()=>false;
globalThis.console={error(e){throw e;}};
function assert(ok,msg){if(!ok)throw Error(msg);}
function click(action,extra={}){const target={dataset:{action,...extra},disabled:false};handlers.click({target:{closest(){return target;}}});}
''')
for file in ['assets/course.js','assets/slide-index.js','assets/engine.js','assets/app.js']:evaluate((root/file).read_text())
evaluate('''
assert(rendered.includes('Your course map'),'initial map renders');
click('sources');assert(rendered.includes('What external research added'),'research view renders');
click('rules');assert(rendered.includes('How to play'),'rules render');
click('settings');assert(rendered.includes('Export my progress'),'progress view renders');
click('home');
const all=COURSE.weeks.flatMap(w=>w.sections);
for(const section of all){
 click('start',{id:section.id});assert(rendered.includes('Small step 1'),'section begins at first card');
 for(let i=1;i<section.cards.length;i++)click('next');
 click('quiz');assert(rendered.includes('Section game'),'quiz renders');
 click('answer',{index:(section.quiz[0].answer+1)%section.quiz[0].choices.length});
 assert(rendered.includes('Let’s rebuild this idea.'),'wrong-answer remediation renders');
 click('restart');assert(rendered.includes('Small step 1'),'restart renders first card');
 for(let i=1;i<section.cards.length;i++)click('next');
 click('quiz');
 for(const question of section.quiz){click('answer',{index:question.answer});click('question');}
 assert(rendered.includes('A small step mastered.'),'pass screen renders');
 if(section.id==='w3-s3'){
  assert(wheelOut.textContent.includes('v = 0.30 m/s')&&wheelOut.textContent.includes('ω = 0.50 rad/s'),'wheel toy matches original lecture');
  leftSlider.value='-0.35';rightSlider.value='-0.25';leftSlider.update();
  assert(wheelPath.value.endsWith('L246.10 160.90'),'reverse arc turns in physically correct direction');
  leftSlider.value='0';rightSlider.value='0';leftSlider.update();assert(wheelOut.textContent.includes('stopped'),'zero speeds stop');
  leftSlider.value='0.25';rightSlider.value='0.35';
 }
 if(lidarOut.textContent){assert(lidarOut.textContent.includes('Distance = c × t ÷ 2 = 3.00 m'),'LiDAR toy matches20ns screenshot');}

}
click('home');assert(rendered.includes('Course quest complete'),'complete map renders');
''')
# Verify that the borrowed title index matches our actual source citations.
idx=json.loads((root/'research/slide-index.json').read_text())
assert len(idx['documents'])==20
assert sum(len(rows) for rows in idx['documents'].values())==517
for sect in sections:
 name=idx['aliases'].get(sect['source']['file'],sect['source']['file'])
 rows=idx['documents'][name]
 wanted=set()
 for a,b in re.findall(r'(\d+)(?:\s*[–-]\s*(\d+))?',sect['source']['pages']):
  wanted.update(range(int(a),int(b or a)+1))
 assert wanted and wanted.issubset({r['page'] for r in rows}),sect['id']
for sect in sections:
 if sect['id'] in {'w6-s1','w12-s1','w12-s2','w12-s3'}:
  assert sect['source']['file']=='KV6022 - Robotics & Automation - Week 1 Student.pdf'
evaluate(r"""
click('start',{id:'w1-s1'});
assert(rendered.includes('Original slide titles · 11 pages/slides'),'first section exposes exact original page titles');
assert(rendered.includes('Page/slide 11')&&!rendered.includes('Page/slide 12'),'index stays inside cited range');
click('listen');
assert(mockNode.textContent.includes('unavailable'),'unsupported voice playback has a useful fallback');
let audioQueue=[],cancels=0;
globalThis.SpeechSynthesisUtterance=function(text){this.text=text;};
globalThis.speechSynthesis={paused:false,getVoices(){return [{lang:'en-GB',localService:false,name:'remote'},{lang:'en-US',localService:true,name:'local'}];},speak(u){audioQueue.push(u);},cancel(){cancels++;}};
click('listen');
assert(audioQueue.length===1,'audio only starts on user request');
assert(audioQueue[0].text.includes('Your first small idea'),'reads current card');
assert(audioQueue[0].voice.localService&&audioQueue[0].rate===0.9,'prefers available local English voice at a calm speed');
const firstUtterance=audioQueue[0];
click('next');
assert(cancels===1,'changing card stops old audio');
const count=audioQueue.length;firstUtterance.onend();
assert(audioQueue.length===count,'late audio callback cannot read a previous card');
click('listen');
assert(audioQueue[audioQueue.length-1].text.includes('What each tool does'),'new audio follows the current card');
let next=audioQueue[audioQueue.length-1],cursor=audioQueue.length;
while(true){assert(next.text.length<=200,'long speech is broken into small chunks');next.onend();if(audioQueue.length===cursor)break;cursor=audioQueue.length;next=audioQueue[cursor-1];}
assert(mockNode.textContent.includes('Finished reading'),'audio completion is reported');
click('listen');click('stop-audio');
assert(mockNode.textContent==='Audio stopped.','explicit audio stop is reported');
click('listen');audioQueue[audioQueue.length-1].onerror({error:'voice-unavailable'});
assert(mockNode.textContent.includes('could not play this voice'),'voice error leaves reading available');
click('listen');const beforeHome=cancels;click('home');assert(cancels===beforeHome+1,'leaving lesson stops playback');
click('start',{id:'w12-s1'});
assert(rendered.includes('Original slide titles · 12 pages/slides'),'comma-separated page ranges handled');
assert(rendered.includes('Page/slide 10')&&rendered.includes('Page/slide 19')&&!rendered.includes('Page/slide 11'),'gaps in review citations remain gaps');
""")
print('PASS: 517-page index, identical-file aliases, all section ranges, corrected review citations and supported/unsupported audio, chunking, stop/navigation, stale callbacks and voice errors.')
print('PASS: structure/source links, all JavaScript syntax, strict section gating, failure+reread, all correct-answer paths, shuffle mapping, progress validation/import/export and full interface runtime smoke test.')
print('Sections:',len(sections),'Questions:',sum(len(s['quiz'])for s in sections),'Small steps:',sum(len(s['cards'])for s in sections))
