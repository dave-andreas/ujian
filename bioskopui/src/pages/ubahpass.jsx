import React, { Component } from 'react';
import {connect} from 'react-redux'
import Zoom from 'react-reveal/Zoom'
import {Link,Redirect} from 'react-router-dom'
import Axios from 'axios';
import { APIURL } from '../support/apiurl';

class Ubahpass extends Component {
    state = {
        alert:false,
        peringatan:'',
        success:false
    }

    onubah=()=>{
        var lama=this.refs.passlama.value
        var baru=this.refs.passbaru.value
        var id=this.props.id
        if(lama!==this.props.password){
            this.setState({peringatan:'Password lama yang anda masukan tidak sama', alert:true})
        }else{
            if(lama===baru){
                this.setState({peringatan:'Kalo sama ngapain diubah dah', alert:true})
            }else{
                var newdata={
                    username:this.props.username,
                    password:baru,
                    role:this.props.role
                }
                Axios.put(`${APIURL}users/${id}`, newdata)
                .then(res=>{
                    console.log(res.data)
                }).catch(err=>{
                    console.log(err)
                })
                this.setState({peringatan:'Password baru telah tersimpan', success:true})
            }
        }
    }

    render() {
        if(this.props.username===''){
            return(
                <div className='txt-putih'>
                    HEEMMMMMMMM
                </div>
            )
        }
        return (
            <div className='bg-signin'>
                <Zoom>
                <div className='d-flex tengah-signin'>
                    <div className='kotak-signin mt-5 pt-3 pb-3 px-4'>
                        <h3>Ubah password "{this.props.username}"</h3>
                        <div className='mt-4 mb-4' style={{borderBottom:'1px solid black'}}>
                            <input type='text' className='from-control' style={{border:'transparent', width:'100%'}} ref='passlama' placeholder='Masukan Password Lama'/>
                        </div>
                        <div className=' mb-3' style={{borderBottom:'1px solid black'}}>
                            <input type='text' className='from-control' style={{border:'transparent', width:'100%'}}  ref='passbaru' placeholder='Masukan Password baru' />
                        </div>
                        {this.state.alert?
                            <div className="alert alert-danger mt-3">
                                {this.state.peringatan} <span onClick={()=>this.setState({peringatan:'',alert:false})} className='float-right font-weight-bold'><div>x</div></span>
                            </div>
                        :null}
                        {this.state.success?
                            <div className="alert alert-primary mt-3">
                                {this.state.peringatan} <span onClick={()=>this.setState({peringatan:'',success:false})} className='float-right font-weight-bold'><div>x</div></span>
                            </div>
                        :null}
                        <button className='btn btn-primary mt-3'onClick={this.onubah}>Ubah!!</button>
                    </div>
                </div>
                </Zoom>
            </div>
        );
    }
}

const MapstateToprops=(state)=>{
    return{
        username:state.Auth.username,
        password:state.Auth.password,
        role:state.Auth.role,
        id:state.Auth.id,
    }
}
export default connect(MapstateToprops) (Ubahpass);