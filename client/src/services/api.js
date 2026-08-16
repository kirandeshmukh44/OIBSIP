const API_URL=import.meta.env.VITE_API_URL||"http://localhost:5000/api";
export async function api(path,{token,...options}={}){const res=await fetch(`${API_URL}${path}`,{headers:{"Content-Type":"application/json",...(token?{Authorization:`Bearer ${token}`}:{ }),...options.headers},...options});const data=await res.json().catch(()=>({message:"Unexpected server response"}));if(!res.ok)throw new Error(data.message||"Request failed");return data;}
export const getToken=()=>localStorage.getItem("token");
