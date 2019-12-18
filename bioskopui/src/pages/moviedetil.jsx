import React, { Component } from 'react';
import Axios from 'axios';
import { APIURL } from '../support/apiurl';
import { Link } from '@material-ui/core';
import {Redirect} from 'react-router-dom'

class MovieDetil extends Component {
    state = {
        datadetil:{},
        belitiket:false
    }

    componentDidMount(){
        Axios.get(`${APIURL}movies/${this.props.match.params.id}`)
        .then(res=>{
            console.log(res.data)
            this.setState({datadetil:res.data})
        }).catch(err=>{
            console.log(err)
        })
    }

    render() {
        if(this.state.belitiket){
            return <Redirect to={{pathname:'/belitiket', state:this.state.datadetil}}/>
        }
        return (
            <div>
                <p className='txt-putih'>{this.state.datadetil.title}</p>
                <div className='txt-putih'>
                    <Link to={'/belitiket'}>
                        <button onClick={()=>this.setState({belitiket:true})}>
                            Get Ticket
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
}
 
export default MovieDetil;