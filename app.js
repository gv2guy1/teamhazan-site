/* Based on Guy's original Team Hazan page. Only requested behavior is changed.
   Lead POST keeps its existing Make destination. No QA submission is made.
   Meta Pixel is intentionally disabled on this review copy. */
(function(){
'use strict';
var $=function(i){return document.getElementById(i)};
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
var motionPaused=RM, motion=$('motion');

/* Original layered hero parallax. */
var big=$('big'), noam=$('noam'), tx=0,ty=0,cx=0,cy=0,heroRAF=0;
function heroLoop(){
  if(motionPaused||document.hidden){heroRAF=0;return}
  cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;
  var desk=matchMedia('(min-width:900px)').matches;
  var sy=Math.min(scrollY,innerHeight*1.2);
  big.style.transform='translate3d('+(-cx*26)+'px,'+(-cy*16+sy*.35)+'px,0)';
  noam.style.transform=(desk?'':'translateX(-50%) ')+'translate3d('+(cx*14)+'px,'+(cy*8+sy*.12)+'px,0)';
  heroRAF=(Math.abs(tx-cx)>.001||Math.abs(ty-cy)>.001)?requestAnimationFrame(heroLoop):0;
}
function heroKick(){if(!heroRAF&&!motionPaused&&!RM)heroRAF=requestAnimationFrame(heroLoop)}
if(!RM){
  addEventListener('pointermove',function(e){
    if(e.pointerType!=='mouse'||scrollY>innerHeight*1.2)return;
    tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5;heroKick();
  },{passive:true});
  addEventListener('scroll',function(){if(scrollY<innerHeight*1.2)heroKick()},{passive:true});
  addEventListener('resize',heroKick,{passive:true});
}

/* Original entrance reveals. Core content does not require a click. */
var rv=document.querySelectorAll('.rv');
if('IntersectionObserver' in window&&!RM){
  var revealObserver=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');revealObserver.unobserve(e.target)}});
  },{threshold:.08});
  rv.forEach(function(el){revealObserver.observe(el)});
}else rv.forEach(function(el){el.classList.add('in')});

/* Guy's original personal story; same words and reveal, shorter scroll distance. */
var storyEl=$('story'),words=storyEl.querySelectorAll('.word'),dots=storyEl.querySelectorAll('.stepper i'),simg=$('storyImg'),storyCur=-2;
var storyPin=storyEl.querySelector('.story-pin'),storyRAF=0,storyNeedsMeasure=true;
var storyTop=0,storyTravel=1,storyViewport=1;
function updateStory(){
  storyRAF=0;
  if(storyNeedsMeasure){
    storyTop=storyEl.getBoundingClientRect().top+scrollY;
    // CSS uses stable svh, so Safari's changing toolbar must not move the story thresholds.
    storyViewport=storyPin.offsetHeight||innerHeight;
    storyTravel=Math.max(1,storyEl.offsetHeight-storyViewport);
    storyNeedsMeasure=false;
  }
  var top=storyTop-scrollY,p=Math.min(1,Math.max(0,-top/storyTravel)),s=Math.min(3,Math.floor(p*4.2));
  if(top>storyViewport*.4)s=-1;
  if(s===storyCur)return;storyCur=s;
  words.forEach(function(w,i){w.classList.toggle('on',i===s);w.classList.toggle('past',i<s)});
  dots.forEach(function(d,i){d.classList.toggle('on',i<=s)});
  simg.style.setProperty('--r',s===3?'75%':s===2?'14%':'0%');
  simg.style.setProperty('--vig',s===3?'1':'0');
}
function queueStory(){if(!storyRAF)storyRAF=requestAnimationFrame(updateStory)}
function measureStory(){storyNeedsMeasure=true;queueStory()}
if(!RM){
  addEventListener('scroll',queueStory,{passive:true});
  addEventListener('resize',measureStory,{passive:true});
  if('ResizeObserver' in window){
    var storyResize=new ResizeObserver(measureStory);storyResize.observe(storyEl);storyResize.observe($('top'));
  }
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measureStory);
  updateStory();
}

/* Original before/after viewer, with original Drive photos and a full sweep on EVERY image.
   Cropping is CSS-only; the source photographs are neither generated nor retouched. */
