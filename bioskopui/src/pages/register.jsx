import React, { Component } from 'react';
import Zoom from 'react-reveal/Zoom'
import Axios from 'axios';
import { APIURL } from '../support/apiurl';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux'


class Register extends Component {
    state = {
        daftuser:[],
        sama:false,
        berhasil:false,
        peringatan:'',
        passconf:false
    }

    onRegister=()=>{
        var userReg=this.refs.username.value
        var passReg=this.refs.password.value
        var passconf=this.refs.passconf.value
        var data={
            username:userReg,
            password:passReg,
            role:'user'
        }
        if(passconf!==passReg){
            this.setState({peringatan:'password confirm harus sama',passconf:true})
        }else{
            Axios.get(`${APIURL}users?username=${userReg}`)
            .then(res=>{
                if(res.data.length){
                    this.setState({peringatan:'username sudah ada, gunakan yang lain :(',sama:true,berhasil:false})
                }else(
                    Axios.post(`${APIURL}users`,data)
                    .then(res=>{
                        this.setState({peringatan:'anda berhasil register :)',berhasil:true,sama:true})
                    }).catch(err=>{
                        console.log(err)
                    })
                )
            }).catch(err=>{
                console.log(err)
            })
        }
    }

    // componentDidMount(){
    //     Axios.get(`${APIURL}users`)
    //     .then(res=>{
    //         this.setState({daftuser:res.data})
    //     }).catch(err=>{
    //         console.log(err)
    //     })
    // }

    render() {
        if(this.props.AuthLog){
            return(
                <div className='txt-putih'>
                    WHAT ARE YOU DOIN?!
                </div>
            )
        }
        return (
            <div className='bg-signin'>
                <Zoom>
                <div className='d-flex tengah-signin'>
                    <div className='kotak-signin mt-5 pt-3 pb-3 px-4'>
                        <h2>Register</h2>
                        <div className='mt-4 mb-4' style={{borderBottom:'1px solid black'}}>
                            <input type='text' className='from-control' style={{border:'transparent', width:'100%'}} ref='username' placeholder='your new username'/>
                        </div>
                        <div className=' mb-2 mb-4' style={{borderBottom:'1px solid black'}}>
                            <input type='text' className='from-control' style={{border:'transparent', width:'100%'}}  ref='password' placeholder='your password' />
                        </div>
                        <div className=' mb-2' style={{borderBottom:'1px solid black'}}>
                            <input type='text' className='from-control' style={{border:'transparent', width:'100%'}}  ref='passconf' placeholder='confirm password' />
                        </div>
                        {this.state.sama?
                            <div className="alert alert-danger mt-2">
                                {this.state.peringatan} <span onClick={()=>this.setState({peringatan:'',sama:false})} className='float-right font-weight-bold'><div>x</div></span>
                            </div>
                        :null}
                        {this.state.passconf?
                            <div className="alert alert-danger mt-2">
                                {this.state.peringatan} <span onClick={()=>this.setState({peringatan:'',passconf:false})} className='float-right font-weight-bold'><div>x</div></span>
                            </div>
                        :null}
                        <button className='btn btn-primary mt-3'onClick={this.onRegister}>Register it</button>
                        {this.state.berhasil?
                            <p className='mt-3'>Mari <Link to={'/login'}>Log-in</Link></p>
                        :null}
                    </div>
                </div>
                </Zoom>
            </div>
        );
    }
}

const MapstateToprops=(state)=>{
    return{
        AuthLog:state.Auth.login
    }
}
 
export default connect(MapstateToprops) (Register);