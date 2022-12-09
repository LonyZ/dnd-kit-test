import DndContextManager from "./DndContextManager";
import SortableRowContainer from "./SortableRowContainer";
import {useState} from "react";
import DroppableDocumentWrapper from "./DroppableDocumentWrapper";
import {initialList, WRAPPER_TYPES} from "../utils/utils";
import ChildrenWrapper from "./ChildrenWrapper";

const FileManager = () => {
  const [documentsList, setDocumentsList] = useState(initialList);

  const createChildrenRender = (document, arrayName) => {
    const children = document[arrayName] || [];
    return (
      <ChildrenWrapper
        className={'children-wrapper'}
        key={`${document.documentId}-${arrayName}`}
        id={`${document.documentId}-${arrayName}`}
        items={children}
      >
        {children.map(child =>
          <SortableRowContainer
            key={`${document.documentId}-${arrayName}-${child.documentId}`}
            id={`${document.documentId}-${arrayName}-${child.documentId}`}
            parentID={document.documentId}
            document={child}
          />
        )}
      </ChildrenWrapper>
    )
  }

  return (
    <div className="certification-documents-area">

      <DndContextManager
        documentsList={documentsList}
        setDocumentsList={setDocumentsList}
      >
        <DroppableDocumentWrapper
          className={"document-draggable-area"}
          id={"DocumentsWrapper"}
          documentsList={documentsList.map(doc => "ParentContainer-" + doc.documentId)}
        >
          {documentsList.map(document =>
            <div
              key={"document-container-" + document.documentId}
              className="document-container">
              {createChildrenRender(document, WRAPPER_TYPES.UPPER_CHILDREN)}
              <SortableRowContainer
                key={'parent' + document.documentId}
                id={"ParentContainer-" + document.documentId}
                document={document}
              />
              {createChildrenRender(document, WRAPPER_TYPES.LOWER_CHILDREN)}

            </div>)
          }
        </DroppableDocumentWrapper>

      </DndContextManager>
    </div>

  )
}

export default FileManager