var B=[
  {id:'result-05',by:164,ay:164},
  {id:'result-10',by:190,ay:250},
  {id:'result-24',by:164,ay:164},
  {id:'osher-new',before:{src:'osher-before.jpeg',cw:1536,ch:2048,x:140,y:340,w:1040,h:1680},after:{src:'osher-after.jpeg',cw:1179,ch:2096,x:0,y:420,w:988,h:1596}},
  {id:'new-15',by:164,ay:164},
  {id:'result-25',by:400,ay:375},
  {id:'result-09',by:160,ay:164},
  {id:'result-13',by:170,ay:170},
  {id:'result-28',by:244,ay:164},
  {id:'result-26',ext:'png',by:318,ay:318},
  {id:'haim-20261107',ext:'jpeg',w:530,h:875,bx:12,ax:550,by:316,ay:316},
  {id:'new-05',by:164,ay:164},
  {id:'result-35',ext:'jpg',h:1026,by:318,ay:318},
  {id:'result-11',by:164,ay:164},
  {id:'result-06',by:250,ay:250},
  {id:'new-02',by:164,ay:164},
  {id:'result-14',ext:'png',h:1026,by:318,ay:318,beforeAlt:'נועם חזן בילדותו — לפני השינוי האישי',afterAlt:'נועם חזן על במת התחרות — אחרי השינוי האישי'},
  {id:'result-29',ext:'png',by:318,ay:318},
  {id:'new-22',ext:'png',by:500,ay:420},
  {id:'supplied-20261106-04',ext:'jpeg',by:164,ay:164},
  {id:'supplied-20261106-01',ext:'jpeg',by:190,ay:190},
  {id:'result-33',ext:'png',by:318,ay:318},
  {id:'result-20',by:164,ay:164},
  {id:'result-15',by:250,ay:250},
  {id:'result-07',by:164,ay:164},
  {id:'result-17',by:190,ay:190},
  {id:'supplied-20261106-03',ext:'jpeg',by:315,ay:315},
  {id:'new-37',cw:1440,ch:1800,w:660,h:1066,bx:40,ax:770,by:500,ay:500},
  {id:'result-27',by:370,ay:390},
  {id:'result-16',by:164,ay:164},
  {id:'result-30',by:430,ay:430},
  {id:'result-02',by:164,ay:244}
];
function photoPart(photo,after){
  var supplied=after?photo.after:photo.before;
  if(supplied)return supplied;
  return {src:photo.id+'.'+(photo.ext||'webp'),cw:photo.cw||1080,ch:photo.ch||1350,
    w:photo.w||520,h:photo.h||840,x:after?(photo.ax===undefined?550:photo.ax):(photo.bx===undefined?4:photo.bx),y:after?photo.ay:photo.by};
}
// Every comparison has the same slim frame as the reference. Extend the
// source crop vertically (rather than stretch the person) when a legacy crop
// was shorter. Keep both halves aligned and inside their real source image.
var comparisonAspect=480/909;
function fitPart(part){
  var h=Math.min(part.ch,part.w/comparisonAspect),w=h*comparisonAspect;
  return {src:part.src,cw:part.cw,ch:part.ch,w:w,h:h,
    x:Math.max(0,Math.min(part.cw-w,part.x+(part.w-w)/2)),
    y:Math.max(0,Math.min(part.ch-h,part.y))};
}
function placePhoto(image,sourcePart){
  var part=fitPart(sourcePart);
  image.width=part.cw;image.height=part.ch;
  image.style.width=(part.cw/part.w*100)+'%';
  image.style.height=(part.ch/part.h*100)+'%';
  image.style.left=(-part.x/part.w*100)+'%';
  image.style.top=(-part.y/part.h*100)+'%';
  image.src='media/'+part.src;
}
var k=0,cmp=$('cmp'),imA=$('imA'),imB=$('imB'),drag=false,compareRect=null,lastAriaX=-1;
var cmpVisible=false,sweepRAF=0,nextTimer=0,changeToken=0,dragPointer=null,photoReady=false,cmpTouch=null;
var compareEpoch=0,sweepElapsed=0,sweepFrameTime=null,sweepFrom=3,sweepLeadIn=0;
var sweepFinished=false,manualCompare=false,waitPending=false,waitRemaining=0,waitStarted=0;
function setX(x){
  x=Math.max(0,Math.min(100,x));
  cmp.style.setProperty('--x',x+'%');
  var rounded=Math.round(x);
  if(rounded!==lastAriaX){
    lastAriaX=rounded;
    cmp.setAttribute('aria-valuenow',rounded);
    cmp.setAttribute('aria-valuetext',rounded+'% אחרי');
  }
}
function stopCompare(){
  compareEpoch++;
  cancelAnimationFrame(sweepRAF);sweepRAF=0;
  sweepFrameTime=null;
  if(nextTimer)waitRemaining=Math.max(0,waitRemaining-(performance.now()-waitStarted));
  clearTimeout(nextTimer);nextTimer=0;
  waitStarted=0;
}
function canRunCompare(){
  return !motionPaused&&!RM&&cmpVisible&&!drag&&!cmpTouch&&!document.hidden;
}
function resumeNext(){
  if(!waitPending||nextTimer||!canRunCompare())return;
  var token=changeToken,epoch=compareEpoch;
  waitStarted=performance.now();
  nextTimer=setTimeout(function(){
    if(token!==changeToken||epoch!==compareEpoch)return;
    nextTimer=0;waitStarted=0;waitRemaining=0;
    if(!canRunCompare())return;
    waitPending=false;go(1);
  },waitRemaining);
}
function scheduleNext(delay){
  clearTimeout(nextTimer);nextTimer=0;waitStarted=0;
  waitRemaining=delay===undefined?4200:Math.max(0,delay);waitPending=true;
  resumeNext();
}
function compareEase(p){
  p=Math.max(0,Math.min(1,p));return p*p*(3-2*p);
}
function sweep(){
  // Visibility/decode callbacks must not overwrite a manual position or restart a photo.
  if(!canRunCompare()){stopCompare();return}
  if(manualCompare||sweepFinished||waitPending){resumeNext();return}
  if(!photoReady||sweepRAF)return;
  var token=changeToken,epoch=compareEpoch;
  sweepFrameTime=performance.now();
  function frame(t){
    if(token!==changeToken||epoch!==compareEpoch)return;
    sweepRAF=0;
    if(!canRunCompare()||manualCompare){sweepFrameTime=null;return}
    sweepElapsed+=Math.max(0,t-sweepFrameTime);sweepFrameTime=t;
    var p=(sweepElapsed-sweepLeadIn)/2600,x;
    if(sweepElapsed<sweepLeadIn)x=sweepFrom+(3-sweepFrom)*compareEase(sweepElapsed/sweepLeadIn);
    else if(p<.58)x=3+94*compareEase(p/.58);
    else if(p<.76)x=97;
    else x=97-(97-52)*compareEase((p-.76)/.24);
    setX(x);
    if(p<1)sweepRAF=requestAnimationFrame(frame);
    // Sweep once to demonstrate the result; changing trainees is always
    // a deliberate arrow click, never a timer interrupting a visitor's drag.
    else{sweepElapsed=sweepLeadIn+2600;sweepFinished=true;sweepFrameTime=null}
  }
  sweepRAF=requestAnimationFrame(frame);
}
function updateMotionLabel(){
  motion.setAttribute('aria-pressed',motionPaused?'true':'false');
  motion.setAttribute('aria-label',RM?'תמונה '+(k+1)+' מתוך '+B.length+' — הנפשות כבויות בהגדרות המכשיר':
    (motionPaused?'הפעלת התנועה האוטומטית':'עצירת התנועה האוטומטית'));
  motion.querySelector('.motion-mark').textContent=motionPaused?'▷':'Ⅱ';
}
function showPhoto(){
  stopCompare();
  cmpTouch=null;
  if(drag){
    var oldPointer=dragPointer;drag=false;dragPointer=null;
    if(cmp.hasPointerCapture&&cmp.hasPointerCapture(oldPointer))cmp.releasePointerCapture(oldPointer);
  }
  compareRect=null;
  sweepElapsed=0;sweepFinished=false;manualCompare=false;waitPending=false;waitRemaining=0;
  sweepFrom=RM||motionPaused?50:3;sweepLeadIn=sweepFrom===3?0:320;
  photoReady=false;
  cmp.setAttribute('aria-busy','true');
  var token=++changeToken,photo=B[k];
  placePhoto(imA,photoPart(photo,true));
  placePhoto(imB,photoPart(photo,false));
  imA.alt=photo.afterAlt||'אחרי תהליך הליווי — שינוי '+(k+1);
  imB.alt=photo.beforeAlt||'לפני תהליך הליווי — שינוי '+(k+1);
  $('ci').textContent=('0'+(k+1)).slice(-2);
  $('ct').textContent=B.length;
  updateMotionLabel();setX(sweepFrom);
  Promise.all([imA.decode?imA.decode().catch(function(){}):Promise.resolve(),
    imB.decode?imB.decode().catch(function(){}):Promise.resolve()]).then(function(){
    if(token!==changeToken)return;
    photoReady=imA.naturalWidth>0&&imB.naturalWidth>0;
    cmp.setAttribute('aria-busy','false');
    if(!photoReady){scheduleNext(2000);return}
    sweep();
    var followingPhoto=B[(k+1)%B.length],following=new Image();
    following.src='media/'+photoPart(followingPhoto,true).src;
    if(followingPhoto.before){var followingBefore=new Image();followingBefore.src='media/'+photoPart(followingPhoto,false).src}
  });
}
function go(d){k=(k+d+B.length)%B.length;showPhoto()}
showPhoto();
$('nx').addEventListener('click',function(){go(1)});
$('pv').addEventListener('click',function(){go(-1)});
function takeManualControl(){
  stopCompare();manualCompare=true;waitPending=false;waitRemaining=0;
}
function fromEv(e){
  // Cache geometry for the whole gesture: no layout reads between visual writes.
  var r=compareRect||cmp.getBoundingClientRect();
  if(r.width)setX((e.clientX-r.left)/r.width*100);
}
function beginCompareDrag(e){
  takeManualControl();drag=true;dragPointer=e.pointerId;
  compareRect=cmp.getBoundingClientRect();
  // Capture on the first contact, as the working reference does. Capturing
  // only after a move loses the gesture on iOS Safari's pointer arbitration.
  if(cmp.setPointerCapture)try{cmp.setPointerCapture(e.pointerId)}catch(_){}
  fromEv(e);
}
cmp.addEventListener('pointerdown',function(e){
  if(e.pointerType==='touch'&&!e.isPrimary){endDrag();return}
  if(e.button!==0)return;
  beginCompareDrag(e);
});
cmp.addEventListener('pointermove',function(e){
  if(drag&&e.pointerId===dragPointer)fromEv(e);
});
function endDrag(){
  cmpTouch=null;
  if(!drag)return;
  drag=false;dragPointer=null;compareRect=null;
}
cmp.addEventListener('pointerup',function(e){
  if(drag&&e.pointerId===dragPointer)endDrag();
});
cmp.addEventListener('pointercancel',endDrag);
cmp.addEventListener('lostpointercapture',endDrag);
cmp.addEventListener('keydown',function(e){
  var m={ArrowLeft:-5,ArrowDown:-5,ArrowRight:5,ArrowUp:5},v=+cmp.getAttribute('aria-valuenow');
  if(e.key in m||e.key==='Home'||e.key==='End'){
    e.preventDefault();takeManualControl();
    setX(e.key==='Home'?0:e.key==='End'?100:v+m[e.key]);
  }
});
if('IntersectionObserver' in window){
  var compareObserver=new IntersectionObserver(function(es){
    cmpVisible=es[0].isIntersecting&&es[0].intersectionRatio>=.35;
    if(cmpVisible)sweep();else stopCompare();
  },{threshold:[0,.35]});
  compareObserver.observe(cmp);
}else{cmpVisible=true;sweep()}

