import React, {useState, useEffect} from "react";
import {Col, Row} from "reactstrap";
import AvInput from "../Components/Input";
import CreateModal from "../Components/CreateModal";
import {AvField} from 'availity-reactstrap-validation';
import axios from "../../axios";
import {showNotification} from "../Components/Notification";
import auth from "../../auth";
import AsyncFetch from "../Components/AsyncFetch";

function UpdateFeedStock(props) {
    const arrType = ['v1', 'v2', 'v3'];

    const Form = () => {
        return(<Row>
            <Col md="12">
                <AvField value={props.data.devices.house} required={false} type="select" name="kandang" label="Kandang">
                    {props.data.house.map((data, key) => {
                        if(data._id === props.data.devices.house._id)
                            return (
                                <option key={key} value={data._id} selected>{data.name}</option>
                            )
                        return (
                            <option key={key} value={data._id}>{data.name}</option>
                        )
                    })}
                </AvField>
            </Col>
            <Col md="8">
                <AvInput value={props.data.devices.serialNumber} label="Nomor Seri"/>
            </Col>
            <Col md="4">
                <AvField value={props.data.devices.deviceType} required={false} type="select" name="tipe_iot" label="Tipe IoT">
                    {arrType.map((data, key) => {
                        if(data === props.data.devices.deviceTypes)
                            return (
                                <option key={key} value={data} selected>{data}</option>
                            )
                        return (
                            <option key={key} value={data}>{data}</option>
                        )
                    })}
                </AvField>
            </Col>
        </Row>);
    };

    //query update
    const queryUpdate = (value) => {
        console.log(value);
        return {
            query: `mutation{
                        updateDevice(_id : "${props.data.devices._id}", updateDeviceInput : {
                            serialNumber: "${value.nomor_seri}",
                            house: "${value.kandang._id}",
                            deviceType: "${value.tipe_iot}"
                        }){
                            _id
                            serialNumber
                            deviceType
                            house{
                                _id
                                name
                            }
                        }
                    }
                `
        }
    }

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
            let res = await axios.post('graphql', JSON.stringify(queryUpdate(value)), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.getSession().token
                }
            });
            const resData = res.data;
            if (resData.errors) {
                showNotification(resData.errors[0].message, "danger");
                return;
            }
            showNotification("Berhasil memperbaharui "+ props.objectName, "success");
            props.onSuccess();
        } catch (e) {
            console.log(e);
            showNotification("Data tidak valid", "danger")
        }
    }

    return (
        <CreateModal title={'Ubah '+ props.objectName} modal={props.modal} onCancel={props.onCancel}
                     onSubmit={handleSubmit}>
            <Form/>
        </CreateModal>
    )
}

export default UpdateFeedStock;