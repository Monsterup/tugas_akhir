import React, {useEffect, useRef, useState} from 'react';
import Loader from 'react-loader-spinner';
import {showNotification} from "../Components/Notification"
import SwalDelete from "../Components/SwalDelete";
import Paginate from "../Components/Paginate";
import CreateFeed from "./CreateFeed";
import UpdateFeed from "./UpdateFeed";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Table,
    Button,
    Input
} from 'reactstrap';
import AsyncFetch from "../Components/AsyncFetch";

function Feed() {
    const [limit, setLimit] = useState(10);
    const [skip, setSkip] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [swal, setSwal] = useState(false);
    const [objects, setObjects] = useState([]);
    const [object, setObject] = useState(null);
    const [deleteFeed, setDeleteFeed] = useState(null);
    const [updateModal, setUpdateModal] = useState(false);
    const ref = useRef('');
    const number = useRef(10);
    const [pagination, setPagination] = useState([]);
    const [paginationActive, setPaginationActive] = useState(1);
    const [maxPage, setMaxPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const option = [10, 25, 50, 100];

    // setting nama menu
    const headings = ['Kode', 'Perusahaan Pakan', 'Tahun Produksi', 'Jenis'];
    const columns = ['code', 'producer', 'year', 'type'];

    const objectName = 'Master Pakan';
    const queryDelete = `mutation{
                              deleteFeed(_id : "${deleteFeed}"){
                                deleted
                              }
                            }
                        `;

    const fetchData = (keyword = '', limit_ = limit, skip_ = skip, callback) => {
        const q = `query{
                      feeds(keyword : "${keyword}", limit : ${limit_}, skip : ${skip_}){
                        totalCount
                        feeds {
                            _id
                            code
                            producer
                            type
                            year
                        }
                      }
                    }
                `;
        AsyncFetch(q, (res) => {
            setLoading(false);
            setObjects(res.data.data.feeds.feeds);
            const page = Math.ceil(parseInt(res.data.data.feeds.totalCount) / limit_);
            callback(page);
        })
    };

    const Modal = () => {
        return (<div>
            <CreateFeed objectName={objectName} onSuccess={() => fetchData(keyword, limit, skip, () => {
            })}/>
            {updateModal &&
            <UpdateFeed  objectName={objectName} onSuccess={updateSuccess} data={object} modal={updateModal}
                        onCancel={() => setUpdateModal(false)}/>}
        </div>)
    }

    const showUpdateDialog = (_id) => {
        const q = `query{
                          feed(_id : "${_id}"){
                            _id
                            code
                            producer
                            type
                            year
                            otherInformation
                          }
                        }
                `;

        AsyncFetch(q, (res) => {
            setObject(res.data.data.feed);
        });
    };

    /**
     * ========================================================================================================================
     * STOP!! You are not allow edit code below
     * ========================================================================================================================
     *
     * Author : Jati Pikukuh
     */

    const renderData = (feeds) => {
        return feeds.map(function (row, row_index) {
            row.index = row_index;
            return (
                <tr key={row_index}>
                    {
                        columns.map((column, index) => (
                            <td key={column + index}>
                                {row[column]}
                            </td>
                        ))
                    }
                    <td>
                        <Button color="primary" size="sm"
                                onClick={() => showUpdateDialog(row._id)}
                                className="btn-square">
                            <i className="fa fa-pencil"></i>&nbsp;Edit
                        </Button>
                        &nbsp;&nbsp;
                        <Button color="danger" size="sm" onClick={() => showSwal(row._id)}
                                className="btn-square">
                            <i className="fa fa-trash"></i>&nbsp;Hapus
                        </Button>
                    </td>
                </tr>
            )
        });
    }

    useEffect(() => {
        fetchData(keyword, limit, skip, (page) => {
            setMaxPage(page);
            if (page > 5) {
                setPagination([1, 2, 3, '...', page]);
            } else {
                setPagination(Array.from(Array(page).keys()).map(x => ++x));
            }
        });
    }, []);

    useEffect(() => {
        return () => {
            setUpdateModal(true)
        }
    }, [object]);

    const updateSuccess = () => {
        setUpdateModal(false);
        fetchData(keyword, limit, skip, () => {
        });
    };

    const showSwal = (_id) => {
        setSwal(true);
        setDeleteFeed(_id);
    }
    const confirmDelete = () => {
        AsyncFetch(queryDelete, (res) => {
            if (res) {
                setSwal(false);
                showNotification("Berhasil menghapus Data " + objectName, "success");
                fetchData(keyword, limit, skip, () => {
                });
            }
        });
    };

    const handleChangePagination = (target) => {
        fetchData(keyword, 10, (target - 1) * 10, () => {
        });
    };

    const handleSearchChange = (e) => {
        setKeyword(e.target.value);
        fetchData(e.target.value, limit, skip, (page) => {
            setMaxPage(page);
            if (page > 5) {
                ref.current.handleSearch([1, 2, 3, '...', page], page);
            } else {
                ref.current.handleSearch(Array.from(Array(page).keys()).map(x => ++x), page);
            }
        });
        setPaginationActive(1);
    };

    const handleChangeNumber = () => {
        setLimit(number.current.value);
        fetchData(keyword, number.current.value, skip, (page) => {
            setMaxPage(page);
            if (page > 5) {
                ref.current.handleSearch([1, 2, 3, '...', page], page);
            } else {
                ref.current.handleSearch(Array.from(Array(page).keys()).map(x => ++x), page);
            }
        });
        setPaginationActive(1);
    }

    return (
        <div className="animated fadeIn">
            <Row>
                <Col xs="12" lg="12" md="12">
                    <Modal/>
                    <br/>
                    <Card>
                        <CardHeader>
                            <i className="fa fa-align-justify"></i> Tabel {objectName}
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md="11">
                                    <Input onChange={(e) => handleSearchChange(e)} type="text" id="search"
                                           placeholder="Cari..."/>
                                </Col>
                                <Col md="1">
                                    <Input onChange={() => {
                                        handleChangeNumber()
                                    }} type="select" name="number" innerRef={number}>
                                        
                                        {option.map((data, key) => {
                                            return (
                                                <option key={key} value={data}>{data}</option>
                                            )
                                        })}
                                    </Input>
                                </Col>
                            </Row>
                            <br/>
                            <Table responsive>
                                <thead>
                                <tr>
                                    {headings.map((heading, key) => {
                                        return (
                                            <th key={key}>{heading}</th>
                                        )
                                    })}
                                    <th>Pilihan</th>
                                </tr>
                                </thead>
                                <tbody>
                                {loading ? <tr><th colSpan="5"><Loader type="Oval" className="mt-4 justify-content-center d-flex"color="#000000"/></th></tr> : renderData(objects)}
                                </tbody>
                            </Table>
                            {pagination.length > 1 &&
                            <Paginate ref={ref} maxPage={maxPage} paginationActive={paginationActive}
                                      pagination={pagination} onChange={(target) => handleChangePagination(target)}/>
                            }
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <SwalDelete show={swal} onConfirm={confirmDelete} onCancel={() => setSwal(false)}/>
        </div>
    );
}

export default Feed;