/* Original video, inline. Never hide the play control unless playback succeeds. */
$('play').addEventListener('click',function(){
  var button=this,v=$('vid');button.disabled=true;v.controls=true;
  var playing=v.play();
  Promise.resolve(playing).then(function(){button.remove()}).catch(function(){
    button.disabled=false;
    button.setAttribute('aria-label','לנסות לנגן שוב את הסרטון של נועם');
  });
});

/* Same two WhatsApp-style lanes, now also natively swipeable.
   Genuine excerpts only; no fabricated timestamps or delivery ticks. */
var qs=document.querySelector('.quotes'),quoteRows=[],quoteRAF=0,lastQuoteTime=0,quotesVisible=false;
document.querySelectorAll('.quote-window').forEach(function(win,index){
  var lane=win.querySelector('.lane'),originals=Array.from(lane.children),copies=RM?1:4;
  for(var c=1;c<copies;c++)originals.forEach(function(el){
    var clone=el.cloneNode(true);clone.setAttribute('aria-hidden','true');lane.appendChild(clone);
  });
  var row={win:win,lane:lane,copies:copies,dir:index===0?1:-1,pos:0,cycle:0,hover:false,focus:false,pauseUntil:0,mouse:null};
  quoteRows.push(row);
  function distance(){return (lane.scrollWidth+14)/copies}
  row.cycle=distance();
  if(!RM&&index===1){row.pos=row.cycle;win.scrollLeft=row.pos}
  win.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse')row.hover=true});
  win.addEventListener('pointerleave',function(){row.hover=false});
  win.addEventListener('focusin',function(){row.focus=true});
  win.addEventListener('focusout',function(e){if(!win.contains(e.relatedTarget))row.focus=false});
  win.addEventListener('pointerdown',function(e){
    row.pauseUntil=performance.now()+8000;row.pos=win.scrollLeft;
    if(e.pointerType==='mouse'&&e.button===0){
      row.mouse={id:e.pointerId,x:e.clientX,left:win.scrollLeft};
      win.setPointerCapture(e.pointerId);win.classList.add('is-dragging');
    }
  });
  win.addEventListener('pointermove',function(e){
    if(!row.mouse)return;
    win.scrollLeft=row.mouse.left-(e.clientX-row.mouse.x);row.pos=win.scrollLeft;
    row.pauseUntil=performance.now()+8000;
  });
  function release(){row.mouse=null;win.classList.remove('is-dragging');row.pauseUntil=performance.now()+8000}
  win.addEventListener('pointerup',release);win.addEventListener('pointercancel',release);
  win.addEventListener('lostpointercapture',release);
  win.addEventListener('wheel',function(e){
    if(Math.abs(e.deltaX)>Math.abs(e.deltaY))row.pauseUntil=performance.now()+8000;
  },{passive:true});
});
function measureQuotes(){quoteRows.forEach(function(row){row.cycle=(row.lane.scrollWidth+14)/row.copies})}
addEventListener('resize',measureQuotes,{passive:true});
if('ResizeObserver' in window){
  var quoteResize=new ResizeObserver(measureQuotes);quoteRows.forEach(function(row){quoteResize.observe(row.lane)});
}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measureQuotes);
var lastPageScroll=0;
addEventListener('scroll',function(){lastPageScroll=performance.now()},{passive:true});
function quoteFrame(t){
  if(motionPaused||RM||document.hidden||!quotesVisible){quoteRAF=0;lastQuoteTime=0;return}
  var dt=Math.min(50,lastQuoteTime?t-lastQuoteTime:0);lastQuoteTime=t;
  // Don't write horizontal scroll positions during native vertical page scroll.
  if(t-lastPageScroll<180){quoteRAF=requestAnimationFrame(quoteFrame);return}
  quoteRows.forEach(function(row){
    if(row.hover||row.focus||row.mouse||t<row.pauseUntil){row.pos=row.win.scrollLeft;return}
    var dist=row.cycle;
    row.pos+=row.dir*dt*.022;
    if(row.pos>=dist)row.pos-=dist;
    if(row.pos<0)row.pos+=dist;
    row.win.scrollLeft=row.pos;
  });
  quoteRAF=requestAnimationFrame(quoteFrame);
}
function startQuotes(){if(!quoteRAF&&!motionPaused&&!RM&&quotesVisible&&!document.hidden)quoteRAF=requestAnimationFrame(quoteFrame)}
if('IntersectionObserver' in window){
  var quoteObserver=new IntersectionObserver(function(es){
    quotesVisible=es[0].isIntersecting;
    if(quotesVisible)startQuotes();
  },{threshold:0});
  quoteObserver.observe(qs);
}else{quotesVisible=true;startQuotes()}

