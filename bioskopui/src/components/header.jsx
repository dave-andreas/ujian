import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
//   NavbarText
} from 'reactstrap';
import {Link,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {LogoutSuccessAction} from './../redux/action'
import {IoIosCart} from 'react-icons/io'

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const onLogout=()=>{
    localStorage.clear()
    LogoutSuccessAction()
    // return <Redirect to={'/'}/>
  }
  
  // if(props.AuthLog){
  //   return <Redirect to={'/'}/>
    
  // }

  return (
    <div>
      <Navbar expand="md" className='bg-orange' >
        <NavbarBrand href="/" className='font-weight-bold logo'>Layar Mantap!</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/components/" className='txt-putih'>Components</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/reactstrap/reactstrap" className='txt-putih'>GitHub</NavLink>
            </NavItem>
            {props.namauser===''?
              null
              :
              <NavItem className='d-flex'>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret className='txt-putih'>
                    {props.namauser}
                  </DropdownToggle>
                  <DropdownMenu right>
                    {props.role==='user'?
                      <div>
                        <Link to={'/cart'}>
                          <DropdownItem>
                            Pesanan
                          </DropdownItem>
                        </Link>
                        <Link to={'/history'}>
                          <DropdownItem>
                            History
                          </DropdownItem>
                        </Link>
                      </div>
                    :null}
                    <Link to={'/ubahpass'}>
                      <DropdownItem>
                        Ubah password
                      </DropdownItem>
                    </Link>
                    {props.role==='admin'?
                    <div>
                      <Link to={'/admin'}>
                        <DropdownItem>
                          Manage Movie 
                        </DropdownItem>
                      </Link>
                      <Link to={'/studio'}>
                        <DropdownItem>
                          Manage Studio
                        </DropdownItem>
                      </Link>
                    </div>
                    :null}
                  </DropdownMenu>
                </UncontrolledDropdown>
                {props.role==='user'?
                  <div className='d-flex'>
                    <NavItem className='pt-1'>
                      <Link to={'/cart'}><IoIosCart color='whitesmoke' className='mt-2 ml-1' style={{fontSize:20}} /> </Link>
                    </NavItem>
                    <NavItem className='pt-2 pl-2 txt-putih'>
                      {props.jumlahcart}
                    </NavItem>
                  </div>
                :null}
              </NavItem>
            }
          </Nav>
          {/* <NavbarText>Simple Text</NavbarText> */}
        </Collapse>
        {
          props.namauser===''?
            <Link to='/login'>
              <div className='sign-in'>
                Sign-in
              </div>
            </Link>
            :
            <NavLink href='/'>
            <div onClick={()=>onLogout()} className='sign-in'>
              Sign-out
            </div>
            </NavLink>
        }
      </Navbar>
    </div>
  );
}

const MapstateToprops=(state)=>{
  return{
    namauser:state.Auth.username,
    jumlahcart:state.Auth.jumlahcart,
    role:state.Auth.role
    // AuthLog:state.Auth.login
  }
}

export default connect(MapstateToprops,{LogoutSuccessAction}) (Header);