import React, {useState} from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {arrayMove, sortableKeyboardCoordinates} from "@dnd-kit/sortable";
import {findDocumentIndex, WRAPPER_TYPES} from "../utils/utils";

const DndContextManager = ({documentsList, setDocumentsList, children}) => {

  const [activeDocument, setActiveDocument] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = ({active}) => setActiveDocument(active.id);

  const handleDragCancel = () => setActiveDocument(null);

  const handleDragOver = ({active, over}) => {
    const overId = over?.id;
    const existsSortable = (active.data.current?.sortable && over.data.current?.sortable) || null;
    if (!existsSortable) debugger;
    if (!overId || !existsSortable) {
      return;
    }

    const activeContainer = active.data.current.sortable.containerId || active.id;
    const overContainer = over.data.current?.sortable.containerId || over.id;
    const activeIndex = active.data.current.sortable.index;
    const overIndex = over.data.current.sortable.index;
    let newData;
    if (activeContainer === overContainer) {
      newData = updateSameArrayItems(activeContainer, activeIndex, overIndex);
    } else {
      newData =
        moveBetweenContainers(activeContainer, overContainer, activeIndex, overIndex, active)
    }

    setActiveDocument(null);
    setDocumentsList(() => newData);
  };

  const handleDragEnd = ({active, over}) => {
    if (!over || !over.data.current || active.id === over.id) {
      setActiveDocument(null);
      return;
    }
    const activeContainer = active.data.current?.sortable.containerId || active.id;
    const overContainer = over.data.current?.sortable.containerId || over.id;
    const activeIndex = active.data.current.sortable.index;
    const overIndex = over.data.current.sortable.index;
    let newData;
    if (activeContainer === overContainer) {
      newData = updateSameArrayItems(activeContainer, activeIndex, overIndex);
    } else {
      newData =
        moveBetweenContainers(activeContainer, overContainer, activeIndex, overIndex, active)
    }

    setActiveDocument(null);
    setDocumentsList(() => newData);
  };

  const updateSameArrayItems = (container, activeIndex, overIndex) => {
    let dataArray = [...documentsList];
    switch (container) {
      case WRAPPER_TYPES.DOCUMENS_WRAPPER:
        dataArray = arrayMove(
          dataArray,
          activeIndex,
          overIndex
        );
        break;
      default:
        const sources = container.split('-');
        const index = findDocumentIndex(dataArray, sources[0]);
        if (index === -1) {
          return
        }
        const targetArray = sources[1];
        dataArray[index][targetArray] = arrayMove(
          dataArray[index][targetArray],
          activeIndex,
          overIndex
        );
        break;
    }
    return dataArray;
  }

  const moveBetweenContainers = (activeContainer, overContainer, activeIndex, overIndex) => {
    let dataArray = [...documentsList];
    const {newArray, removedItem} = removeItemAtIndex(dataArray, activeContainer, activeIndex);
    dataArray = newArray
    dataArray = InsertItemAtIndex(dataArray, overContainer, overIndex, removedItem)
    return dataArray;
  };

  const removeItemAtIndex = (dataArray, container, index) => {
    let removedItem;
    switch (container) {
      case WRAPPER_TYPES.DOCUMENS_WRAPPER:
        removedItem = dataArray[index];
        dataArray = [...dataArray.slice(0, index), ...dataArray.slice(index + 1)]
        break;
      default:
        const sources = container.split('-');
        const itemIndex = findDocumentIndex(dataArray, sources[0]);
        if (itemIndex === -1) {
          return
        }
        const targetArray = sources[1];
        removedItem = dataArray[itemIndex][targetArray][index];
        dataArray[itemIndex][targetArray] = [
          ...dataArray[itemIndex][targetArray].slice(0, index),
          ...dataArray[itemIndex][targetArray].slice(index + 1)]
        break;
    }
    return {newArray: dataArray, removedItem};
  }

  const InsertItemAtIndex = (dataArray, container, index, item) => {
    switch (container) {
      case WRAPPER_TYPES.DOCUMENS_WRAPPER:
        dataArray.splice(index, 0, item);
        break;
      default:
        const sources = container.split('-');
        const itemIndex = findDocumentIndex(dataArray, sources[0]);
        if (itemIndex === -1) {
          return
        }
        const targetArray = sources[1];
        const tempData = dataArray[itemIndex][targetArray];
        tempData.splice(index, 0, item);
        dataArray[itemIndex][targetArray] = tempData;

        break;

    }
    return dataArray;
  }

  const debuggOnOver = ({active, over}) => {
    console.log('Selected item: \n', active);
    console.log('Target Item: \n', over);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      // onDragOver={handleDragOver}
      onDragOver={debuggOnOver}
      onDragEnd={handleDragEnd}
    >
      {children}
      {/*</SortableContext>*/}
      {/*<DragOverlay>{activeDocument ? <SortableRowContainer id={activeDocument} dragOverlay/> : null}</DragOverlay>*/}

    </DndContext>
  )
}

export default DndContextManager