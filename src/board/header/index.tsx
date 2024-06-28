import { TableOutlined } from "@ant-design/icons";

const BoardHeader = () => {
  return (
    <div className="board-header">
      <div className="font-medium flex items-center text-md gap-3 pl-2">
        <TableOutlined style={{ fontSize: "22px" }} />
        <h2>易用看板</h2>
      </div>
    </div>
  );
};

export default BoardHeader;
