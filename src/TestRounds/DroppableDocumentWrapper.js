import React from "react";
import {useDroppable} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";


const DroppableDocumentWrapper = ({documentsList, id, className, children}) => {
  const {setNodeRef} = useDroppable({id});

  return (
    <SortableContext
      id={id}
      items={documentsList}
    >
      <div className={className} ref={setNodeRef}>
        {children}
      </div>

    </SortableContext>
  );
};

export default DroppableDocumentWrapper;
