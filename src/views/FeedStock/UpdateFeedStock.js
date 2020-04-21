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
    // option jenis pakan
    // const handleChange = 

    const Form = () => {
        return(<Row>
            <Col md="12">
                <AvField value={props.data.feedStocks.house} required={false} type="select" name="kandang" label="Kandang">
                    {props.data.house.map((data, key) => {
                        if(data._id === props.data.feedStocks.house._id)
                            return (
                                <option key={key} value={data._id} selected>{data.name}</option>
                            )
                        return (
                            <option key={key} value={data._id}>{data.name}</option>
                        )
                    })}
                </AvField>
            </Col>
            <Col md="10">
                <AvField value={props.data.feedStocks.feed} required={false} type="select" name="kode_pakan" label="Kode Pakan">
                    {props.data.feed.map((data, key) => {
                        if(data._id === props.data.feedStocks.feed._id)
                            return (
                                <option key={key} value={data._id} selected>{data.code} - {data.type}</option>
                            )
                        return (
                            <option key={key} value={data._id}>{data.code} - {data.type}</option>
                        )
                    })}
                </AvField>
            </Col>
            <Col  md="2">
                <AvInput value={parseInt(props.data.feedStocks.number)} label="Jumlah" type="number"/>
            </Col>
        </Row>);
    };

    //query update
    const queryUpdate = (value) => {
        console.log(value);
        return {
            query: `mutation{
                          updateFeedStock(_id : "${props.data.feedStocks._id}", updateFeedStockInput : {
                            number : ${parseInt(value.jumlah)},
                            house: "${value.kandang._id}",
                            feed: "${value.kode_pakan._id}"
                          }){
                            _id
                            number
                            feed{
                                _id
                                code
                            }
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