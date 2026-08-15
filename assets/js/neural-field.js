(()=>{
  const root=document.querySelector('#neuralFieldLab');
  if(!root)return;
  if(typeof tf==='undefined'){
    const s=document.querySelector('#neuralStatus');
    if(s)s.textContent='TensorFlow.js failed to load.';
    return;
  }

  const N=12,D=12,CLASSES=['LEFT','RIGHT','ABOVE','BELOW'];
  const q=s=>root.querySelector(s);
  const canvas=q('#neuralCanvas');
  const ctx=canvas.getContext('2d');
  canvas.width=N; canvas.height=N;

  let model=null,layers=null,currentExample=null,currentTrace=[],currentProbs=null;

  function setStatus(text,kind='ready'){
    q('#neuralStatus').innerHTML=`<span class="status-dot ${kind}"></span>${text}`;
  }
  function log(text){
    const box=q('#trainingLog');
    box.textContent+=`${text}\n`;
    box.scrollTop=box.scrollHeight;
  }
  function clearLog(){q('#trainingLog').textContent='';}

  function makeModel(steps=6){
    if(model)model.dispose();
    const input=tf.input({shape:[N,N,2],name:'field_input'});
    const writer=tf.layers.conv2d({filters:D,kernelSize:1,padding:'same',activation:'tanh',name:'writer'});
    const local=tf.layers.conv2d({filters:D,kernelSize:3,padding:'same',activation:'relu',name:'shared_local'});
    const delta=tf.layers.conv2d({filters:D,kernelSize:1,padding:'same',activation:'tanh',name:'shared_update'});
    const readout=tf.layers.dense({units:4,activation:'softmax',name:'readout'});

    let state=writer.apply(input);
    for(let t=0;t<steps;t++){
      const proposal=delta.apply(local.apply(state));
      state=tf.layers.activation({activation:'tanh',name:`state_t${t+1}`}).apply(tf.layers.add().apply([state,proposal]));
    }
    const pooled=tf.layers.globalMaxPooling2d().apply(state);
    const output=readout.apply(pooled);
    model=tf.model({inputs:input,outputs:output,name:'mpf_relational_demo'});
    model.compile({optimizer:tf.train.adam(0.003),loss:'categoricalCrossentropy',metrics:['accuracy']});
    layers={writer,local,delta,readout,steps};
    q('#paramCount').textContent=model.countParams().toLocaleString();
    q('#stepCountNeural').textContent=steps;
    return model;
  }

  function sample(direction,minDist,maxDist){
    const dist=minDist+Math.floor(Math.random()*(maxDist-minDist+1));
    let ax,ay,bx,by;
    if(direction===0){
      ax=dist+Math.floor(Math.random()*(N-dist)); ay=Math.floor(Math.random()*N); bx=ax-dist; by=ay;
    }else if(direction===1){
      ax=Math.floor(Math.random()*(N-dist)); ay=Math.floor(Math.random()*N); bx=ax+dist; by=ay;
    }else if(direction===2){
      ax=Math.floor(Math.random()*N); ay=dist+Math.floor(Math.random()*(N-dist)); bx=ax; by=ay-dist;
    }else{
      ax=Math.floor(Math.random()*N); ay=Math.floor(Math.random()*(N-dist)); bx=ax; by=ay+dist;
    }
    const x=new Float32Array(N*N*2);
    x[(ay*N+ax)*2]=1;
    x[(by*N+bx)*2+1]=1;
    return {x,label:direction,a:{x:ax,y:ay},b:{x:bx,y:by},dist};
  }

  function dataset(count,minDist,maxDist){
    const xs=new Float32Array(count*N*N*2);
    const ys=new Float32Array(count*4);
    const examples=[];
    for(let i=0;i<count;i++){
      const ex=sample(Math.floor(Math.random()*4),minDist,maxDist);
      xs.set(ex.x,i*N*N*2); ys[i*4+ex.label]=1; examples.push(ex);
    }
    return {x:tf.tensor4d(xs,[count,N,N,2]),y:tf.tensor2d(ys,[count,4]),examples};
  }

  async function evaluateRange(minDist,maxDist,count=128){
    const data=dataset(count,minDist,maxDist);
    const evalOut=model.evaluate(data.x,data.y,{batchSize:32});
    const tensors=Array.isArray(evalOut)?evalOut:[evalOut];
    const vals=await Promise.all(tensors.map(t=>t.data()));
    tensors.forEach(t=>t.dispose()); data.x.dispose(); data.y.dispose();
    return {loss:vals[0][0],acc:vals[1]?vals[1][0]:NaN};
  }

  function permuteState(state){
    return tf.tidy(()=>{
      const perm=[]; for(let i=0;i<N*N;i++)perm.push(i);
      for(let i=perm.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[perm[i],perm[j]]=[perm[j],perm[i]];}
      const flat=state.reshape([N*N,D]);
      return tf.gather(flat,perm).reshape([1,N,N,D]);
    });
  }

  async function traceExample(ex,shuffle=false){
    currentTrace.forEach(t=>t.dispose&&t.dispose()); currentTrace=[];
    if(currentProbs){currentProbs.dispose();currentProbs=null;}
    const input=tf.tensor4d(ex.x,[1,N,N,2]);
    let state=layers.writer.apply(input);
    currentTrace.push(state.clone());
    for(let t=0;t<layers.steps;t++){
      let source=state;
      if(shuffle){const p=permuteState(state);state.dispose();state=p;source=state;}
      const next=tf.tidy(()=>tf.tanh(source.add(layers.delta.apply(layers.local.apply(source)))));
      state.dispose(); state=next;
      currentTrace.push(state.clone());
    }
    const pooled=state.max([1,2]);
    currentProbs=layers.readout.apply(pooled);
    const probs=await currentProbs.data();
    input.dispose(); pooled.dispose(); state.dispose();
    return Array.from(probs);
  }

  async function renderTrace(index){
    if(!currentTrace.length)return;
    const step=Math.max(0,Math.min(currentTrace.length-1,index));
    const data=await currentTrace[step].data();
    const image=ctx.createImageData(N,N);
    for(let i=0;i<N*N;i++){
      const k=i*D;
      const r=(Math.tanh(data[k])*0.5+0.5)*255;
      const g=(Math.tanh(data[k+1])*0.5+0.5)*255;
      const b=(Math.tanh(data[k+2])*0.5+0.5)*255;
      image.data[i*4]=r; image.data[i*4+1]=g; image.data[i*4+2]=b; image.data[i*4+3]=255;
    }
    ctx.putImageData(image,0,0);
    if(currentExample){
      ctx.strokeStyle='#ffffff';ctx.lineWidth=.16;ctx.strokeRect(currentExample.a.x+.08,currentExample.a.y+.08,.84,.84);
      ctx.strokeStyle='#ffe06a';ctx.strokeRect(currentExample.b.x+.08,currentExample.b.y+.08,.84,.84);
    }
    q('#traceStep').textContent=step;
  }

  function updateScores(probs){
    let best=0;
    probs.forEach((p,i)=>{q(`#score${i}`).textContent=`${CLASSES[i]} ${(p*100).toFixed(1)}%`;if(p>probs[best])best=i;});
    q('#prediction').textContent=CLASSES[best];
    q('#truth').textContent=CLASSES[currentExample.label];
    q('#prediction').style.color=best===currentExample.label?'#166447':'#9a572d';
  }

  async function newExample(){
    const far=q('#farExample').checked;
    currentExample=sample(Math.floor(Math.random()*4),far?5:2,far?8:4);
    const probs=await traceExample(currentExample,q('#neuralShuffle').checked);
    updateScores(probs);
    q('#distanceReadout').textContent=currentExample.dist;
    q('#traceSlider').max=layers.steps;
    q('#traceSlider').value=layers.steps;
    await renderTrace(layers.steps);
  }

  async function train(){
    q('#trainBtn').disabled=true; q('#newExampleBtn').disabled=true;
    clearLog(); setStatus('training in your browser','busy');
    const epochs=+q('#epochs').value;
    const trainData=dataset(640,2,4);
    const started=performance.now();
    try{
      await model.fit(trainData.x,trainData.y,{epochs,batchSize:32,shuffle:true,callbacks:{
        onEpochEnd:async(epoch,logs)=>{
          const acc=logs.acc??logs.accuracy??0;
          q('#trainLoss').textContent=(logs.loss??0).toFixed(3);
          q('#trainAcc').textContent=`${(acc*100).toFixed(1)}%`;
          q('#trainProgress').style.width=`${((epoch+1)/epochs)*100}%`;
          if(epoch===0||(epoch+1)%5===0||epoch===epochs-1)log(`epoch ${String(epoch+1).padStart(2,'0')}  loss ${(logs.loss??0).toFixed(3)}  acc ${(acc*100).toFixed(1)}%`);
          await tf.nextFrame();
        }
      }});
      const near=await evaluateRange(2,4,128);
      const far=await evaluateRange(5,8,128);
      q('#nearAcc').textContent=`${(near.acc*100).toFixed(1)}%`;
      q('#farAcc').textContent=`${(far.acc*100).toFixed(1)}%`;
      q('#trainTime').textContent=`${((performance.now()-started)/1000).toFixed(1)} s`;
      log(`near-distance test: ${(near.acc*100).toFixed(1)}%`);
      log(`longer-distance test: ${(far.acc*100).toFixed(1)}%`);
      setStatus('trained · inspect a fresh problem','ready');
      await newExample();
    }catch(err){
      console.error(err);log(`error: ${err.message}`);setStatus('training error — see log','error');
    }finally{
      trainData.x.dispose();trainData.y.dispose();
      q('#trainBtn').disabled=false;q('#newExampleBtn').disabled=false;
    }
  }

  q('#trainBtn').addEventListener('click',train);
  q('#newExampleBtn').addEventListener('click',newExample);
  q('#resetNeuralBtn').addEventListener('click',async()=>{makeModel(+q('#recurrentSteps').value);q('#trainProgress').style.width='0';q('#nearAcc').textContent='—';q('#farAcc').textContent='—';q('#trainAcc').textContent='—';q('#trainLoss').textContent='—';clearLog();setStatus('new random weights','ready');await newExample();});
  q('#traceSlider').addEventListener('input',e=>renderTrace(+e.target.value));
  q('#neuralShuffle').addEventListener('change',newExample);
  q('#farExample').addEventListener('change',newExample);
  q('#epochs').addEventListener('input',e=>q('[data-value="epochs"]').textContent=e.target.value);
  q('#recurrentSteps').addEventListener('input',e=>q('[data-value="recurrentSteps"]').textContent=e.target.value);
  q('#recurrentSteps').addEventListener('change',async e=>{makeModel(+e.target.value);clearLog();setStatus('architecture rebuilt with new recurrence depth','ready');await newExample();});

  tf.ready().then(async()=>{
    q('#backend').textContent=tf.getBackend();
    makeModel(+q('#recurrentSteps').value);
    setStatus('ready · random weights','ready');
    await newExample();
  });
})();
