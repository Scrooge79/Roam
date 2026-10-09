/** Only display photos explicitly linked by the listing provider. Never substitute unrelated stock imagery. */
export function sourcePhoto(tags:Record<string,string>):string|null{
 const raw=tags.image?.trim();
 if(raw){
  try{const url=new URL(raw);if(url.protocol==="https:"&&["upload.wikimedia.org","commons.wikimedia.org"].includes(url.hostname))return url.href}catch{}
 }
 const commons=tags.wikimedia_commons?.trim();
 if(commons?.startsWith("File:")){
  const filename=commons.slice(5).trim();
  if(filename&&filename.length<200&&!/[?#/\\]/.test(filename))return "https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(filename);
 }
 return null;
}
