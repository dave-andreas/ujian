import React from 'react';
// import logo from './logo.svg';
import Header from './components/header'
import Home from './pages/home'
import './App.css';
import {Switch,Route} from 'react-router-dom'
import Admin from './pages/admin'
import Login from './pages/login'
import {connect} from 'react-redux'
import {LoginSuccessAction,CartAction} from './redux/action'
import Axios from 'axios'
import {APIURL} from './support/apiurl'
import MovieDetil from './pages/moviedetil'
import Ticket from './pages/belitiket'
import Register from './pages/register'
import Cart from './pages/cart'
import History from './pages/history'
import Studio from './pages/studio'
import Ubahpass from './pages/ubahpass'
// import {} from './pages/tabel'
// import Display from './components/slider'

class App extends React.Component {
  state = {
    loading:true
  }

  componentDidMount(){
    var id=localStorage.getItem('david')
    Axios.get(`${APIURL}users/${id}`)
    .then((res)=>{
      // console.log('test')
      this.props.LoginSuccessAction(res.data)
      Axios.get(`${APIURL}orders?userId=${res.data.id}&bayar=false`)
        .then(res1=>{
            this.props.CartAction(res1.data.length)
        }).catch(err=>{
            console.log(err)
        })
      // this.setState({loading:false})
    }).catch((err)=>{
      console.log(err)
    }).finally(()=>{
      this.setState({loading:false})
    })
  }

  render() {
    if(this.state.loading){
      return <div>loading euy</div>
    }
    return (
      <div className="App">
        <Header/>
        <Switch>
          <Route path={'/'} exact>
            <Home/>
          </Route>
          <Route path={'/admin'} exact>
            <Admin/>
          </Route>
          <Route path={'/login'} exact component={Login}/>
          <Route path={'/moviedetil/:id'} exact component={MovieDetil}/>
          <Route path={'/belitiket'} exact component={Ticket} />
          <Route path={'/register'} exact component={Register} />
          <Route path={'/cart'} exact component={Cart} />
          <Route path={'/history'} exact component={History} />
          <Route path={'/studio'} exact component={Studio} />
          <Route path={'/ubahpass'} exact component={Ubahpass} />
        </Switch>
        {/* <Display/> */}
      </div>
    );
  }
}

const MapstateToprops=(state)=>{
  return{
    AuthLog:state.Auth.login
  }
}
 
export default connect(MapstateToprops,{LoginSuccessAction,CartAction}) (App);

// function App() {
//   return (
//   );
// }

// export default App;
