

import { onAuthStateChanged } from 'firebase/auth';
import { createContext,  type ReactNode, useState, useEffect } from 'react'
import { auth } from '../services/firebaseConnection';



interface AuthProviderProps {
    children: ReactNode;

}


type AuthContextData = {
   signed: boolean;
   loadingAuth: boolean;

}

interface UserProps{
    id: string;
    name: string | null;
    email: string | null;
}

   export const AuthContext = createContext({} as AuthContextData)
   
   function AuthProvider({children}: AuthProviderProps) {
       const [user, setUser] = useState <UserProps | null>(null)
       const [loadingAuth, setLoadingAuth] = useState(true)

       useEffect(() =>{

        const unsub = onAuthStateChanged(auth, (user) => {
          if(user){
            setUser({
              id: user.uid,
              name: user?.displayName,
              email: user?.email,
            })

            setLoadingAuth(false)

          }else{
            setUser(null)
            setLoadingAuth(false)
          }
        })

        return () =>{
            unsub()
        }

       })


    return (
        <AuthContext.Provider
         value={{
          signed: !!user,
          loadingAuth,
          
        }}
        >         
        {children}
       </AuthContext.Provider>
 
    )
   }

   export default AuthProvider;
  
 

