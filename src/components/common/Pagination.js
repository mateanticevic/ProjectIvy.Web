import React from 'react';
import BootstrapPagination from 'react-bootstrap/lib/Pagination';

const Pagination = (props) => {

    console.log(props);

    const showPages = 5;
    
    const startPage = props.page > 2 ? (props.page + showPages > props.pages ? (props.pages - showPages < 0 ? 1 : props.pages - showPages + 1) :  props.page - 2) : 1;

    const endPage = startPage + showPages > props.pages ? props.pages : startPage + showPages - 1;

    const items = _.range(startPage, endPage + 1).map(item =>
        <BootstrapPagination.Item active={item === props.page} onClick={page => props.onPageChange({ page: item })}>{item}</BootstrapPagination.Item>);

    return (
        <BootstrapPagination>
            {items}
        </BootstrapPagination>
    );
};

export default Pagination;