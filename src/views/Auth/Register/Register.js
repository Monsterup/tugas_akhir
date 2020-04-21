import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import '../../../index.css';
import {
    Button,
    Card,
    CardGroup,
    CardBody,
    Col,
    Container,
    InputGroup,
    InputGroupAddon,
    Form,
    Row,
    Label
} from 'reactstrap';
import {AvForm, AvInput, AvGroup, AvField} from 'availity-reactstrap-validation';
import Input from '../../Components/Input'
import ReCAPTCHA from "react-google-recaptcha";
import Loader from 'react-loader-spinner';
import {showNotification} from "../../Components/Notification";
import axios from "../../../axios";
import logo from '../../../assets/img/brand/logo_only.svg';


function Register(props) {
    const [loading, setLoading ] = useState(false);
    const [typePass, setTypePass] = useState('password');
    const type = [{value : 'perusahaan_kemitraaan' , option : 'Perusahaan Kemitraan'}, { value : 'peternakan_mandiri', option : 'Peternakan Mandiri'}];

    const showPass = () => {
        typePass === 'password' ? setTypePass('text') : setTypePass('password');
    }

    const handleRegister = async (e, err, value) => {
        // if (!recaptchaRef){
        //     showNotification("Captcha harap dicentang","danger")
        //     return;
        // }
        if (err.length > 0){
            return;
        }
        try {
            const query = {
                query: `mutation{
                      register(registerInput: {
                        name : "${value.nama_lengkap}"
                        email : "${value.email}"
                        username : "${value.nama_pengguna}"
                        password : "${value.password}"
                        address : "${value.alamat}"
                        companyName : "${value.nama_usaha_peternakan}"
                        companyType : "${value.jenis_usaha_peternakan}"
                        type : "owner"
                      }){
                        name
                        email
                      }
                    }
                `
            };
            let res = await axios.post('graphql', JSON.stringify(query), {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const resData = res.data;
            if (resData.errors){
                showNotification(resData.errors[0].message,"danger")
                return;
            }
            showNotification("Silahkan periksa kotak masuk email Anda","success")
            props.history.push('/login')
        } catch (e) {
            showNotification("Input tidak valid","danger")
        }
    };

    return (
        <div className="app flex-row align-items-center white-background">
            <Container fluid={false}>
                <Row className="justify-content-center">
                    <Col md="10">
                        <CardGroup className="box-shadow">
                            <Card className="text-black p-5 d-md-down-none" style={{"maxWidth":"350px"}}>
                                <CardBody className="text-center justify-content-center d-flex">
                                    <div className="my-auto">
                                        <img src={logo} alt="Avesbox"/>
                                        <br/>
                                        <br/>
                                        <h1 className="font-5xl font-weight-bold">avesbox</h1>
                                        <p className="font-italic" style={{"fontWeight":500}}>empowering chicken farms</p>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card className="p-4 bg-avesbox-orange">                            
                            <CardBody>
                                <h1 className="font-weight-bold">Daftar</h1>
                                <br/>
                                <Form>
                                    <AvForm onSubmit={handleRegister}>
                                        <Row>
                                            <Col md="6">
                                                <Input  label="Nama Lengkap" minLength="5"/>
                                            </Col>
                                            <Col md="6">
                                                <Input  type="email" label="Email" minLength="5"/>
                                            </Col>
                                            <Col md="6">
                                                <Input  label="Nama Pengguna" pattern/>
                                            </Col>
                                            <Col md="6">
                                            <AvGroup>
                                                <Label>Password</Label>
                                                <InputGroup>
                                                <AvInput name="password" type={typePass} required/>
                                                <InputGroupAddon addonType="append">
                                                    <Button className="btn btn-light" onClick={showPass} style={{"color": "black"}}><i className={typePass === 'text' ? 'fa fa-eye' : 'fa fa-eye-slash'}></i></Button>
                                                </InputGroupAddon>
                                                </InputGroup>
                                            </AvGroup>
                                            </Col>
                                            <Col md="12">
                                                <Input type="textarea" label="Alamat" minLength="10" maxLength="200"/>
                                            </Col>
                                            <Col md="6">
                                                <Input  label="Nama Usaha Peternakan"/>
                                            </Col>
                                            <Col md="6">
                                                <AvField required={true} type="select" name="jenis_usaha_peternakan" label="Jenis Usaha Peternakan" >
                                                    <option></option>
                                                    {type.map((data,key) => {
                                                        return(<option key={key} value={data.value}>{data.option}</option>)
                                                    })}
                                                </AvField>
                                            </Col>
                                            <Col md="12">
                                                <AvGroup check>
                                                    <AvInput required type="checkbox" name="checkbox" />
                                                    <Label check for="checkbox"> Saya sudah membaca dan menyetujui <a href="http://avesbox.com/terms"> Syarat dan Ketentuan </a> yang berlaku</Label>
                                                </AvGroup>
                                                <br/>
                                            </Col>
                                            <Col md="12" className="text-right">
                                                <Button type="submit" color="primary" className="px-4" block>Daftar</Button>
                                            </Col>
                                        </Row>
                                    </AvForm>
                                    <br/>
                                    <p> Sudah memiliki Akun ? <Link
                                        to="/login" className="font-weight-bold" style={{"letterSpacing":.5}}>Masuk</Link> Sekarang!</p>
                                </Form>
                            </CardBody>
                            </Card>
                        </CardGroup>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Register;
