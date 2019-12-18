import Axios from "axios"
import { APIURL } from "../../support/apiurl"

export const LoginSuccessAction=(datauser)=>{
    return{
        type:'LOGIN_SUCCESS',
        payload:datauser
    }
}

export const CartAction=(jumlahcart)=>{
    return{
        type:'JUMLAH_CART',
        payload:jumlahcart
    }
}

export const Loginthunk=(username,password)=>{
    return(dispatch)=>{
        dispatch({type:'LOGIN_LOADING'})
        Axios.get(`${APIURL}users?username=${username}&password=${password}`)
        .then(res=>{
            if(res.data.length){
                localStorage.setItem('david', res.data[0].id)
                dispatch(LoginSuccessAction(res.data[0]))
            }else{
                dispatch({type:'LOGIN_ERROR',payload:'Salah masukin Password'})
            }
        }).catch((err)=>{
            console.log(err)
            dispatch({type:'LOGIN_ERROR',payload:'Salah masukin Password'})
        })
    }
}
export const Login_error=()=>{
    return(dispatch)=>{
        dispatch({type:'LOGIN_ERROR',payload:''})
    }
}
export const LogoutSuccessAction=()=>{
    
    return{
        type:'LOGOUT_SUCCESS'
    }
}