import { useMemo } from "react";
import { ITasks } from "../types";
import {
  LinkOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { formatDate } from "../utils";

interface ICard extends ITasks {
  onRemove: (id: string) => void;
}

const ItemCard = ({
  id,
  title,
  createTime,
  remark,
  link,
  time,
  onRemove,
}: ICard) => {
  const dateRange = useMemo(() => {
    if (!time) return "";
    return time.map((i) => formatDate(i)).join("-");
  }, [time]);

  return (
    <div className="px-3 py-3 board-item-card">
      <div className="font-medium dark:text-white">{title}</div>
      {remark !== "" && (
        <div className="text-sm mt-2 text-slate-500 dark:text-slate-400 board-item-card-remark">
          {remark}
        </div>
      )}
      <div className="mt-2 text-slate-500 dark:text-slate-400 text-sm flex justify-between">
        <div className="flex gap-2.5">
          <span title={createTime}>创建于{formatDate(createTime)}</span>
          {dateRange && (
            <span>
              <CalendarOutlined className="mr-1" />
              {dateRange}
            </span>
          )}
          {link !== "" && (
            <a href={link} target="_blank" title={link}>
              <LinkOutlined />
            </a>
          )}
        </div>
        <div>
          {/* <span className="inline-block px-1 hover:bg-gray-200 transition rounded-sm"> */}
          <span className="icon-button" onClick={() => onRemove(id)}>
            <DeleteOutlined />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
