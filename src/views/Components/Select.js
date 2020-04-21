import React, {useEffect, useState} from 'react';
import AsyncSelect from 'react-select/async';
import AsyncFetch from "./AsyncFetch";

function Select(props) {
    const [options, setOptions] = useState(props.options);

    const fetchData = (keyword = '', limit_ = 10, skip_ = 0) => {
        props.query(keyword, res => {
            setOptions(res);
        })
    };

    const filterColors = (inputValue) => {
        return options.filter(i =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const promiseOptions = inputValue => {
        fetchData(inputValue);
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(filterColors(inputValue));
            }, 1000);
        });
    }

    return (
        <AsyncSelect defaultOptions loadOptions={promiseOptions}/>
    );
}

export default Select;