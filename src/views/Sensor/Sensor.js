import React, {Component} from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Table
} from 'reactstrap';
import {AppSwitch} from "@coreui/react";

class Sensor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sensors: [
                {
                    sensor_id: 1,
                    device_id: 12312,
                    lokasi: 'Kandang Fapet',
                    jenis_sensor: "Suhu",
                    nilai_sensor: "32",
                    satuan: "Celcius",
                    status : false
                },
                {
                    sensor_id: 1,
                    device_id: 12312,
                    lokasi: 'Kandang Fapet',
                    jenis_sensor: "Suhu",
                    nilai_sensor: "32",
                    satuan: "Celcius",
                    status : true
                },{
                    sensor_id: 1,
                    device_id: 12312,
                    lokasi: 'Kandang Fapet',
                    jenis_sensor: "Suhu",
                    nilai_sensor: "32",
                    satuan: "Celcius",
                    status : true
                }
            ]
        }
    }
    render() {
        function changeStatus(key) {
            console.log("clicked "+key);
        }
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" lg="12" md="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Tabel Sensor
                            </CardHeader>
                            <CardBody>
                                <Table responsive>
                                    <thead>
                                    <tr>
                                        <th>ID Sensor</th>
                                        <th>ID Device</th>
                                        <th>Lokasi</th>
                                        <th>Jenis Sensor</th>
                                        <th>Nilai</th>
                                        <th>Set / Unset</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.sensors.map((item, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>{item.sensor_id}</td>
                                                <td>{item.device_id}</td>
                                                <td>{item.lokasi}</td>
                                                <td>{item.jenis_sensor}</td>
                                                <td>{item.nilai_sensor}{item.jenis_sensor === 'Suhu' ? '\u00b0' : '' } {item.satuan}</td>
                                                <td>
                                                    <AppSwitch onChange={() => changeStatus(key)} className={'mx-1'} variant={'pill'} color={'success'} outline={'alt'} checked={item.status} label dataOn={'\u2713'} dataOff={'\u2715'} />
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Sensor;