motion.disabled=RM;updateMotionLabel();
motion.addEventListener('click',function(){
  if(RM)return;
  motionPaused=!motionPaused;
  document.documentElement.classList.toggle('motion-paused',motionPaused);
  updateMotionLabel();
  if(motionPaused){stopCompare();cancelAnimationFrame(quoteRAF);quoteRAF=0;lastQuoteTime=0}
  else{sweep();startQuotes();heroKick()}
});
addEventListener('visibilitychange',function(){
  if(document.hidden){stopCompare();cancelAnimationFrame(quoteRAF);quoteRAF=0;lastQuoteTime=0}
  else{sweep();startQuotes()}
});

/* Fast touch controls: WebKit touchend fallback where CSS manipulation is ignored.
   Only clean, single-finger taps in the gallery/quote surfaces are intercepted.
   Start/move remain passive; pinch, scroll, long-press and native keyboard clicks stay native. */
var touchTap=null,lastSurfaceTap=null;
function resetTouchTap(){touchTap=null;lastSurfaceTap=null}
function touchViewport(){
  var v=window.visualViewport;
  return [window.scrollX,window.scrollY,v?v.offsetLeft:0,v?v.offsetTop:0,v?v.scale:1];
}
function touchViewportUnchanged(tap){
  var v=touchViewport();
  return v.every(function(n,i){return Math.abs(n-tap.viewport[i])<(i===4?.01:2)})&&
    Math.abs(tap.surface.scrollLeft-tap.left)<2&&Math.abs(tap.surface.scrollTop-tap.top)<2;
}
function touchStayedNear(tap,t){return t&&t.identifier===tap.id&&Math.abs(t.clientX-tap.x)<=12&&Math.abs(t.clientY-tap.y)<=12}
document.addEventListener('touchstart',function(e){
  // This also sees a second finger that starts OUTSIDE the active surface.
  if(e.touches.length!==1){resetTouchTap();if(drag||cmpTouch)endDrag()}
  else if(!e.target.closest||!e.target.closest('.cmp-nav,#cmp,.quote-window'))resetTouchTap();
},{passive:true,capture:true});
addEventListener('scroll',resetTouchTap,{passive:true});
document.querySelectorAll('.cmp-nav,#cmp,.quote-window').forEach(function(surface){
  var navigation=surface.classList.contains('cmp-nav');
  surface.addEventListener('touchstart',function(e){
    if(e.defaultPrevented||e.touches.length!==1){resetTouchTap();return}
    var target=e.target,button=navigation&&target.closest?target.closest('button'):null;
    if(navigation&&(!button||!surface.contains(button)||button.disabled)){resetTouchTap();return}
    if(!navigation&&target.closest&&target.closest('a,button,input,select,textarea,summary,[contenteditable]')){resetTouchTap();return}
    var t=e.touches[0];
    touchTap={surface:surface,button:button,id:t.identifier,x:t.clientX,y:t.clientY,time:performance.now(),
      viewport:touchViewport(),left:surface.scrollLeft,top:surface.scrollTop};
  },{passive:true});
  surface.addEventListener('touchmove',function(e){
    var tap=touchTap;
    if(tap&&tap.surface===surface&&
      (e.touches.length!==1||!touchStayedNear(tap,e.touches[0])||!touchViewportUnchanged(tap)))resetTouchTap();
  },{passive:true});
  surface.addEventListener('touchend',function(e){
    var tap=touchTap;touchTap=null;
    var t=e.changedTouches[0],now=performance.now();
    if(!tap||tap.surface!==surface||e.defaultPrevented||e.touches.length||e.changedTouches.length!==1||
      now-tap.time>500||!touchStayedNear(tap,t)||!touchViewportUnchanged(tap)){lastSurfaceTap=null;return}
    var target=tap.button||surface,r=target.getBoundingClientRect();
    if(t.clientX<r.left||t.clientX>r.right||t.clientY<r.top||t.clientY>r.bottom){lastSurfaceTap=null;return}
    if(tap.button){
      lastSurfaceTap=null;
      if(tap.button.disabled||!e.cancelable)return;
      e.preventDefault();
      // Replace the suppressed synthetic click exactly once, including each rapid tap.
      if(e.defaultPrevented)tap.button.click();
      return;
    }
    var repeated=lastSurfaceTap&&lastSurfaceTap.surface===surface&&now-lastSurfaceTap.time<=350&&
      Math.abs(t.clientX-lastSurfaceTap.x)<=28&&Math.abs(t.clientY-lastSurfaceTap.y)<=28;
    lastSurfaceTap={surface:surface,time:now,x:t.clientX,y:t.clientY};
    if(repeated&&e.cancelable)e.preventDefault();
  },{passive:false});
  surface.addEventListener('touchcancel',resetTouchTap,{passive:true});
  surface.addEventListener('dblclick',function(e){if(e.cancelable)e.preventDefault()});
});

