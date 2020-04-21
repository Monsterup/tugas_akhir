import React, {useState} from "react";
import {Button, Col, Row} from "reactstrap";
import AvInput from "../Components/Input";
import CreateModal from "../Components/CreateModal";
import {AvField} from 'availity-reactstrap-validation';
import axios from "../../axios";
import {showNotification} from "../Components/Notification";
import auth from "../../auth";

export default function CreateFeed(props) {
    const [modal, setModal] = useState(false);

    // option jenis pakan
    const arrType = ['starter', 'growing'];
    //option tahun produksi
    const year = [];
    for (let i = new Date().getFullYear(); i > 2015; i--) year.push(i);

    // form create feed
    const Form = () => {
        return (<Row>
            <Col md="6">
                <AvInput label="Kode" minLength="3"/>
            </Col>
            <Col md="6">
                <AvInput label="Perusahaan"/>
            </Col>
            <Col md="6">
                <AvField required={false} type="select" name="jenis_pakan" label="Jenis Pakan">
                    <option></option>
                    {arrType.map((data, key) => {
                        return (<option key={key} value={data}>{data}</option>)
                    })}
                </AvField>
            </Col>
            <Col md="6">
                <AvField required={false} type="select" name="tahun_produksi" label="Tahun Produksi">
                    <option></option>
                    {year.map((data, key) => {
                        return (<option key={key} value={data}>{data}</option>)
                    })}
                </AvField>
            </Col>
            <Col md="12">
                <AvInput required={false} type="textarea" label="Keterangan"/>
            </Col>
        </Row>)
    }

    // query create
    const queryCreate = (value) => {
        return {
            query: `mutation{
                      createFeed(feedInput: {
                        code : "${value.kode}"
                        producer : "${value.perusahaan}"
                        type : "${value.jenis_pakan}"
                        year : "${value.tahun_produksi}"
                        otherInformation : "${value.keterangan}"
                      }){
                        code
                        producer
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
                <Form/>
            </CreateModal>
        </div>
    )
}