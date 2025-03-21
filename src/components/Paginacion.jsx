import React from "react";
import ReactPaginate from "react-paginate";
import "../style/global.css";

function Paginacion({ totalPaginas, onPageChange, paginaActual }) {
  return (
    <div className="pagination-container">
      <ReactPaginate
        previousLabel={"⬅ Anterior"}
        nextLabel={"Siguiente ➡"}
        breakLabel={"..."}
        pageCount={totalPaginas}
        forcePage={paginaActual - 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={(e) => onPageChange(e.selected + 1)}
        containerClassName={"pagination"}
        activeClassName={"active"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"prev-item"}
        previousLinkClassName={"prev-link"}
        nextClassName={"next-item"}
        nextLinkClassName={"next-link"}
        breakClassName={"break-item"}
        breakLinkClassName={"break-link"}
      />
    </div>
  );
}

export default Paginacion;