/* Original sticky contact CTA: hidden when hero or form is in view. */
var stk=$('st'),jo=$('join'),hero=$('top');
if('IntersectionObserver' in window){
  var vis={h:true,j:false};
  var stickyObserver=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.target===hero)vis.h=e.isIntersecting;else vis.j=e.isIntersecting});
    stk.classList.toggle('hide',vis.h||vis.j);
  });
  stickyObserver.observe(hero);stickyObserver.observe(jo);
}

/* Existing Make integration; original age/goal fields and commitment restored.
   Each submitted value comes from the visitor's actual selection.
   no-cors yields an opaque response, NOT proof of receipt in the CRM. */
var params=new URLSearchParams(location.search),f=$('f'),submit=$('s'),busy=false;
function err(id,msg){
  $(id+'-e').textContent=msg;$(id).setAttribute('aria-invalid',msg?'true':'false');return !msg;
}
['n','p','a','g','c'].forEach(function(id){$(id).addEventListener('input',function(){if($(id).getAttribute('aria-invalid')==='true')err(id,'')})});
['a','g'].forEach(function(id){
  function selected(){ $(id).classList.toggle('has',!!$(id).value) }
  $(id).addEventListener('change',selected);selected();
});
f.addEventListener('submit',function(e){
  e.preventDefault();
  if(busy||f.elements.namedItem('website').value)return;
  var name=$('n').value.trim(),phone=$('p').value.replace(/\D/g,'');
  if(phone.indexOf('972')===0)phone='0'+phone.slice(3);
  var valid=err('n',name.length<2?'איך קוראים לך?':'');
  valid=err('p',/^05\d{8}$/.test(phone)?'':'צריך מספר נייד תקין')&&valid;
  valid=err('a',$('a').value?'':'באיזו קבוצת גיל אתה?')&&valid;
  valid=err('g',$('g').value?'':'מה המטרה שלך?')&&valid;
  valid=err('c',$('c').checked?'':'בלי זה אנחנו לא מתחילים (:')&&valid;
  if(!valid){f.querySelector('[aria-invalid="true"]').focus();return}
  busy=true;submit.disabled=true;submit.textContent='שולחים…';$('f-e').textContent='';
  var body=new URLSearchParams({
    name:name,phone05:phone,phone972:'972'+phone.slice(1),
    age:$('a').value,goal:$('g').value,interest:'ליווי אישי',contact:'וואטסאפ',
    utm_campaign:params.get('utm_campaign')||'ישיר',
    utm_content:params.get('utm_content')||'',test:params.get('test')==='1'?'1':'0'
  });
  var abort=new AbortController(),timeout=setTimeout(function(){abort.abort()},15000);
  fetch(f.action,{method:'POST',mode:'no-cors',body:body,signal:abort.signal}).then(function(){
    clearTimeout(timeout);
    if(params.get('test')!=='1'&&window.fbq)fbq('track','Lead',{content_name:'ליווי אישי'});
    f.hidden=true;f.style.display='none';$('ok').style.display='block';$('ok').focus();
  }).catch(function(){
    clearTimeout(timeout);busy=false;submit.disabled=false;submit.textContent='צרף אותי לצוות החזק בארץ!';
    $('f-e').innerHTML='לא הצלחנו לאשר את השליחה. אפשר לנסות שוב או <a href="https://wa.me/message/AMMTM6HVZVWWD1">לכתוב לנו בוואטסאפ</a>.';
  });
});
})();

