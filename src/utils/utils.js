import {arrayMove as dndKitArrayMove} from "@dnd-kit/sortable";

export const findDocumentIndex = (documentsList, id) => {
  return documentsList.findIndex(doc => doc.documentId === +id);
}

export const removeAtIndex = (array, index) => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

export const insertAtIndex = (array, index, item) => {
  return [...array.slice(0, index), item, ...array.slice(index)];
};

export const arrayMove = (array, oldIndex, newIndex) => {
  return dndKitArrayMove(array, oldIndex, newIndex);
};

export const WRAPPER_TYPES = {
  DOCUMENS_WRAPPER: 'DocumentsWrapper',
  LOWER_CHILDREN: 'lowerChildren',
  UPPER_CHILDREN: 'upperChildren'

}

export const initialList = [
  {
    documentId: 1,
    name: 'Luis',
    upperChildren: [
      {
        documentId: 4,
        name: 'Django',
      },
      {
        documentId: 5,
        name: 'Python',
      },
      {
        documentId: 6,
        name: 'React',
      }
    ]
  },
  {
    documentId: 2,
    name: 'Diego',
    lowerChildren: [
      {
        documentId: 7,
        name: 'Django',
      },
      {
        documentId: 8,
        name: 'Python',
      },
      {
        documentId: 9,
        name: 'React',
      }
    ]
  },
  {
    documentId: 3,
    name: 'Javier'
  },
]