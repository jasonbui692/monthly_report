import React, { useMemo } from "react";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";

const MainView = props => {
  const memoData = useMemo(() => props.data);

  return (
    <DataTable
      title="Danh sách trong tháng"
      columns={props.headers}
      data={memoData}
      noDataComponent="Không có dữ liệu trong tháng này"
      defaultSortField="title"
    />
  );
};

const mapStateToProps = state => {
  return {
    headers: state.current.headers,
    data: state.current.eventData
  };
};

export default connect(mapStateToProps, null)(MainView);
