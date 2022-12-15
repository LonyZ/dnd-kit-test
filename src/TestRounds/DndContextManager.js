import React, {useCallback, useEffect, useState} from "react";
import {
  closestCorners,
  DndContext, DragOverlay,
  KeyboardSensor,
  MouseSensor,
  pointerWithin, rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {arrayMove, sortableKeyboardCoordinates} from "@dnd-kit/sortable";
import {findDocumentIndexByID, WRAPPER_TYPES} from "../utils/utils";
import SortableRowChildren from "./SortableRowChildren";
import {customCollisionDetectionAlgorithm} from "./DndCustomAlgorithms";

const DndContextManager = ({documentsList, setDocumentsList, children}) => {

  const [activeDocument, setActiveDocument] = useState(null);
  const [dragOverDebouncer, setDragOverDebouncer] = useState()
  const [enableDragOperations, setEnableDragOperations] = useState(false)


  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  useEffect(()=>{
    console.log('EnableValue has changed to', enableDragOperations);
  },[enableDragOperations])
// --------------------------------- Event Listeners ---------------------------------
  const onMouseMove = useCallback((event) => {
    if (enableDragOperations !== true) {
      setEnableDragOperations(true);
    }
  }, []);
// ----------------------------- DND Utility Functions ---------------------------------
  const handleDragStart = ({active}) => {
    console.log('STARTNIG')
    console.log(active);
    const {documentId, location, parentID} = active.data.current;
    const dataSet = !parentID ? documentsList :
      documentsList[findDocumentIndexByID(documentsList, parentID)][location];

    const item = dataSet[findDocumentIndexByID(dataSet, documentId)] || null;
    item && (item.contextID = active.id)

    setActiveDocument(item);
    document.addEventListener('mousemove', onMouseMove);
    return;
  };

  const handleDragCancel = () => {
    console.log('drag cancel')
    document.removeEventListener('mousemove', onMouseMove);
    setActiveDocument(null);
  }

  const handleDragOver = ({active, over}) => {
    if(!enableDragOperations) return;
    debuggOnOver({active, over})
    if (dragOverDebouncer) {
      clearTimeout(dragOverDebouncer);
    }
    setDragOverDebouncer(setTimeout(() => {
      debuggOnOver({active, over})
      handleDndItems({active, over});
    }, 750));

  };

  const handleDragEnd = ({active, over}) => {
    if (dragOverDebouncer) {
      clearTimeout(dragOverDebouncer);
    }
    console.log('REMOVING')
    document.removeEventListener('mousemove', onMouseMove);
    // console.log(activeDocument)
    // setTimeout(()=> {
    handleDndItems({active, over});
    setActiveDocument(null);
    // }, 300);
    // handleDndItems({active, over});
  };

  const handleDndItems = ({active, over}) => {
    if (!over || active.id === over.id || !enableDragOperations) {
      return;
    }
    setEnableDragOperations(false);
    console.log('enabled' + enableDragOperations);
    let newData;
    const activeContainer = active.data.current?.sortable?.containerId || active.id;
    const overContainer = over.data.current?.sortable?.containerId || over.id;

    if (activeContainer === overContainer) {
      newData = updateSameArrayItems(activeContainer, active, over);
    } else {
      newData = moveBetweenContainers(active, over);
    }
    setDocumentsList(() => newData);
  }

  const updateSameArrayItems = (container, active, over) => {
    let dataArray = [...documentsList];
    const {location, parentID, sortable} = active.data.current;
    const {index: activeIndex} = sortable;
    if (parentID) {
      const parentIndex = findDocumentIndexByID(dataArray, parentID);
      dataArray[parentIndex][location] = arrayMove(
        dataArray[parentIndex][location],
        activeIndex,
        over.data.current?.sortable?.index || 0
      );
    } else {
      dataArray = arrayMove(
        dataArray,
        activeIndex,
        over.data.current?.sortable?.index || 0
      );
    }
    return dataArray;
  }

  const moveBetweenContainers = (active, over) => {
    let dataArray = [...documentsList];
    if (activeDocument.lower_children?.length > 0 || activeDocument.upper_children?.length > 0) {
      return dataArray;
    }
    const newItem = getActiveFromDocumentList(dataArray, active);
    if (over.id !== WRAPPER_TYPES.DOCUMENS_WRAPPER) {
      dataArray = insertItemAtIndex(dataArray, active, over, newItem);
      dataArray = removeItemAtIndex(dataArray, active);
    } else {
      // Todo Insert based of the position i.e parent index and such
    }

    return dataArray;
  };

  const getActiveFromDocumentList = (dataArray, active) => {
    const {documentId, location, parentID, sortable = {}} = active.data.current;
    const {index, containerId} = sortable;
    let item;
    if (parentID) {
      const parentIndex = findDocumentIndexByID(dataArray, parentID);
      const childIndex = index || findDocumentIndexByID(
        dataArray[parentIndex][location], documentId);
      item = dataArray[parentIndex][location][childIndex];
    } else {
      const docIndex = index || findDocumentIndexByID(
        dataArray, documentId);
      item = dataArray[docIndex];
    }
    return item;
  }

  const removeItemAtIndex = (dataArray, active) => {
    const {documentId, location, parentID, sortable} = active.data.current;
    if (!sortable) debugger;
    const {index, containerId} = sortable;

    if (parentID) {
      const parentIndex = findDocumentIndexByID(dataArray, parentID);
      const childIndex = index || findDocumentIndexByID(
        dataArray[parentIndex][location], documentId);
      dataArray[parentIndex][location].splice(childIndex, 1);

    } else {
      const docIndex = index || findDocumentIndexByID(
        dataArray, documentId);
      dataArray.splice(docIndex, 1);
    }
    return dataArray;
  }

  const insertItemAtIndex = (dataArray, active, over, item) => {
    const {
      documentId, location, parentID, sortable, parentIndex: containerIndex
    } = over.data.current;
    const index = sortable?.index >= 0 ? sortable.index : 0;

    if (parentID != undefined || containerIndex != undefined) {
      console.log('container insertion')
      const parentIndex = !isNaN(containerIndex) ?
        containerIndex :
        findDocumentIndexByID(dataArray, parentID);
      dataArray[parentIndex][location] = dataArray[parentIndex][location] || []
      const tempData = dataArray[parentIndex][location];

      const childIndex = !isNaN(index) ?
        index :
        (documentId ?
            findDocumentIndexByID(dataArray[parentIndex][location], documentId) :
            getIndexPositionFromPosition(tempData, active.rect, over.rect)
        );

      tempData.splice(childIndex, 0, item);
    } else if (index >= 0) {
      console.log("normal insertion")
      dataArray.splice(index, 0, item);
      console.log(dataArray);
    } else {
      console.log('something is beyond fucked up')
      debugger;
    }

    return dataArray;
  }

  const getIndexPositionFromPosition = (array, activeRec, overRec) => {
    const overMiddlePoint = overRec.top + (overRec.height / 2);
    return activeRec.current.translated.top > overMiddlePoint ? 0 : array.length;
  }

  const debuggOnOver = ({active, over}) => {
    console.log('Selected item: \n', active);
    console.log('Target Item: \n', over);
    console.log(activeDocument);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetectionAlgorithm }
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
      // onDragOver={debuggOnOver}
      onDragEnd={handleDragEnd}
    >

      {children}
      <DragOverlay style={{position: 'fixed'}}>{activeDocument ?
        <SortableRowChildren document={activeDocument} id={"copy" - activeDocument.id} dragOverlay>
          <div className="document">{activeDocument.name}</div>
        </SortableRowChildren> : null}
      </DragOverlay>

    </DndContext>
  )
}

export default DndContextManager