import React from "react";
import {useDroppable} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";

const ChildrenWrapper = ({items, id, className, children}) => {
  const {setNodeRef} = useDroppable({id});
  if (!items) {
    return;
  }
  return (
    <SortableContext
      id={id}
      items={items.map(
        child => `${id}-${child.documentId}`)}
    >
      <div className={className} ref={setNodeRef}>
        {children}
      </div>

    </SortableContext>
  );
};

export default ChildrenWrapper;
