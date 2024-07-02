import { useCallback, useRef, useEffect } from "react";
import { produce } from "immer";
import { cloneDeep } from "lodash-es";
import { DropResult } from "react-beautiful-dnd";
import { IListItem, ITasks } from "./types";
import { nanoid } from "nanoid";
import { useLocalStorageState } from "ahooks";
import dayjs from "dayjs";

/** 产生唯一ID */
const uid = (): string => nanoid(8);

/** 默认列名 */
const defaultColNames = ["待开始", "进行中", "测试中", "已上线"];

const listDefault: IListItem[] = defaultColNames.map((i) => ({
  id: uid(),
  title: i,
  data: [],
}));

const formatDate = (time: string[] | undefined) => {
  if (!time) return [];
  return time.map((i) => dayjs(i).format("YYYY-MM-DD"));
};

interface IStateMap {
  id?: string;
  index?: number;
  cId?: string;
  cIndex?: number;
}

const renderStateMap = (
  state: IListItem[] | undefined
): Map<string, IStateMap> => {
  const m = new Map();
  if (!state) return m;

  state.forEach((col: IListItem, cIndex: number) => {
    const { data, id, ...rest } = col;
    const cId = id;
    m.set(id, { index: cIndex, id, data: { id, ...rest } });
    data.forEach((task: ITasks, index: number) => {
      const { id } = task;
      m.set(id, { index, id, data: task, cId, cIndex });
    });
  });
  return m;
};

interface Actions {
  /** 拖拽移动 handler */
  move: (param: DropResult) => void;
  addTask: (obj: ITasks) => void;
  removeTask: (id: string) => void;
}

/**
 * [state, {move, addCol, updateCol, deleteCol, addItem, deleteItem, updateitem}] = useBoardState(defaultValue)
 */
const useBoardState = (): [IListItem[] | undefined, Actions] => {
  const [state, setState] = useLocalStorageState("personal-kanban", {
    defaultValue: listDefault,
  });
  const stateMap = useRef<Map<string, IStateMap>>(new Map());

  useEffect(() => {
    stateMap.current = renderStateMap(state);
  }, [state]);

  /** 移动 Task */
  const move = useCallback(
    (result: DropResult) => {
      if (!state) return;
      const { source, destination, draggableId } = result;

      if (!destination || !source) {
        return;
      }

      const { droppableId: startColId } = source;
      const { index: endIndex, droppableId: endColId } = destination || {};
      const startColIndex = state.findIndex((i) => i.id === startColId);
      const endColIndex = state.findIndex((i) => i.id === endColId);

      setState(
        produce((draft) => {
          if (!draft) return;
          const startData = cloneDeep(draft[startColIndex].data);

          const endData = cloneDeep(draft[endColIndex].data);
          const match = startData.find((i) => i.id === draggableId);
          const temp = startData.filter((i) => i.id !== draggableId);
          draft[startColIndex].data = temp;
          if (match && endIndex !== undefined) {
            const endNew = endData
              .filter((i) => i.id !== draggableId)
              .toSpliced(endIndex, 0, match);
            draft[endColIndex].data = endNew;
          }
        })
      );
    },
    [state, setState]
  );

  /** 新增&编辑 Task */
  const addTask = useCallback(
    (paylaod: ITasks) => {
      // 如果没有ID，需要赋值一个
      const isEdit = !!paylaod.id;
      const item = {
        ...paylaod,
        id: paylaod.id || uid(),
        time: formatDate(paylaod.time),
        createTime: isEdit
          ? paylaod.createTime
          : dayjs().format("YYYY-MM-DD HH:mm:ss"),
      };
      setState(
        produce((draft) => {
          const { colId } = item;
          if (draft) {
            if (isEdit) {
              const t = stateMap.current.get(item.id);
              if (
                typeof t?.index !== "undefined" &&
                typeof t?.cIndex !== "undefined"
              ) {
                draft[t.cIndex!].data[t.index] = item;
              }
            } else {
              const col = stateMap.current.get(colId);
              if (typeof col?.index !== "undefined") {
                draft[col.index].data.push(item);
              }
            }
          }
        })
      );
    },
    [setState]
  );

  /** 删除任务 */
  const removeTask = useCallback(
    (id: string) => {
      setState(
        produce((draft) => {
          const t = stateMap.current.get(id);
          if (draft && t?.cIndex !== undefined) {
            draft[t.cIndex!].data = draft[t.cIndex!].data.filter(
              (i) => i.id !== id
            );
          }
        })
      );
    },
    [setState]
  );

  return [state, { move, addTask, removeTask }];
};

export default useBoardState;
