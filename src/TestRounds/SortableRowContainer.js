import React from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

const SortableRowContainer = ({document, id, parentID=null}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data:{
      documentId: document.documentId,
      parentID: parentID
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div className="document-container"
         style={style}
         ref={setNodeRef}
         {...attributes}
         {...listeners}
    >
      {document.name}

    </div>
  );
};

export default SortableRowContainer;
