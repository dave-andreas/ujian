import React, { Component } from 'react';
import Axios from 'axios';
import { APIURL } from '../support/apiurl';
import {connect} from 'react-redux'
import Numeral from 'numeral'
import {Redirect} from 'react-router-dom'
import {Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap'
import { Link } from '@material-ui/core';

class Ticket extends Component {
    state = {
        dataMovie:{},
        kursi:0,
        baris:0,
        booked:[],
        loading:true,
        jam:12,
        pilihan:[],
        modalCart:false,
        redirHome:false
    }

    componentDidMount(){
        if(this.props.AuthLog && this.props.location.state){
            this.onJamChange()
        }
    }
    
    onJamChange=()=>{
        var studioId=this.props.location.state.studioId
        var movieId=this.props.location.state.id
        Axios.get(`${APIURL}studios/${studioId}`)//ambil data studio yg memutar film yang dipilih ....(res1)
        .then(res1=>{
            console.log(res1.data)
            Axios.get(`${APIURL}orders?movieId=${movieId}&jadwal=${this.state.jam}`)//ambil data orderan apa aja yang memilih film dan jam tersebut ....(res2)
            .then(res2=>{
                console.log(res2.data)
                var arrAxios=[]
                res2.data.forEach(val=>{
                    arrAxios.push(Axios.get(`${APIURL}ordersDetails?orderId=${val.id}`))
                    // Axios.get(`${APIURL}ordersDetails?orderId=${val.id}`)
                    // .then(res=>{
                    //     arrAxios.push(res.data)
                    // })
                })
                console.log(arrAxios)//mengubah jadi promise biar alur jadi sinkronus
                var arrAxios2=[]
                Axios.all(arrAxios)//lup dalam axios pakai .all
                .then(res3=>{
                    console.log(res3)
                    res3.forEach(val=>{
                        arrAxios2.push(...val.data)
                    })
                    console.log(arrAxios2)
                    this.setState({
                        dataMovie:this.props.location.state,
                        kursi:res1.data.kursi,
                        baris:res1.data.kursi/20,
                        booked:arrAxios2,
                        loading:false
                    })
                }).catch(err=>{
                    console.log(err)
                })
            }).catch(err2=>{
                console.log(err2)
            })
        }).catch(err1=>{
            console.log('masuk error')
            console.log(err1)
        })
    }

    renderSeat=()=>{
        console.log(this.state.redirHome)
        var arr=[]
        // console.log(this.state.baris)
        // console.log(this.state.kursi)
        for(let i=0;i<this.state.baris;i++){
            arr.push([])
            for(let j=0;j<20;j++){
                arr[i].push(1)
            }
        }
        // console.log(this.state.booked)
        for(let a=0;a<this.state.booked.length;a++){
            arr[this.state.booked[a].row][this.state.booked[a].seat]=3
        }
        // console.log(arr)
        for(let b=0;b<this.state.pilihan.length;b++){
            arr[this.state.pilihan[b].row][this.state.pilihan[b].seat]=2
        }
        var alph='ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        var qwe=arr.map((val,index)=>{
            return(
                <div key={index}>
                    {val.map((val2,i)=>{
                        if(val2===3){
                            return(
                                <button key={i} disabled type="button" class="rounded mx-1 my-1 btn btn-danger text-center lebar-tombol">
                                    {alph[index] +(i+1)}
                                </button>
                            )
                        }else if(val2===2){
                            return(
                                <button key={i} onClick={()=>this.onCancleSeat(index,i)} type="button" class="rounded mx-1 my-1 btn btn-warning text-center lebar-tombol">
                                    {alph[index] +(i+1)}
                                </button>
                            )
                        }
                        return(
                            <button key={i} onClick={()=>this.onPilihSeat(index,i)} type="button" class="rounded mx-1 my-1 btn btn-outline-warning text-center lebar-tombol">
                                {alph[index] +(i+1)}
                            </button>
                        )
                    })}
                </div>
            )
        })
        return qwe
    }

    onPilihSeat=(row,seat)=>{
        var pilihan=this.state.pilihan
        pilihan.push({row:row,seat:seat})
        this.setState({pilihan:pilihan})
    }

    onCancleSeat=(row,seat)=>{
        var pilihan=this.state.pilihan
        var rows=row
        var seats=seat
        var arr=[]
        for (var i=0;i<pilihan.length;i++){
            if(pilihan[i].row!==rows||pilihan[i].seat!==seats){
                arr.push(pilihan[i])
            }
        }
        this.setState({pilihan:arr})
    }

    renderQtty=()=>{    
        var jumtiket=this.state.pilihan.length
        var totharga=jumtiket*25000
        // this.setState({totharga})
        return(
            <div>
                {jumtiket} x {Numeral(2500).format('$0,0.00')}={Numeral(totharga).format('$0,0.00')}
            </div>
        )
    }

    onOrder=()=>{
        var userId=this.props.userId
        var movieId=this.state.dataMovie.id
        var pilihan=this.state.pilihan
        var jadwal=this.state.jam
        var totalHarga=this.state.pilihan.length*25000
        var bayar=false
        var dataorders={
            userId,
            movieId,
            jadwal,
            totalHarga,
            bayar
        }
        Axios.post(`${APIURL}orders`, dataorders)
        .then(res=>{
            // console.log(res.data)
            var orderDetail=[]
            pilihan.forEach(val=>{
                orderDetail.push({
                    orderId:res.data.id,
                    seat:val.seat,
                    row:val.row
                })
            })
            console.log(orderDetail)
            var orderDetail2=[]
            orderDetail.forEach(val=>{
                orderDetail2.push(Axios.post(`${APIURL}ordersDetails`,val))
            })
            Axios.all(orderDetail2)
            .then(res=>{
                this.setState({modalCart:true})
            }).catch(err=>{
                console.log(err)
            })
        }).catch(err=>{
            console.log(err)
        })
    }

    renderButton=()=>{
        return this.state.dataMovie.jadwal.map((val,index)=>{
            if(this.state.jam===val){
                return(
                    <button className='mx-2 btn-outline-primary' disabled>{val}.00</button>
                )
            }
            return(
                <button className='mx-2 btn-outline-primary' onClick={()=>this.onButtonjamClick(val)}>{val}.00</button>
            )
        })
    }

    onButtonjamClick=(val)=>{
        this.setState({jam:val,pilihan:[]})
        this.onJamChange()
    }
    
    // finalClick=()=>{
    //     this.setState({redirHome:true})
    //     window.location.reload()//masih bermasalah, malah balik ke page belitiket tapi pilih movie dulu
    // }

    render() {
        if(this.props.AuthLog && this.props.location.state){
            if(this.state.redirHome){
                // console.log(this.state.redirHome)
                return <Redirect to={'/'}/>
            }
            if(this.props.role==='user'){
            return (
                <div className='txt-putih'>
                    <Modal isOpen={this.state.modalCart} toggle={()=>this.setState({modalada:false,redirHome:true})}>
                        <ModalBody>
                            Order telah masuk dalam cart UwU !!
                        </ModalBody>
                        <ModalFooter>
                            <Link to={'/'}><button type='button' className='btn btn-primary' onClick={()=>this.setState({redirHome:true})} >Nice!</button></Link>
                        </ModalFooter>
                    </Modal>
                    <div>
                        {this.props.location.state.title}<br/><br/>
                        <center className='mt-1'>
                            {this.state.loading?null:this.renderButton()}
                        </center>
                        <div className='mt-3 pb-4'>
                            LAYAR
                            <div>
                                {this.state.loading?null:this.renderSeat()}
                            </div>
                            {this.state.pilihan.length?
                                <div>
                                    {this.renderQtty()}
                                </div>
                                :
                                null
                            }
                            <div>
                                {this.state.pilihan.length?
                                <button className='btn btn-primary mt-3' onClick={this.onOrder}>Order</button>
                                :
                                null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            );
            }else{
                return(
                    <div className='txt-putih'>
                        404 not found
                    </div>
                )
            }
        }
        return(
            <div className='txt-putih'>
                404 not found
            </div>
        )
        
        
    }
}
const MapstateToprops=(state)=>{
    return{
        AuthLog:state.Auth.login,
        userId:state.Auth.id,
        role:state.Auth.role
    }
}
export default connect(MapstateToprops) (Ticket);