import React, { Component } from 'react';
import Axios from 'axios'
import {Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap'
import {Link,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Zoom from 'react-reveal/Zoom'

const url='http://localhost:1001/'

class Home extends Component {
    state = {
        dataMovies:[],
        modalada:false,
        modal:{},
        belitiket:false,
        modalAuth:false
    }
    componentDidMount=()=>{
        Axios.get(`${url}movies`)
        .then((res)=>{
            this.setState({dataMovies:res.data})
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    onClickCard=(index)=>{
        this.setState({
            modalada:true,
            modal:this.state.dataMovies[index]
        })
        // console.log(this.state.dataMovies[index].id)
    }
    // onClickGetTicket=()=>{
    //     console.log(this.props.AuthLog)
    //     if(this.props.AuthLog){
    //         this.setState.belitiket=true
    //         console.log('masuk ke page beli')
    //     }else{
    //         this.setState.modalAuth=true
    //         console.log('masuk modal ke 2')
    //     }
    // }
    renderMovies=()=>{
        console.log(this.props.AuthLog)
        return this.state.dataMovies.map((val,index)=>{
            return (
                <Zoom right>
                <div key={index} className="col-md-3 py-5 pr-3 pl-1y lengkung" >
                    <div className="card" style={{width: '100%'}}>
                        <div className="batas lengkung">
                            <img src={val.image} onClick={()=>this.onClickCard(index)} className="card-img-top gambar" alt="..." />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">
                                <Link to={'/moviedetil/'+val.id}>
                                    {val.title}
                                </Link>
                            </h5>
                        </div>
                    </div>
                </div>
                </Zoom>
            )
        })
    }
    render() {
        if(this.state.belitiket&&this.props.AuthLog){
            return <Redirect to={{pathname:'/belitiket', state:this.state.modal}}/>
        }
        return (
            <div className='mt-2 mx-5'>
                <div className="row">
                    {this.renderMovies()}
                </div>
                <Modal isOpen={this.state.modalada} size='lg' toggle={()=>this.setState({modalada:false})} zIndex='500' scrollable={this.state.modalada}>
                    <ModalHeader>
                        {this.state.modal.title}
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <iframe width="100%" height="450" src={this.state.modal.trailer} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                        <div className='inModalFlex'>
                            <div className='mb-1'>
                                Genre : {this.state.modal.genre}<br/>
                                Sutradara : {this.state.modal.sutradara}<br/>
                                Produksi : {this.state.modal.produksi}
                            </div>
                            <div className='ml-auto'>
                                {this.state.modal.durasi} menit
                            </div>
                        </div><br/>
                        Sinopsis : <br/>
                        {this.state.modal.sinopsis}
                    </ModalBody>
                    <ModalFooter>
                        {this.props.role==='user'?
                            <button className='btn btn-primary' onClick={()=>this.setState({modalAuth:true,belitiket:true})}>Get Ticket</button>
                        :null}
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.modalAuth} toggle={()=>this.setState({modalAuth:false})} zIndex='1000'>
                    <ModalBody>Anda belum Log-in, silahkan Login dulu</ModalBody>
                    <ModalFooter>
                        
                        <Link to={'/login'}>
                            <button className='btn btn-primary'>Log-in</button>
                        </Link>
                        <button className='btn btn-warning' onClick={()=>this.setState({modalAuth:false})}>Cancle</button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

const MapstateToprops=(state)=>{
    return{
        AuthLog:state.Auth.login,
        role:state.Auth.role
    }
}
export default connect(MapstateToprops) (Home);