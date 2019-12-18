import React, { Component } from 'react';
import Axios from 'axios';
import { APIURL } from '../support/apiurl';
import {Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap'
import {connect} from 'react-redux'

class Studio extends Component {
    state = {
        datastudio:[],
        modaledit:false,
        indexedit:0,
        modaladd:false
    }

    componentDidMount(){
        Axios.get(`${APIURL}studios`)
        .then(res=>{
            this.setState({datastudio:res.data})
        })
    }

    renderStudio=()=>{
        // console.log(this.state.datastudio)
        return this.state.datastudio.map((val,index)=>{
            return(
                <tr>
                    <td>{index+1}.</td>
                    <td>{val.nama}</td>
                    <td>{val.kursi} kursi</td>
                    <td><button className='btn btn-warning' onClick={()=>this.setState({modaledit:true,indexedit:index})}>Edit</button></td>
                </tr>
            )
        })
    }

    renderModaledit=()=>{
        const{datastudio,indexedit}=this.state
        // console.log(this.state.modaledit, this.state.indexedit)
        // console.log(this.state.datastudio[this.state.indexedit].nama)
        return(
            <Modal isOpen={this.state.modaledit} toggle={()=>this.setState({modaledit:false})}>
                <ModalHeader>
                    Edit studio "{datastudio[indexedit].nama}"
                </ModalHeader>
                <ModalBody>
                    <input type='text' defaultValue={datastudio[indexedit].nama} ref='editnama' placeholder='Nama Studio' className='mb-1 form-control' />
                    <input type='text' defaultValue={datastudio[indexedit].kursi} ref='editkursi' placeholder='Jumlah Kursi' className='mb-1 form-control' />
                </ModalBody>
                <ModalFooter>
                    <button className='btn btn-primary' onClick={this.updateclick}>Update</button>
                </ModalFooter>
            </Modal>
        )
    }

    updateclick=()=>{
        var id=this.state.datastudio[this.state.indexedit].id
        var edit={
            nama:this.refs.editnama.value,
            kursi:this.refs.editkursi.value
        }
        Axios.put(`${APIURL}studios/${id}`, edit)
        .then(resupdate=>{
            this.componentDidMount()
            this.setState({modaledit:false})
        }).catch(err=>{
            console.log(err)
        })
    }

    renderModaladd=()=>{
        // const{datastudio,indexedit}=this.state
        // console.log(this.state.modaladd)
        return(
            <Modal isOpen={this.state.modaladd} toggle={()=>this.setState({modaladd:false})}>
                <ModalHeader>
                    Studio Baru
                </ModalHeader>
                <ModalBody>
                    <input type='text' ref='addnama' placeholder='Nama Studio' className='mb-1 form-control' />
                    <input type='text' ref='addkursi' placeholder='Jumlah Kursi' className='mb-1 form-control' />
                </ModalBody>
                <ModalFooter>
                    <button className='btn btn-primary' onClick={this.saveclick}>Save</button>
                </ModalFooter>
            </Modal>
        )
    }

    saveclick=()=>{
        var baru={
            nama:this.refs.addnama.value,
            kursi:this.refs.addkursi.value
        }
        Axios.post(`${APIURL}studios`, baru)
        .then(ressave=>{
            this.componentDidMount()
            this.setState({modaladd:false})
        }).catch(err=>{
            console.log(err)
        })
    }

    render() {
        // const {datastudio,indexedit}=this.state
        // const {length}=datastudio
        // console.log(this.state.datastudio)
        if(this.state.datastudio.length===0){
            return <div>Loading...</div>
        }
        if(this.props.role==='user'||this.props.role===''){
            return <div className='txt-putih'>YOU ARE NOT SUPPOSED TO DO THAT</div>
        }else{
        return (
            <div className='txt-putih pb-3'>
                {this.renderModaledit()}
                {this.renderModaladd()}
                <h4>
                    Manage Studio
                </h4>
                <center>
                    <table className='txt-putih mt-4 mb-4'>
                        <thead className='txt-putih'>
                            <tr>
                                <td style={{width:'50px'}}>No</td>
                                <td style={{width:'150px'}}>Nama Studio</td>
                                <td style={{width:'150px'}}>Jumlah Kursi</td>
                                <td style={{width:'50px'}}>Edit</td>
                            </tr>
                        </thead>
                        <tbody className='txt-putih'>
                            {this.renderStudio()}
                        </tbody>
                    </table>
                    <button className='btn btn-success' onClick={()=>this.setState({modaladd:true})}>Add Studio</button>
                </center>
            </div>
        );
        }
    }
}

const MapstateToprops=(state)=>{
    return{
        role:state.Auth.role
    }
}
 
export default connect(MapstateToprops) (Studio);