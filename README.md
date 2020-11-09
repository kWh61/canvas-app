# Canvas App by Kehan Wang

## Set Up

### Install all dependencies:

```bash
yarn install
```

or 

```bash
npm install
```

### Start the program:

```bash
yarn start
```

or 

```bash
npm start
```

## Data Structure

The key part of the data structure of this canvas app is having a "CanvasData" Object. It holds the current operation during the mouseDown - mouseMove - mouseUp cycle, the collection all previous operations and a "pointer" to the latest operation. The second and third attributes are for the undo-redo functionality, which I will talk about in the next section.

The current operation consists of two types: "PointOperation" and "PathOperation". The "rectangle" and "line" modes use PointOperation and the "pen" mode uses PathOperation. This is because we need to keep track of all position data during the mouseMove phrase for the "pen" mode, but we don't need to do this for the other two modes.

For PointOperation, I keep track of its starting point as well as a snapshot image of the state before the operation to clear the effects during mouseMove. For PathOperation, I simply store all the position data in an array.

To sum up, here is a breakdown of the core of "CanvasData":

- CanvasData
  - currentOperation
    - type
    - PointOperation
      - start
      - end
      - snapshot (cleared afterwards for performance)
    - PathOperation
      - positions
  - operationPointer
  - operations

## Undo-Redo Functionality

I implemented the undo-redo functionality by storing the history of all operations as well as a pointer to the latest operation, which can be explained by the following rules:

- If the user undos, move the pointer backward and re-draw all previous operations.
- If the user redos, move the pointer forward and draw the new operation.
- If the user undos then creates a brand-new operation, remove all operations after the pointer.

I chose this approach because it is both performance and memory friendly. Although there may exist a better approach, which "reverses" a user operation and thus eliminating the need of redrawing all previous operations, it could be unstable and cause errors (e.g. erasing parts of overlapping lines).

## List of Outside Sources

- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes)
- [Drawing App Example](http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/)
- [Color Combination](https://coolors.co/)
- Also for some small issues that I ran into, I referenced solutions on StackOverflow.

## Problems

- How to clear the previous rectangle during onMouseMove?
  - I tried clearRect() but did not work. This might be because the border is not accounted for.
  - I solved this problem by restoring to the snapshot before the operation.
- How to avoid canceling out shapes with undoing or redoing?
  - If we simply reverse an operation for undoing
    - Observed behavior: the overlapping part of the two lines is missing
    - Expected behavior: the other line should remain intact
  - I solved this problem by redrawing all previous operations.
- How to better structure all the logic to make this app maintainable?
  - There are three modes and three kinds of mouse behaviors, so it would be messy if simply use if-else or switch statements.
  - I used object literals for mapping of different functions.
  - However, this results in some duplicate code.
- Just a quick note, the errors in the console is related to Antd, a third party library I was using. The issue can be found [here](https://github.com/ant-design/ant-design/issues/22493).

## End Note

This is a really fun assignment and a great learning opportunity! Please let me know if you have any questions/comments/feedbacks. Hope to hear from you soon :)