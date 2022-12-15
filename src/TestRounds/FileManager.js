import DndContextManager from "./DndContextManager";
import SortableRowContainer from "./SortableRowContainer";
import {useState} from "react";
import DroppableDocumentWrapper from "./DroppableDocumentWrapper";
import {initialList, WRAPPER_TYPES} from "../utils/utils";
import ChildrenWrapper from "./ChildrenWrapper";

const FileManager = () => {
  const [documentsList, setDocumentsList] = useState(initialList);

  return (
    <div className="certification-documents-area">

      <DndContextManager
        documentsList={documentsList}
        setDocumentsList={setDocumentsList}
      >
        <DroppableDocumentWrapper
          className={"document-draggable-area"}
          id={"DocumentsWrapper"}
          documentsList={documentsList.map(doc => doc.documentId)}
        >
          {documentsList.map((document, index) =>
            <div
              key={"document-container-" + document.documentId}
              className="documents-container"
            >
              <SortableRowContainer
                key={'parent' + document.documentId}
                id={document.documentId}
                document={document}
                index={index}
              />

            </div>)
          }
        </DroppableDocumentWrapper>

      </DndContextManager>
    </div>

  )
}

export default FileManager