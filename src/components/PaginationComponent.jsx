import React from 'react'
import Pagination  from 'react-bootstrap/Pagination'

const PaginationComponent = ({totalPages, currentPage,onPageChange}) => {
  let items=[];
  for(let number=1;number<=4;number++){
    items.push(
      <Pagination.Item key={number} active={number===currentPage} onClick={() => onPageChange(number)}>
        {number}
      </Pagination.Item>
    );
  }
  
  return (
    <Pagination>
      
      <Pagination.First onClick={() => onPageChange(1)}/>
      <Pagination.Prev onClick={() => onPageChange(currentPage-1)}/>
      {items}
      {totalPages>=4 && <Pagination.Ellipsis />}
      <Pagination.Next onClick={()=>onPageChange(currentPage+1)}/>
      <Pagination.Last onClick={()=>onPageChange(totalPages)}/>
      </Pagination>
  )
}

export default PaginationComponent