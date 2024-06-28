import { useCallback, useState } from "react";
import BoardHeader from "./header";
import Item from "./item";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useBoardState from "./useBoardState";
import { PlusOutlined } from "@ant-design/icons";
import AddItem from "./add-task-modal";
import { ITasks } from "./types";
import "./index.css";

const Board = () => {
  const [list, { move, addTask, removeTask }] = useBoardState();
  const [modalProps, setModalProps] = useState({ open: false, task: {} });

  const handleAddTask = useCallback((colId: string) => {
    setModalProps({ open: true, task: { colId } });
  }, []);

  const handleEditTask = useCallback((payload: ITasks) => {
    setModalProps({ open: true, task: payload });
  }, []);

  const handleSaveTask = (paylaod: ITasks) => {
    addTask(paylaod);
    setModalProps((s) => ({ ...s, open: false }));
  };

  return (
    <div className="my-board dark:bg-slate-800">
      <BoardHeader />
      <div className="board-container flex gap-2 overflow-x-auto">
        <DragDropContext onDragEnd={move}>
          {list.map((i) => (
            <div
              key={i.id}
              className="flex flex-col board-col bg-slate-100 dark:bg-slate-900"
            >
              <div className="board-col-head pb-2.5 flex justify-between">
                <div className="text-lg dark:text-white">{i.title}</div>
                <div>
                  <span
                    className="icon-button"
                    onClick={() => handleAddTask(i.id)}
                  >
                    <PlusOutlined />
                  </span>
                </div>
              </div>
              <Droppable droppableId={i.id} key={i.id}>
                {(provided) => (
                  <div
                    className="flex-1 overflow-auto"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="board-col-body ">
                      {i.data.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="mb-2 rounded bg-white dark:bg-slate-800"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onDoubleClick={() => handleEditTask(item)}
                            >
                              <Item {...item} onRemove={removeTask} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>

      <AddItem
        {...modalProps}
        onCancel={() => setModalProps((s) => ({ ...s, open: false }))}
        onOk={handleSaveTask}
      />
    </div>
  );
};

export default Board;
