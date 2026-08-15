(()=>{
  const q=s=>document.querySelector(s);
  const canvas=q('#fieldCanvas');
  if(!canvas)return;

  const ctx=canvas.getContext('2d');
  const N=32,D=8;
  canvas.width=N;
  canvas.height=N;

  let state,buffer,step=0,running=false,timer=null,history=[];
  const rand=()=>Math.random()*2-1;

  function fresh(){
    state=new Float32Array(N*N*D);
    buffer=new Float32Array(state.length);
    for(let i=0;i<state.length;i++)state[i]=rand()*.35;
    for(let y=12;y<20;y++)for(let x=12;x<20;x++){
      const k=(y*N+x)*D;
      state[k]+=1;
      state[k+1]-=.6;
      state[k+2]+=.4;
    }
    step=0;
    history=[];
    render();
    metrics();
  }

  function idx(x,y,d){
    x=(x+N)%N;
    y=(y+N)%N;
    return(y*N+x)*D+d;
  }

  function regionMean(x,y,d,size=4){
    const sx=Math.floor(x/size)*size;
    const sy=Math.floor(y/size)*size;
    let sum=0;
    for(let yy=0;yy<size;yy++)for(let xx=0;xx<size;xx++)sum+=state[idx(sx+xx,sy+yy,d)];
    return sum/(size*size);
  }

  function shuffledCells(){
    const p=Array.from({length:N*N},(_,i)=>i);
    for(let i=p.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [p[i],p[j]]=[p[j],p[i]];
    }
    return p;
  }

  function evolve(){
    const alpha=+q('#coupling').value;
    const beta=+q('#memory').value;
    const useHierarchy=q('#hierarchy').checked;
    const shuffle=q('#shuffle').checked;
    const permutation=shuffle?shuffledCells():null;

    for(let y=0;y<N;y++)for(let x=0;x<N;x++){
      const dest=y*N+x;
      const src=permutation?permutation[dest]:dest;
      const srcX=src%N;
      const srcY=Math.floor(src/N);

      for(let d=0;d<D;d++){
        const k=idx(x,y,d);
        const self=state[idx(srcX,srcY,d)];
        let local=0;
        for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++)local+=state[idx(srcX+ox,srcY+oy,d)];
        local/=9;
        const h=useHierarchy?regionMean(srcX,srcY,d):local;
        const cross=state[idx(srcX,srcY,(d+1)%D)]-state[idx(srcX,srcY,(d+D-1)%D)];
        const update=Math.tanh(local*alpha+h*.18+cross*.12);
        buffer[k]=Math.max(-2,Math.min(2,self*beta+update*(1-beta)));
      }
    }

    [state,buffer]=[buffer,state];
    step++;
    render();
    metrics();
  }

  function render(){
    const image=ctx.createImageData(N,N);
    for(let i=0;i<N*N;i++){
      const k=i*D;
      const r=1/(1+Math.exp(-(state[k]*1.4+state[k+3]*.5)));
      const g=1/(1+Math.exp(-(state[k+1]*1.4-state[k+4]*.35)));
      const b=1/(1+Math.exp(-(state[k+2]*1.4+state[k+5]*.45)));
      image.data[i*4]=Math.floor(r*255);
      image.data[i*4+1]=Math.floor(g*255);
      image.data[i*4+2]=Math.floor(b*255);
      image.data[i*4+3]=255;
    }
    ctx.putImageData(image,0,0);
    q('#stepCount').textContent=step;
  }

  function metrics(){
    let energy=0;
    for(const v of state)energy+=v*v;
    energy=Math.sqrt(energy/state.length);

    let coherence=0,count=0;
    for(let y=0;y<N;y++)for(let x=0;x<N;x++)for(let d=0;d<3;d++){
      coherence+=Math.abs(state[idx(x,y,d)]-state[idx(x+1,y,d)]);
      count++;
    }
    coherence=1-Math.min(1,coherence/count);

    let qsum=0;
    for(let i=0;i<N*N;i++){
      const k=i*D;
      let m=0;
      for(let d=0;d<D;d++)m+=Math.abs(state[k+d]);
      qsum+=m/D;
    }
    const occupancy=Math.min(1,qsum/(N*N));

    q('#coherence').textContent=coherence.toFixed(3);
    q('#energy').textContent=energy.toFixed(3);
    q('#occupancy').textContent=(occupancy*100).toFixed(1)+'%';

    const prev=history.at(-1);
    const stability=prev==null?0:1-Math.min(1,Math.abs(prev-energy)*8);
    q('#stability').textContent=stability.toFixed(3);
    history.push(energy);
    if(history.length>100)history.shift();
  }

  function run(){
    running=!running;
    q('#runBtn').textContent=running?'Pause':'Run';
    if(running)timer=setInterval(evolve,90);
    else clearInterval(timer);
  }

  q('#runBtn').addEventListener('click',run);
  q('#stepBtn').addEventListener('click',evolve);
  q('#resetBtn').addEventListener('click',()=>{if(running)run();fresh();});
  q('#damageBtn').addEventListener('click',()=>{
    for(let y=10;y<18;y++)for(let x=10;x<18;x++)for(let d=0;d<D;d++)state[idx(x,y,d)]=0;
    render();
    metrics();
  });
  q('#exportBtn').addEventListener('click',()=>{
    const payload={
      timestamp:new Date().toISOString(),
      grid:[N,N],
      dimensions:D,
      steps:step,
      settings:{
        coupling:+q('#coupling').value,
        memory:+q('#memory').value,
        hierarchy:q('#hierarchy').checked,
        shuffle:q('#shuffle').checked
      },
      metrics:{
        coherence:q('#coherence').textContent,
        energy:q('#energy').textContent,
        occupancy:q('#occupancy').textContent,
        stability:q('#stability').textContent
      },
      note:'Toy MPF dynamics demonstrator; not a trained neural reasoning result.'
    };
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=`mpf-run-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  document.querySelectorAll('input[type=range]').forEach(el=>el.addEventListener('input',()=>{
    const out=document.querySelector(`[data-value="${el.id}"]`);
    if(out)out.textContent=el.value;
  }));

  fresh();
})();