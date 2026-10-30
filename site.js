'use strict';
const range=document.getElementById('raw-range');
let demoPump=false;
function renderDemo(){
  const raw=Number(range.value),level=Math.max(0,Math.min(100,raw*100/503));
  if(level<=20)demoPump=true;
  else if(level>=80)demoPump=false;
  document.getElementById('adc-readout').textContent=raw;
  document.getElementById('level-readout').innerHTML=Math.round(level)+'<span>%</span>';
  document.getElementById('pump-status').textContent=demoPump?'LIGADA':'DESLIGADA';
  document.getElementById('pump-dot').classList.toggle('on',demoPump);
  const y=338-level*2.53;
  document.getElementById('liquid-surface').setAttribute('cy',y);
  document.getElementById('liquid-body').setAttribute('d',`M115 ${y}Q220 ${y+58} 325 ${y}V340C325 380 115 380 115 340Z`);
  document.getElementById('tank-art').setAttribute('aria-label',`Reservatório ilustrado: ${Math.round(level)}%, simulação`);
  const payload={sensor_type:'POT',raw,level_pct:Number(level.toFixed(2)),pump:demoPump,mode:'AUTO'};
  document.getElementById('telemetry-code').textContent=JSON.stringify(payload,null,2);
  range.setAttribute('aria-valuetext',`${raw} ADC, ${Math.round(level)} por cento, bomba ${demoPump?'ligada':'desligada'}`);
}
range.addEventListener('input',renderDemo);
document.querySelectorAll('[data-raw]').forEach(button=>button.addEventListener('click',()=>{range.value=button.dataset.raw;renderDemo()}));
renderDemo();

const themes={
  aero:{src:'docs/images/painel-desktop.png',name:'Frutiger Aero'},
  alya:{src:'docs/images/tema-alya.png',name:'Alya Kujou'},
  corinthians:{src:'docs/images/tema-corinthians.png',name:'Corinthians'}
};
const tabs=[...document.querySelectorAll('[data-theme]')];
const gallery=document.getElementById('gallery-image');
function selectTheme(tab){
  const theme=themes[tab.dataset.theme];
  tabs.forEach(other=>{const active=other===tab;other.setAttribute('aria-selected',String(active));other.tabIndex=active?0:-1});
  gallery.src=theme.src;
  gallery.alt=`Painel Alya Aero no tema ${theme.name}, exibindo tanque e curva de nível em simulação`;
  document.getElementById('gallery-panel').setAttribute('aria-labelledby',tab.id);
}
tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>selectTheme(tab));
  tab.addEventListener('keydown',event=>{
    let target;
    if(event.key==='ArrowRight')target=tabs[(index+1)%tabs.length];
    if(event.key==='ArrowLeft')target=tabs[(index+tabs.length-1)%tabs.length];
    if(event.key==='Home')target=tabs[0];
    if(event.key==='End')target=tabs.at(-1);
    if(target){event.preventDefault();selectTheme(target);target.focus()}
  });
});
const dialog=document.getElementById('image-dialog');
document.getElementById('expand-gallery').addEventListener('click',()=>{
  const expanded=document.getElementById('expanded-image');expanded.src=gallery.src;expanded.alt=gallery.alt;dialog.showModal();
});
document.getElementById('close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close()}});
