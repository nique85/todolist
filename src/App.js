import React, { useState } from 'react';
import './App.css';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import _ from 'lodash';
import {v4} from "uuid";

const item1 = {
  id: v4(),
  name: "Project Discussion"
}

const item2 = {
  id: v4(),
  name: "Project Design"
}

function App() {
  const [state, setState] = useState({
    "todo": { 
        title: "Todo", 
        items: [item1] 
    },
    "not-done": { 
        title: "Not-Done", 
        items: [item2] 
    },
    "done": { 
        title: "Completed", 
        items: [] 
    }
  })

  const [text, setText] = useState("")

  const handleDragEnd = ({destination, source}) => {
    // console.log("From ", source)
    // console.log("To ", destination)

    if (!destination) {
      return
    }

    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      return
    }

    const itemCopy = {...state[source.droppableId].items[source.index]}
    // console.log(itemCopy)

    setState( prev => {
      prev = {...prev}
      //Remove item from previous array
      prev[source.droppableId].items.splice(source.index, 1)

      //Adding new item to destination array
      prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)


      return prev
    })
  }

  const addItem = () => {
    setState(prev => {
      return {
        ...prev,
        todo: {
          title: "Todo",
          items: [
            {
              id: v4(),
              name: text
            },
            ...prev.todo.items
          ]
        }
      }
    })

    setText("")
  }

  return (

    <div>
      <div className="header">
          <h2>Enter your task</h2>
          <input type="text" value={text} onChange={ (event) => setText(event.target.value)} />
          <button onClick={addItem}>Add</button>
      </div>
          
      
    <div className="App">

      <DragDropContext onDragEnd={handleDragEnd}>
          {_.map(state, (data, key) => {
            return(
                <div key={key} className={"column"}>
                    <h3>{data.title}</h3>
                    <Droppable droppableId={key}>
                      { (provided) => {
                          return(
                            <div 
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={key}
                              // className={"droppable-col"}
                            >
                                {data.items.map((element, index) => {
                                    return(
                                      <Draggable key={element.id} index={index} draggableId={element.id}>
                                          {(provided) => {
                                              return(
                                                <div
                                                    className={"item"}
                                                    // className={key}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    {element.name}
                                                </div>
                                              )
                                          }}
                                      </Draggable>
                                    )
                                })}
                                {provided.placeholder}
                            </div>
                          )
                      }}
                  </Droppable>
                </div>
            )
          } )}
      </DragDropContext>
    </div>
    </div>
  );
}

export default App;
