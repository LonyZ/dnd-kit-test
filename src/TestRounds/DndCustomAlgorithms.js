import {closestCorners, pointerWithin, rectIntersection} from "@dnd-kit/core";
import {WRAPPER_TYPES} from "../utils/utils";

export const customCollisionDetectionAlgorithm =({
  droppableContainers,
  active,
  ...args
}) => {
  const pointerCollision = pointerWithin({
    ...args,
    droppableContainers: droppableContainers.filter(({id}) =>
      id !== WRAPPER_TYPES.DOCUMENS_WRAPPER
      && id !== active.id)
  })

  if (pointerCollision.length > 0) {
    return pointerCollision;
  }

  const rectIntersectionCollisions = rectIntersection({
    ...args,
    droppableContainers: droppableContainers.filter(({id}) => id !== WRAPPER_TYPES.DOCUMENS_WRAPPER)
  });

  if (rectIntersectionCollisions.length > 0) {
    return rectIntersectionCollisions;
  }

  // Compute other collisions
  return closestCorners({
    ...args,
    droppableContainers: droppableContainers.filter(({id}) => id !== WRAPPER_TYPES.DOCUMENS_WRAPPER)
  });
};