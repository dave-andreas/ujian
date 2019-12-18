import React, { Component } from 'react';
import {Table,TableBody,TableHead,TableCell,TableRow} from '@material-ui/core'
import Axios from 'axios'
import { APIURL } from '../support/apiurl';
// import { makeStyles } from '@material-ui/core/styles'
import {Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap'
import Fade from 'react-reveal/Fade'
import {connect} from 'react-redux'


class Admin extends Component {
    state = {
        datafilm:[],
        datastudio:[],
        readmore:-1,
        modaladd:false,
        title:'',
        modaledit:false,
        indexedit:0,
        jadwal:[12,14,16,18],
        modaldelete:false,
        datadelete:{}
    }
    
    componentDidMount(){
        Axios.get(`${APIURL}movies`)
        .then((res)=>{
            this.setState({datafilm:res.data})
            Axios.get(`${APIURL}studios`)
            .then(res1=>{
                this.setState({datastudio:res1.data})
            }).catch(err=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    onsimpan=()=>{
        var jadwalawal=[12,14,16,18]
        var jadwalbaru=[]

        // for(var i=0;i<=jadwalawal.length;i++){
        //     if(this.refs.jadwal[i].value){
        //         jadwalbaru.push(jadwalawal[i])
        //     }
        // }

        if(this.refs.jadwal0.checked){
            jadwalbaru.push(jadwalawal[0])
        }
        if(this.refs.jadwal1.checked){
            jadwalbaru.push(jadwalawal[1])
        }
        if(this.refs.jadwal2.checked){
            jadwalbaru.push(jadwalawal[2])
        }
        if(this.refs.jadwal3.checked){
            jadwalbaru.push(jadwalawal[3])
        }
        console.log(jadwalbaru)

        var data={
            title:this.refs.title.value,
            sutradara:this.refs.sutradara.value,
            sinopsis:this.refs.sinopsis.value,
            image:this.refs.image.value,
            genre:this.refs.genre.value,
            produksi:this.refs.produksi.value,
            jadwal:jadwalbaru,
            durasi:this.refs.durasi.value,
            trailer:this.refs.trailer.value,
            studioId:this.refs.studioId.value
        }
        console.log(data)

        Axios.post(`${APIURL}movies`,data)
        .then((res)=>{
            Axios.get(`${APIURL}movies`)
            .then((res)=>{
                this.setState({datafilm:res.data,modaladd:false})
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    onupdate=()=>{
        var jadwalawal=[12,14,16,18]
        var jadwalbaru=[]
        var id=this.state.datafilm[this.state.indexedit].id
        // for(var i=0;i<=jadwalawal.length;i++){
        //     if(this.refs.jadwal[i].checked){
        //         jadwalbaru.push(jadwalawal[i])
        //     }
        // }

        if(this.refs.editjadwal0.checked){
            jadwalbaru.push(jadwalawal[0])
        }
        if(this.refs.editjadwal1.checked){
            jadwalbaru.push(jadwalawal[1])
        }
        if(this.refs.editjadwal2.checked){
            jadwalbaru.push(jadwalawal[2])
        }
        if(this.refs.editjadwal3.checked){
            jadwalbaru.push(jadwalawal[3])
        }
        console.log(jadwalbaru)

        var data={
            title:this.refs.edittitle.value,
            sutradara:this.refs.editsutradara.value,
            sinopsis:this.refs.editsinopsis.value,
            image:this.refs.editimage.value,
            genre:this.refs.editgenre.value,
            produksi:this.refs.editproduksi.value,
            jadwal:jadwalbaru,
            durasi:this.refs.editdurasi.value,
            trailer:this.refs.edittrailer.value,
            studioId:this.refs.editstudioId.value
        }
        console.log(data)

        Axios.put(`${APIURL}movies/${id}`,data)
        .then((res)=>{
            Axios.get(`${APIURL}movies`)
            .then((res)=>{
                this.setState({datafilm:res.data,modaledit:false})
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    onDelete=()=>{
        console.log(this.state.datadelete)
        Axios.delete(`${APIURL}movies/${this.state.datadelete.id}`)
        .then((res)=>{
            this.componentDidMount()
            this.setState({modaldelete:false})
            // Axios.get(`${APIURL}movies`)
            // .then((res)=>{
            //     this.setState({datafilm:res.data,modaldelete:false})
            // })
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderAddCheckbox=()=>{
        return this.state.jadwal.map((val,index)=>{
            return(
                <div key={index}>
                    <input type='checkbox' ref={`jadwal${index}`}/>
                    <span className='mr-2'>{val}.00</span>
                </div>
            )
        })
    }

    renderEditCheckbox=(indexedit)=>{
        var indexarr=[]
        var datafilmedit=this.state.datafilm[indexedit].jadwal
        datafilmedit.forEach((val)=>{
            indexarr.push(this.state.jadwal.indexOf(val))
        })
        var checkbox=this.state.jadwal
        var checkboxnew=[]
        checkbox.forEach((val)=>{
            checkboxnew.push({jam:val,tampiledit:false})
        })
        indexarr.forEach((val)=>{
            checkboxnew[val].tampiledit=true
        })
        return checkboxnew.map((val,index)=>{
            if(val.tampiledit){
                return(
                    <div key={index}>
                        <input type='checkbox' defaultChecked ref={`editjadwal${index}`} value={val.jam}/>
                        <span className='mr-3'>{val.jam}.00</span>
                    </div>
                )
            }else{
                return(
                    <div key={index}>
                        <input type='checkbox' ref={`editjadwal${index}`} value={val.jam} />
                        <span className='mr-2'>{val.jam}.00</span>
                    </div>
                )
            }
        })
    }

    renderMovie(){
        // console.log(this.state.datafilm)
        return this.state.datafilm.map((val,index)=>{
            return(
                <TableRow key={index}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell width='130px'>{val.title}</TableCell>
                    <TableCell><img src={val.image} alt={'gambar'} height='200px'/></TableCell>
                    {this.state.readmore===index?
                    <TableCell width='350px'>
                        {val.sinopsis}
                        <span style={{color:'blue'}} onClick={()=>this.setState({readmore:-1})}> read less</span>
                    </TableCell>
                    :
                    <TableCell width='350px'>
                        {val.sinopsis.split('').filter((val,index)=>index<=80)}
                        <span style={{color:'blue'}} onClick={()=>this.setState({readmore:index})}>... read more</span>
                    </TableCell>
                    }
                    <TableCell>{val.jadwal}</TableCell>
                    <TableCell>{val.sutradara}</TableCell>
                    <TableCell>{val.genre}</TableCell>
                    <TableCell>{val.durasi}</TableCell>
                    <TableCell>{val.produksi}</TableCell>
                    <TableCell>
                        <button className='btn btn-outline-primary' onClick={()=>this.setState({modaledit:true, indexedit:index})}>Edit</button><br/><br/>
                        <button className='btn btn-outline-danger' onClick={()=>this.setState({modaldelete:true,datadelete:val})}>Delete</button>
                    </TableCell>
                </TableRow>
            )
        })
    }

    render() { 
        const {datafilm,indexedit}=this.state
        const {length}=datafilm
        if(length===0){
            return <div>Loading...</div>
        }
        if(this.props.role==='user'||this.props.role===''){
            return <div className='txt-putih'>YOU ARE NOT SUPPOSED TO DO THAT</div>
        }else{
            return(
                <div className='bg-putih'>
                    <Modal isOpen={this.state.modaladd} toggle={()=>this.setState({modaladd:false})}>
                        <ModalHeader>
                            Add Data
                        </ModalHeader>
                        <ModalBody>
                            <input type='text' ref='title' placeholder='title' className='mb-1 form-control' />
                            <input type='text' ref='image' placeholder='image' className='mb-1 form-control' />
                            <input type='text' ref='sinopsis' placeholder='sinopsis' className='mb-1 form-control' />
                            <p className='ml-2'>Jadwal:</p>
                            <div className="d-flex ml-4 mb-2">
                                {this.renderAddCheckbox()}
                            </div>
                            <input type='text' ref='trailer' placeholder='trailer' className='mb-1 form-control' />
                            <select ref='studioId' className='from-control mt-1 mb-2'>
                                <option value='1'>Studio 1</option>
                                <option value='2'>Studio 2</option>
                                <option value='3'>Studio 3</option>
                            </select>
                            <input type='text' ref='sutradara' placeholder='sutradara' className='mb-1 form-control' />
                            <input type='text' ref='genre' placeholder='genre' className='mb-1 form-control' />
                            <input type='text' ref='durasi' placeholder='durasi' className='mb-1 form-control' />
                            <input type='text' ref='produksi' placeholder='produksi' className='mb-1 form-control' />
                        </ModalBody>
                        <ModalFooter>
                            <button className='btn btn-primary' onClick={this.onsimpan}>Save</button>
                            <button className='btn btn-warning' onClick={()=>this.setState({modaladd:false})}>Cancle</button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.modaledit} toggle={()=>this.setState({modaledit:false})}>
                        <ModalHeader>
                            Edit Data "{datafilm[indexedit].title}"
                        </ModalHeader>
                        <ModalBody>
                            <input type='text' defaultValue={datafilm[indexedit].title} ref='edittitle' placeholder='title' className='mb-1 form-control' />
                            <input type='text' defaultValue={datafilm[indexedit].image} ref='editimage' placeholder='image' className='mb-1 form-control' />
                            <textarea rows='4' defaultValue={datafilm[indexedit].sinopsis} ref='editsinopsis' placeholder='sinopsis' className='mb-1 form-control' />
                            <p className='ml-2'>Jadwal:</p>
                            <div className="d-flex">
                                {this.renderEditCheckbox(indexedit)}
                            </div>
                            <input type='text' defaultValue={datafilm[indexedit].trailer} ref='edittrailer' placeholder='trailer' className='mb-1 form-control' />
                            <select ref='editstudioId' className='from-control mt-2'>
                                <option value='1'>Studio 1</option>
                                <option value='2'>Studio 2</option>
                                <option value='3'>Studio 3</option>
                            </select>
                            <input type='text' defaultValue={datafilm[indexedit].sutradara} ref='editsutradara' placeholder='sutradara' className='mb-1 form-control' />
                            <input type='text' defaultValue={datafilm[indexedit].genre} ref='editgenre' placeholder='genre' className='mb-1 form-control' />
                            <input type='text' defaultValue={datafilm[indexedit].durasi} ref='editdurasi' placeholder='durasi' className='mb-1 form-control' />
                            <input type='text' defaultValue={datafilm[indexedit].produksi} ref='editproduksi' placeholder='produksi' className='mb-1 form-control' />
                        </ModalBody>
                        <ModalFooter>
                            <button className='btn btn-primary' onClick={this.onupdate}>Update</button>
                            <button className='btn btn-warning' onClick={()=>this.setState({modaledit:false})}>Cancle</button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.modaldelete} toggle={()=>this.setState({modaldelete:false})}>
                        <ModalBody>
                            Anda yakin ingin menghapus data?
                        </ModalBody>
                        <ModalFooter>
                            <button className='btn btn-outline-primary' onClick={this.onDelete}>Delete it</button>
                            <button className='btn btn-danger' onClick={()=>this.setState({modaldelete:false,datadelete:{}})}>Nope</button>
                        </ModalFooter>
                    </Modal>
                    <Fade>
                        <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>No.</TableCell>
                                <TableCell>Judul</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Sinopsis</TableCell>
                                <TableCell>Jadwal</TableCell>
                                <TableCell>Sutradara</TableCell>
                                <TableCell>Genre</TableCell>
                                <TableCell>Durasi</TableCell>
                                <TableCell>Produksi</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.renderMovie()}
                        </TableBody>
                        </Table>
                        
                        <button className='btn btn-success mb-3 mt-2 mx-3' onClick={()=>this.setState({modaladd:true})}>add data</button>
                    </Fade>
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
export default connect(MapstateToprops) (Admin);