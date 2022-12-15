import React from "react";
import {useDroppable} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";


const DroppableDocumentWrapper = ({documentsList, id, className, children}) => {
  const {setNodeRef, isOver} = useDroppable({
    id:id,
    data:{
    }
  });

  const style = {
    // transform: CSS.Transform.toString(transform),
    // transition,
    // opacity: isDragging ? 0.5 : 1,
    border: isOver ? '1px solid purple' : 'unset'
  };

  return (
    <SortableContext
      id={id}
      items={documentsList}
    >
      <div style={style} className={className} ref={setNodeRef}>
        {children}
      </div>

    </SortableContext>
  );
};

export default DroppableDocumentWrapper;
