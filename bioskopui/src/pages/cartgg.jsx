import React, { Component } from 'react';
import Axios from 'axios'
import {connect} from 'react-redux'
import {Modal,Table, ModalHeader, ModalBody} from 'reactstrap'
import { APIURL } from './../support/apiurl'
import {Link} from 'react-router-dom'


class Cart extends Component {
    state = { 
        datacart:null,
        modaldetail:false,
        indexdetail:0
     }

     componentDidMount(){
         Axios.get(`${APIURL}orders?_expand=movie&userId=${this.props.UserId}&bayar=false`)
         .then((res)=>{
             var datacart = res.data
            //  this.setState({datacart:res.data})
             var qtyArr = []
             res.data.forEach(element =>{
                 qtyArr.push(Axios.get(`${APIURL}ordersDetails?orderId=${element.id}`))
             })
             var qtyArrFix=[]
             Axios.all(qtyArr)
             .then((res1)=>{
                 res1.forEach((val)=>{
                     qtyArrFix.push(val.data)
                 })
                //console.log(datacart)
                
                 var dataFix=[]
                 datacart.forEach((val,index)=>{
                     dataFix.push({...val,qty:qtyArrFix[index]})
                 })
                //console.log(dataFix)
                 this.setState({
                     datacart:dataFix
                 })
                 console.log(datacart)
             }).catch((err)=>{
                 console.log(err)
             })
         }).catch((err)=>{
             console.log(err)
         })
     }

     renderCart=()=>{
         if(this.state.datacart!==null){
             if(this.state.datacart.length===0){
                 return (
                     <tr>
                         <td>Data Kosong</td>
                     </tr>
                 )
             }
             return this.state.datacart.map((val,index)=>{
                return(
                    <tr>
                        <td style={{width:100}}>{index+1}</td>
                        <td style={{width:300}}>{val.movie.title}</td>
                        <td style={{width:100}}>{val.jadwal}.00</td>
                        <td style={{width:100}}>{val.qty.length}</td>
                        <td style={{width:100}}><button className='btn btn-success' onClick={()=>this.setState({modaldetail:true})}>Details</button></td>
                    </tr>
                )
             })
         }
     }

    render() { 
        if(this.props.UserId){
            return ( 
                <div>
                    <Modal>
                        <ModalHeader isOpen={this.state.modaldetail} toggle={()=>{this.setState({modaldetail:false})}}>
                            Details
                        </ModalHeader>
                        <ModalBody>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Bangku</th>
                                    </tr>
                                </thead>
                                <tbod>
                                    {this.state.datacart!==null && this.state.datacart.length!==0 ? 
                                    this.state.datacart[this.state.indexdetail].qty.map((val,index)=>{
                                        return (
                                            <tr key={index}>
                                                <td>{index+1}</td>
                                                <td>{'abcdefghijklmnopqrstu'.toLocaleUpperCase()[val.row]+(val.seat+1)}</td>
                                            </tr>
                                        )
                                    })
                                    :
                                    null
                                }
                                </tbod>
                            </Table>
                        </ModalBody>
                    </Modal>
                    <center>
                        <Table style={{width:600}}>
                            <thead>
                                <tr>
                                    <th style={{width:'100px'}}>No. </th>
                                    <th style={{width:'300px'}}>Title</th>
                                    <th style={{width:'100px'}}>Jadwal</th>
                                    <th style={{width:'100px'}}>Quantity</th>
                                    <th style={{width:'100px'}}>Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderCart()}
                            </tbody>
                            <tfoot>
                                <button>Checkout</button>
                            </tfoot>
                        </Table>
                    </center>
                </div> 
                );
        }
        return (
            <div>
                404 Error Page Not Found
               <Link href={'/Login'}></Link>
            </div>
        )
    }
}

const MapStatToProps = (state) =>{
    return{
        AuthLogin:state.Auth.login,
        UserId:state.Auth.id
    }
}

 
export default connect (MapStatToProps) (Cart);