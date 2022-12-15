import {arrayMove as dndKitArrayMove} from "@dnd-kit/sortable";

export const findDocumentIndexByID = (documentsList, id) => {
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
  LOWER_CHILDREN: 'lower_children',
  UPPER_CHILDREN: 'upper_children'

}

export const initialList = [
  {
    documentId: 1,
    name: 'Luis',
    upper_children: [
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
    lower_children: [
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
    name: 'Javier',
    upper_children: [
      {
        documentId: 10,
        name: 'Django',
      },
      {
        documentId: 11,
        name: 'Python',
      },
      {
        documentId: 12,
        name: 'React',
      }
    ],
    lower_children: [
      {
        documentId: 13,
        name: 'Django',
      },
      {
        documentId: 14,
        name: 'Python',
      },
      {
        documentId: 15,
        name: 'React',
      }
    ]
  },
]