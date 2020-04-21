import React, {useState, useEffect} from "react";
import {Button, Col, Row} from "reactstrap";
import AvInput from "../Components/Input";
import CreateModal from "../Components/CreateModal";
import {AvField} from 'availity-reactstrap-validation';
import axios from "../../axios";
import {showNotification} from "../Components/Notification";
import auth from "../../auth";
import AsyncFetch from "../Components/AsyncFetch";

export default function CreateFeedStock(props) {
    const [modal, setModal] = useState(false);
    const [feedOptions, setFeedOptions] = useState([]);
    const [houseOptions, setHouseOptions] = useState([]);

    // query create
    const queryCreate = (value) => {
        console.log(value);
        return {
            query: `mutation{
                      createFeedStock(feedStockInput: {
                        house : "${value.kandang}"
                        feed : "${value.kode_pakan}"
                        number: ${parseInt(value.jumlah)}
                      }){
                        number
                      }
                    }
                `
        }
    }

    const selectFeedQuery = (keyword, cb) => {
        const q = `query{
                    feeds(keyword: "${keyword}", limit: 0, skip: 0){
                        feeds{
                            _id
                            code
                            type
                        }
                    }
                }`
        
        AsyncFetch(q, (res) => {
            cb(res.data.data.feeds.feeds);
        })
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
        selectFeedQuery('', res => {
            setFeedOptions(res);
        })
    }, []);

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
                    <Col md="10">
                        <AvField value={feedOptions._id} required={false} type="select" name="kode_pakan" label="Kode Pakan">
                            <option></option>                            
                            {feedOptions.map((data, key) => {
                                return (
                                    <option key={key} value={data._id}>{data.code} - {data.type}</option>
                                )
                            })}
                        </AvField>
                    </Col>
                    <Col md="2">
                        <AvInput label="Jumlah" type="number"/>
                    </Col>
                </Row>
            </CreateModal>
        </div>
    )
}