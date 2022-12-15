import React, {useState} from "react";
import ChildrenWrapper from "./ChildrenWrapper";
import {WRAPPER_TYPES} from "../utils/utils";
import SortableRowChildren from "./SortableRowChildren";
import {useSortable} from "@dnd-kit/sortable";
// import {CSS} from "@dnd-kit/utilities";

const SortableRowContainer = ({document, id, index}) => {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: id,
    // index: index,
    data: {
      documentId: document.documentId,
      parentID: null,
      location: null,
      index: index,

    }
  });

  const [isUpperChildHovered, setIsUpperChildHovered] = useState(false);
  const [isLowerChildHovered, setIsLowerChildHovered] = useState(false);

  const style = {
    // transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    borderTop: isOver ? '2px solid green' : 'unset'
    // position: 'static !important'
  };

  const createChildrenRender = (document, arrayName, isChildHovered, setIsChildHovered) => {
    if (isDragging) return;
    const children = document[arrayName] || [];
    const enableOutline = () => {
      return isOver ? ' enabled-outline' : '';
    }
    return (
      <ChildrenWrapper
        className={`children-wrapper${enableOutline()}`}
        key={`${document.documentId}-${arrayName}`}
        id={`${document.documentId}-${arrayName}`}
        location={arrayName}
        items={children}
        parentIndex={index}
        isChildHovered={isChildHovered}
      >
        {children.map(child =>
          <SortableRowChildren
            key={`${document.documentId}-${arrayName}-${child.documentId}`}
            id={child.documentId}
            parentID={document.documentId}
            location={arrayName}
            setIsChildHovered={setIsChildHovered}
            document={child}
            className={'document'}
          >
            <div>
              child- {child.name}
            </div>
          </SortableRowChildren>
        )}
      </ChildrenWrapper>
    )
  }

  return (

    <div
      className="documents-container"
      ref={setNodeRef}
      id={`parent-doc-${document.documentId}`}
      style={style}

    >
      {createChildrenRender(
        document, WRAPPER_TYPES.UPPER_CHILDREN, isLowerChildHovered, setIsLowerChildHovered)}
      <div
        {...attributes}
        {...listeners}
        className="document">
        <span>{index}.- Parent - </span>{document.name}
      </div>
      {createChildrenRender(
        document, WRAPPER_TYPES.LOWER_CHILDREN, isUpperChildHovered, setIsUpperChildHovered)}

    </div>
  );
};

export default SortableRowContainer;
