import React, {useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import '../../index.css';
import logoWithTagline from '../../assets/img/brand/logo_with_tagline.png'
import axios from '../../axios';
import {
    Button,
    Card,
    CardBody,
    CardGroup,
    Col,
    Container,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
} from 'reactstrap';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import {GoogleLogin} from 'react-google-login';
import Loader from 'react-loader-spinner';
import auth from "../../auth";
import {showNotification} from "../Components/Notification";

function Login(props) {
    const [loading, setLoading ] = useState(false);
    const responseGoogle = async (res) => {
        try {
            console.log(res);
            let userData = {name: res.profileObj.name, email: res.profileObj.email, photo: res.profileObj.imageUrl};
            const reqBody = {
                query: `query{
                      checkEmail(email:"${res.profileObj.email}"){
                        registered
                      }
                    }
                `
            };
            let apiResponse = await axios.post('graphql', JSON.stringify(reqBody), {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if(apiResponse.data.data.checkEmail.registered === true) {
                // const query = {
                //     query: `query{
                //           login(email:"${email}",password:"${password}"){
                //             token
                //             name
                //             userId
                //             company
                //             tokenExpiration
                //           }
                //         }
                //     `
                // };

                // const res = await axios.post('https://avesbox.glitch.me/graphql', query);
                props.history.push('/dashboard');
            } else {
                props.history.push('/register');
            }
        } catch (e) {
            console.log(e)
        }

    };
    const responseFb = async (res) => {
        console.log(res.accessToken);
        try {
            let userData = {name: res.name, email: res.email, photo: res.picture.data.url};
            const reqBody = {
                query: `query{
                      checkEmail(email:"${res.email}"){
                        registered
                      }
                    }
                `
            }
            let apiResponse = await axios.post('graphql', JSON.stringify(reqBody), {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            auth.login(userData, () => {
                if (apiResponse.data.data.checkEmail.registered === true)
                    props.history.push('/dashboard');
                else
                    props.history.push('/register');
            })
        } catch (e) {
            showNotification("Username atau password salah","danger");
        }
    };
    const fbContent = (<FacebookLogin
        appId="2784727991754309"
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFb}
        render={renderProps => (
            <Button onClick={renderProps.onClick}
                style={{"backgroundColor":"#4267b2", "border": "none", "color": "white", "width": "60%"}}> <span
                className="fa fa-facebook"></span> &nbsp;&nbsp; Masuk dengan
                Facebook</Button>
        )}
    />);
    const googContent = (<GoogleLogin
        clientId="174303219957-gultn21oe6grvv686n472nlcpptb58do.apps.googleusercontent.com"
        render={renderProps => (
            <Button onClick={renderProps.onClick} color="danger" style={{"width":"60%"}}> <span
                className="fa fa-google"></span> &nbsp;&nbsp;Masuk dengan
                Google</Button>
        )}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
    />);

    const emailInput = useRef(null);
    const passwordInput = useRef(null);

    const handleLoginUsernamePassword = async (e) => {
        e.preventDefault();
        const email = emailInput.current.value;
        const password = passwordInput.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            showNotification("Username atau password salah","danger");
            return;
        }
        try{
        const query = {
            query: `query{
                  login(email:"${email}",password:"${password}"){
                    token
                    name
                    userId
                    company
                    tokenExpiration
                  }
                }
            `
        };
        setLoading(true);
        const res = await axios.post('https://avesbox.glitch.me/graphql', query);
        if(res.data.errors) {
            if (res.data.errors[0].message === "Not Verified")
                showNotification("Email belum terverifikasi","danger")
            else
                showNotification("Username atau password salah","danger")
            throw new Error();
        }
        auth.setSession(
            res.data.data.login.userId,
            res.data.data.login.name,
            res.data.data.login.token,
            res.data.data.login.company,
            null, function (resData) {
                console.log(resData);
            }
        )
        props.history.push('/dashboard');
        setLoading(false);
        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    };

    return (
        <div className="app flex-row align-items-center white-background">
            <Container fluid={false}>
                <Row className="justify-content-center">
                    <Col md="10">
                        <CardGroup className="box-shadow">
                            <Card className="text-black py-5 d-md-down-none">
                                <CardBody className="text-center justify-content-center d-flex">
                                    <div className="my-auto">
                                        <img className="login-logo" src={logoWithTagline}
                                             alt="Avesbox Logo With Tagline"/>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card className="p-4 bg-avesbox-orange">
                                <CardBody>
                                    <form onSubmit={handleLoginUsernamePassword}>
                                        <h2>Masuk</h2>
                                        <br/>
                                        {fbContent}
                                        <br/><br/>
                                        {googContent}
                                        <hr/>
                                        <p> Masuk menggunakan akun anda</p>
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-user"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="text" innerRef={emailInput} placeholder="Username / Email"
                                                   autoComplete="email"/>
                                        </InputGroup>
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-lock"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input innerRef={passwordInput} type="password" placeholder="Password"
                                                   autoComplete="current-password"/>
                                        </InputGroup>
                                        <Row>
                                            <Col xs="6">
                                                <Button type="submit" color="primary" className="px-4">{loading ? <Loader type="ThreeDots" className="d-flex" height={20} width={40} color="#ffffff"/> : "Login"}</Button>
                                            </Col>
                                            <Col xs="6" className="text-right">
                                                <Link to="/" className="font-weight-bold" style={{"letterSpacing":.5}}>Lupa Password?</Link>
                                            </Col>
                                        </Row>
                                        <br/>
                                        <p className="text-muted"> Belum memiliki Akun ? <Link
                                            to="/register">Daftar</Link> Sekarang!</p>
                                    </form>
                                </CardBody>
                            </Card>
                        </CardGroup>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;
