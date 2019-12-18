import React, { Component } from 'react';
import Axios from 'axios';
import { APIURL } from '../support/apiurl';
import {Link,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {LoginSuccessAction,Loginthunk,Login_error,CartAction} from './../redux/action'
import Zoom from 'react-reveal/Zoom'
// import {Loader} from 'react-loader-spinner'


class Login extends Component {
    state = {
        // login:false,
        error:'',
        loading:false
    }

    loginClick=()=>{
        var username=this.refs.username.value
        var password=this.refs.password.value
        this.setState({loading:true})
        Axios.get(`${APIURL}users?username=${username}&password=${password}`)//nanti bisa diganti dengan menjalankan fn dari actio
        .then(res=>{
            if(res.data.length){
                localStorage.setItem('david', res.data[0].id)
                this.props.LoginSuccessAction(res.data[0])
                Axios.get(`${APIURL}orders?userId=${res.data[0].id}&bayar=false`)
                .then(res1=>{
                    this.props.CartAction(res1.data.length)
                }).catch(err=>{
                    console.log(err)
                })
            }else{
                this.setState({error:`di sini tidak ada yang namanya "${username}", kalo mau daftar dulu gih`})
            }
            this.setState({loading:false})
        }).catch((err)=>{
            console.log(err)
            this.setState({loading:false})
        })
    }

    render() {
        if(this.props.AuthLog){
            return <Redirect to={''}/>
        }
        return (
            <div className='bg-signin'>
                <Zoom>
                <div className='d-flex tengah-signin'>
                    <div className='kotak-signin mt-5 pt-3 pb-3 px-4'>
                        <h2>Log-in</h2>
                        <div className='mt-4 mb-4' style={{borderBottom:'1px solid black'}}>
                            <input type='text' className='from-control' style={{border:'transparent', width:'100%'}} ref='username' placeholder='username'/>
                        </div>
                        <div className=' mb-2' style={{borderBottom:'1px solid black'}}>
                            <input type='text' className='from-control' style={{border:'transparent', width:'100%'}}  ref='password' placeholder='password' />
                        </div>
                        {
                            this.state.error===''?
                            null
                            :
                            <div className="alert alert-danger mt-2">
                                {this.state.error} <span onClick={()=>this.setState({error:''})} className='float-right font-weight-bold'>x</span>
                            </div>
                        }
                        <div>
                            {this.state.loading?
                                // <Loader type="Circles" color="#ff7315r" height={80} width={80}/
                                <p className='mt-4'>checking ...</p>
                            :
                                <button className='btn btn-primary mt-4' onClick={this.loginClick}>Login</button>
                            }
                        </div>
                        <div className='mt-3'>
                            User baru? Silahkan <Link to='/register'>register</Link>.
                        </div>
                    </div>
                </div>
                </Zoom>
            </div>
        );
    }
}

const MapstateToprops=(state)=>{
    return{
        AuthLog:state.Auth.login,
        Auth:state.Auth
    }
}

export default connect(MapstateToprops,{LoginSuccessAction,Loginthunk,Login_error,CartAction}) (Login);