import { useState } from "react"
export const useAuth=()=>
{
     
//   const [password,setPassword]=useState<String>("");
//   const [email,setEmail]=useState<String>("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(false);



  const onSubmitAuth= async(email:String,password:String)=>
  { 
     if(!password||!email)
        return;
    setLoading(true);
    setError(false);

    try
    {
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          setLoading(false);
          console.log("response :",response)
          
    }
    catch(Error:any)
    {
      setError(true);
    }



   
    









  }
  return {loading,error,onSubmitAuth}


  
}