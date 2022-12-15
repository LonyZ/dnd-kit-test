import React, {useEffect} from "react";
import {useSortable} from "@dnd-kit/sortable";

const SortableRowChildren = ({
  document, id, className, parentID = null, location = null, children,
  setIsChildHovered
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isOver,
    transition,
    isDragging,

  } = useSortable({
    id: id,
    data: {
      documentId: document.documentId,
      parentID: parentID,
      location: location
    }
  });
  useEffect(()=>{
    setIsChildHovered && setIsChildHovered(isOver);
    console.log('Child item is hovered', isOver);
  },[isOver])

  const style = {
    // transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    borderTop: isOver ? '1px solid red' : 'unset'
  };

  return (
    <div className={className}
         style={style}
         ref={setNodeRef}
         {...attributes}
         {...listeners}
    >
      {children}
    </div>
  );
};

export default SortableRowChildren;
