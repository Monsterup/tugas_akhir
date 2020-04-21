import React, {useEffect, useState} from "react";
import {Button, Col, Row} from "reactstrap";
import AvInput from "../Components/Input";
import CreateModal from "../Components/CreateModal";
import {AvField} from 'availity-reactstrap-validation';
import axios from "../../axios";
import {showNotification} from "../Components/Notification";
import auth from "../../auth";
import AsyncFetch from "../Components/AsyncFetch";
import Select from '../Components/Select';

export default function CreateHouse(props) {
    const [modal, setModal] = useState(false);
    // const [options, setOptions] = useState([]);

    const Form = () => {
        return (<Row>
            <Col md="6">
                <AvInput label="Nama Kandang" minLength="3"/>
            </Col>
            <Col md="6">
                <AvInput type="number" label="Kapasitas"/>
            </Col>
            <Col md="6">
                <AvInput type="textarea" label="Alamat"/>
            </Col>
            <Col md="6">
                <AvInput required={false} type="textarea" label="Keterangan"/>
            </Col>
        </Row>)
    };

    // query create
    const queryCreate = (value) => {
        console.log(value);
        return {
            query: `mutation{
                      createHouse(houseInput: {
                        name : "${value.nama_kandang}"
                        capacity : ${parseInt(value.kapasitas)}
                        address: "${value.alamat}"
                        otherInformation : "${value.keterangan}"
                      }){
                        _id
                      }
                    }
                `
        }
    };

    // const selectQuery = (keyword, callback) => {
    //     const qw = `query{
    //                       feedWarehouses(keyword : "${keyword}", limit : 10, skip : 0){
    //                         feedWarehouses{
    //                             value:_id
    //                             label:name
    //                         }
    //                       }
    //                     }
    //             `;

    //     AsyncFetch(qw, (res) => {
    //         callback(res.data.data.feedWarehouses.feedWarehouses);
    //     });
    // }

    // useEffect(() => {
    //     if (modal) {
    //         selectQuery('',res => {
    //             setOptions(res)
    //         })
    //     }
    // }, [modal]);

    /**
     * ========================================================================================================================
     * STOP!! You are not allow edit code below
     * ========================================================================================================================
     *
     * Author : Jati Pikukuh
     */

    const handleSubmit = async (e, err, value) => {
        console.log(value);
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
            showNotification("Berhasil menambah " + props.objectName, "success");
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
                <Form/>
            </CreateModal>
        </div>
    )
}