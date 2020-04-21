import React, {useState, useEffect} from "react";
import {Button, Col, Row} from "reactstrap";
import AvInput from "../../Components/Input";
import CreateModal from "../../Components/CreateModal";
import {AvField} from 'availity-reactstrap-validation';
import axios from "../../../axios";
import {showNotification} from "../../Components/Notification";
import auth from "../../../auth";
import AsyncFetch from "../../Components/AsyncFetch";

export default function CreateMonitor(props) {
    const [modal, setModal] = useState(false);
    const [houseOptions, setHouseOptions] = useState([]);
    const arrType = ['v1', 'v2', 'v3'];

    // query create
    const queryCreate = (value) => {
        console.log(value);
        return {
            query: `mutation{
                        createDevice(deviceInput: {
                            house : "${value.kandang}"
                            serialNumber : "${value.nomor_seri}"
                            deviceType : "${value.tipe_iot}"
                        }){
                            serialNumber
                        }
                    }
                `
        }
    }

    const selectHouseQuery = (keyword, cb) => {
        const q = `query{
                    houses(keyword: "${keyword}", limit: 0, skip: 0){
                        houses{
                            _id
                            name
                        }
                    }
                }`
        
        AsyncFetch(q, (res) => {
            cb(res.data.data.houses.houses);
        })
    }

    useEffect(() => {
        selectHouseQuery('', res => {
            setHouseOptions(res);
        })
    }, []);

    /**
     * ========================================================================================================================
     * STOP!! You are not allow edit code below
     * ========================================================================================================================
     *
     * Author : Jati Pikukuh
     */

    const handleSubmit = async (e, err, value) => {
        if (err.length > 0) {
            return;
        }
        try {
            const query = queryCreate(value);
            let res = await axios.post('graphql', JSON.stringify(query), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.getSession().token
                }
            });
            const resData = res.data;
            if (resData.errors) {
                showNotification(resData.errors[0].message, "danger")
                return;
            }
            showNotification("Berhasil menambah " + props.objectName , "success");
            props.onSuccess();
            setModal(false);
        } catch (e) {
            console.log(e);
            showNotification("Data tidak valid", "danger")
        }
    }

    return (
        <div>
            <Button onClick={() => setModal(true)} color="primary"><i
                className="fa fa-plus"></i> Tambah {props.objectName}</Button>
            <CreateModal title={'Tambah ' + props.objectName} modal={modal} onCancel={() => setModal(!modal)}
                         onSubmit={handleSubmit}>
                <Row>
                    <Col md="12">
                        <AvField value={houseOptions._id} required={false} type="select" name="kandang" label="Kandang">
                            <option></option>
                            {houseOptions.map((data, key) => {
                                return (
                                    <option key={key} value={data._id}>{data.name}</option>
                                )
                            })}
                        </AvField>
                    </Col>
                    <Col md="8">
                        <AvInput label="Nomor Seri"/>
                    </Col>
                    <Col md="4">
                        <AvField required={false} type="select" name="tipe_iot" label="Tipe IoT">
                            <option></option>
                            {arrType.map((data, key) => {
                                return (<option key={key} value={data}>{data}</option>)
                            })}
                        </AvField>
                    </Col>
                </Row>
            </CreateModal>
        </div>
    )
}