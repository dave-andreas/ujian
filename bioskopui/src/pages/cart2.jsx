import React, { Component } from 'react';
import Axios from 'axios'
import {connect} from 'react-redux'
import {Table,ModalHeader,ModalBody,ModalFooter} from 'reactstrap'
import {APIURL} from './../support/ApiUrl'



class Cart extends Component {
    state = {
        datacart:null
    }

    componentDidMount(){
        Axios.get(`${APIURL}orders?_expand=movie&userId=${this.props.UserId}&bayar=false`)
        .then((res)=>{
            var datacart=res.data
            var qtyarr=[]
            console.log(res.data)
            res.data.forEach(element => {
                qtyarr.push(Axios.get(`${APIURL}ordersDetails?orderId=${element.id}`))
            });
            var qtyarrfinal=[]
            console.log(qtyarr)
            Axios.all(qtyarr)
            .then((res1)=>{
                res1.forEach((val)=>{
                    qtyarrfinal.push(val.data)
                })
                console.log(qtyarrfinal)
                var datafinal=[]
                datacart.forEach((val,index)=>{
                    datafinal.push({...val,qty:qtyarrfinal[index]})
                })
                console.log(datafinal)
                this.setState({
                    datacart:datafinal
                })
            }).catch((err)=>{

            })
        }).catch((err)=>{
            console.log(err)
        })
    }
    renderCart=()=>{
        if(this.state.datacart!==null){
            if(this.state.datacart.length===0){
                return (<tr>
                    <td>belum ada barang di Cart</td>
                </tr>)
            }
            return this.state.datacart.map((val,index)=>{
                return(
                    <tr key={index}>
                        <td style={{width:100}}>{index+1}</td>
                        <td style={{width:300}}>{val.movie.title}</td>
                        <td style={{width:100}}>{val.jadwal}</td>
                        <td style={{width:100}}>{val.qty.length}</td>
                        <td style={{width:100}}><button>Details</button></td>
                    </tr>
                )
            })
        }
    }
    render() {
        if(this.props.UserId){
            return (
                <div>
                    <center>
                        <Table style={{width:600}}>
                            <thead>
                                <tr>
                                    <th style={{width:100}}>No.</th>
                                    <th style={{width:300}}>Title</th>
                                    <th style={{width:100}}>Jadwal</th>
                                    <th style={{width:100}}>jumlah</th>
                                    <th style={{width:100}}>Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderCart()}
                            </tbody>
                            <tfoot>
                                <button>checkout</button>
                            </tfoot>
                        </Table>
                    </center>
                </div>
              );
        }
        return(
            <div>404 not found</div>
        )
    }
}

const MapstateToprops=(state)=>{
    return{
        AuthLog:state.Auth.login,
        UserId:state.Auth.id
    }
}
export default connect(MapstateToprops) (Cart);