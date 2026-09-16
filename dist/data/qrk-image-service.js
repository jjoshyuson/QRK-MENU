const DB_NAME='qrk-original-images';
const STORE_NAME='originals';
const MAX_EDGE=960;
const TARGET_BYTES=160*1024;
const CARD_EDGE=480;
const CARD_TARGET_BYTES=72*1024;

const canvasBlob=(canvas,type,quality)=>new Promise(resolve=>canvas.toBlob(resolve,type,quality));
const toDataUrl=blob=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(blob)});
const originalId=()=>globalThis.crypto?.randomUUID?.()||`photo-${Date.now()}-${Math.random().toString(16).slice(2)}`;

function openOriginals(){
 return new Promise((resolve,reject)=>{const request=indexedDB.open(DB_NAME,1);request.onupgradeneeded=()=>request.result.createObjectStore(STORE_NAME);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)});
}

export async function preserveOriginalImage(blob,id=originalId()){
 try{const db=await openOriginals();await new Promise((resolve,reject)=>{const transaction=db.transaction(STORE_NAME,'readwrite');transaction.objectStore(STORE_NAME).put(blob,id);transaction.oncomplete=resolve;transaction.onerror=()=>reject(transaction.error)});db.close();return id}catch{return''}
}

export async function optimizeMenuImage(blob,{maxEdge=MAX_EDGE,targetBytes=TARGET_BYTES}={}){
 const bitmap=await createImageBitmap(blob),scale=Math.min(1,maxEdge/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');
 canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close?.();
 let quality=.78,output=await canvasBlob(canvas,'image/webp',quality);
 while(output&&output.size>targetBytes&&quality>.5){quality-=.08;output=await canvasBlob(canvas,'image/webp',quality)}
 if(!output)throw new Error('This browser could not optimize the image.');
 return{dataUrl:await toDataUrl(output),width:canvas.width,height:canvas.height,bytes:output.size};
}

export async function prepareMenuPhoto(file){
 if(!file||!/^image\/(jpeg|png|webp|avif)$/i.test(file.type))throw new Error('Choose a JPG, PNG, WebP or AVIF image.');
 if(file.size>5*1024*1024)throw new Error('Choose an image smaller than 5 MB.');
 const originalKey=await preserveOriginalImage(file),[optimized,card]=await Promise.all([optimizeMenuImage(file),optimizeMenuImage(file,{maxEdge:CARD_EDGE,targetBytes:CARD_TARGET_BYTES})]);
 return{photo:optimized.dataUrl,photoCard:card.dataUrl,photoOriginalKey:originalKey,photoOptimized:true,photoWidth:optimized.width,photoHeight:optimized.height,photoBytes:optimized.bytes,photoCardWidth:card.width,photoCardHeight:card.height,photoCardBytes:card.bytes};
}

export async function optimizeLegacyMenuPhotos(items){
 let changed=false;const next=[];
 for(const item of items){
  if(!item.photo?.startsWith('data:image/')||item.photoOptimized&&item.photoCard){next.push(item);continue}
  try{const original=await fetch(item.photo).then(response=>response.blob());if(item.photoOptimized){const card=await optimizeMenuImage(original,{maxEdge:CARD_EDGE,targetBytes:CARD_TARGET_BYTES});next.push({...item,photoCard:card.dataUrl,photoCardWidth:card.width,photoCardHeight:card.height,photoCardBytes:card.bytes})}else{const prepared=await prepareMenuPhoto(original);next.push({...item,...prepared})}changed=true}catch{next.push(item)}
 }
 return{items:next,changed};
}
