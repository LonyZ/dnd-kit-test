import React from "react";
import {useDroppable} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";

const ChildrenWrapper = ({items, location, parentIndex, id, className, isChildHovered, children}) => {
  const {setNodeRef, isOver} = useDroppable({
    id: id,
    data:{
      parentIndex: parentIndex,
      location: location,
    }
  });

  const style = {
    // transform: CSS.Transform.toString(transform),
    // transition,
    // opacity: isDragging ? 0.5 : 1,
    minHeight: (isOver || isChildHovered) ? '45px' : '4px',
    backgroundColor: (isOver || isChildHovered) ? 'blue' : 'initial',
    border: isOver ? '1px solid blue': 'unset',
    // padding:  isOver ? '10px 0px': 'unset'
  };

  if (!items) {
    return;
  }
  return (
    <SortableContext
      id={id}
      items={items.map(
        child => child.documentId)}
    >
      <div style={style} className={className} ref={setNodeRef}>
        {children}
      </div>

    </SortableContext>
  );
};

export default ChildrenWrapper;
