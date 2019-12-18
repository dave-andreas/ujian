const INITIAL_STATE={
    id:'',
    username:'',
    password:'',
    role:'',
    login:false,
    error:'',
    loading:false,
    jumlahcart:0
}
export default (state=INITIAL_STATE,action)=>{
    switch (action.type){
        case 'LOGIN_SUCCESS':
            return {...state,...action.payload,login:true}
        case 'JUMLAH_CART':
            return {...state,jumlahcart:action.payload}
        case 'LOGIN_LOADING':
            return {...state,loading:true,error:''}
        case 'LOGIN_ERROR':
                return {...state,loading:false,error:action.payload}
        case 'LOGOUT_SUCCESS':
            return INITIAL_STATE
        default:
            return state
    }
}