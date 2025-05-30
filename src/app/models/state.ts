// import { fabric } from 'fabric';
//
// export class StateManager {
//   private currentState: string;
//   private stateStack: string[]; //Undo stack
//   private redoStack: string[]; //Redo stack
//   private locked: boolean; //Determines if the state can currently be saved.
//   private maxCount: number = 100; //We keep 100 items in the stacks at any time.
//
//   constructor(private canvas: fabric.Canvas) {
//     this.currentState = JSON.stringify(this.canvas.toDatalessJSON());
//     this.locked = false;
//     this.redoStack = [];
//     this.stateStack = [];
//   }
//
//   saveState() {
//     if (!this.locked) {
//       if (this.stateStack.length === this.maxCount) {
//         //Drop the oldest element
//         this.stateStack.shift();
//       }
//
//       //Add the current state
//       this.stateStack.push(this.currentState);
//
//       //Make the state of the canvas the current state
//       this.currentState = JSON.stringify(this.canvas.toDatalessJSON());
//
//       //Reset the redo stack.
//       //We can only redo things that were just undone.
//       this.redoStack.length = 0;
//     }
//   }
//
//   //Pop the most recent state. Use the specified callback method.
//   undo(callback?: Function) {
//     if (this.stateStack.length > 0)
//       this.applyState(this.redoStack, this.stateStack.pop(), callback);
//   }
//
//   //Pop the most recent redo state. Use the specified callback method.
//   redo(callback?: Function) {
//     if (this.redoStack.length > 0)
//       this.applyState(this.stateStack, this.redoStack.pop(), callback);
//   }
//
//   //Root function for undo and redo; operates on the passed-in stack
//   private applyState(stack: string[], newState: string | undefined, callBack?: Function) {
//     //Push the current state
//     stack.push(this.currentState);
//
//     //Make the new state the current state
//     this.currentState = newState || '';
//
//     //Lock the stacks for the incoming change
//     const thisStateManager = this;
//     this.locked = true;
//
//     //Update canvas with the new current state
//     this.canvas.loadFromJSON(JSON.parse(this.currentState), function () {
//       if (callBack !== undefined)
//         callBack();
//
//       //Unlock the stacks
//       thisStateManager.locked = false;
//     });
//   }
// }
