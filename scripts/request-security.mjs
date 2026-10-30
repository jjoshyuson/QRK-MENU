import {isIP} from 'node:net';

export class RequestError extends Error {
  constructor(status,message){super(message);this.status=status}
}

// Browser origins are not local operator authority. Reject rebinding hosts and
// cross-origin API requests before touching credentials, tables or integrations.
export function validateRequest(req,{host}) {
  let target;
  try{target=new URL(`http://${req.headers.host}`)}catch{throw new RequestError(403,'Invalid request host')}
  const hostname=target.hostname.replace(/^\[|\]$/g,''),port=Number(target.port||80);
  const local=['localhost','127.0.0.1','::1'].includes(hostname);
  const bound=hostname===host;
  const lan=['0.0.0.0','::'].includes(host)&&Boolean(isIP(hostname));
  if(!req.headers.host||target.username||target.password||target.pathname!=='/'||target.search||target.hash||port!==req.socket.localPort||(!local&&!bound&&!lan))throw new RequestError(403,'Untrusted request host');
  const pathname=decodeURIComponent(new URL(req.url,'http://local.invalid').pathname);
  if(!pathname.startsWith('/__qrk/'))return pathname;
  const origin=req.headers.origin;
  if(origin!==undefined&&origin!==target.origin)throw new RequestError(403,'Cross-origin API requests are not allowed');
  if(['cross-site','same-site'].includes(req.headers['sec-fetch-site']))throw new RequestError(403,'Cross-origin API requests are not allowed');
  return pathname;
}

export async function readJson(req) {
  if(!/^application\/json(?:\s*;|\s*$)/i.test(req.headers['content-type']||''))throw new RequestError(415,'Use application/json');
  const limit=100000;
  if(Number(req.headers['content-length'])>limit){req.resume();throw new RequestError(413,'Request too large')}
  const chunks=[];let size=0;
  for await(const chunk of req){size+=chunk.length;if(size>limit){req.resume();throw new RequestError(413,'Request too large')}chunks.push(chunk)}
  let input;
  try{input=JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{throw new RequestError(400,'Invalid JSON')}
  if(!input||typeof input!=='object'||Array.isArray(input))throw new RequestError(400,'A JSON object is required');
  return input;
}
