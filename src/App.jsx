import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
  Text,
  TextField,
  Heading,
  Flex,
  View,
  Image,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { getUrl } from "aws-amplify/storage";
import { uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import useWebSocket from "react-use-websocket";
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

export default function App() {
  const {lastMessage, sendMessage, readyState} = useWebSocket("wss://gocfr2qwf4.execute-api.us-east-2.amazonaws.com/dev");
 // const buttons = ["B1", "B2", "B3"];
  const [notes, setNotes] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [toggles, setToggles] = useState([]);
  const [text, setText] = useState('');
  const [errorMsg, setError] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [toggleStates, setToggleStates]     = useState([]);
  const [errorMsgReceived, setErrorMsg] = useState('');

  useEffect(() => {
    if(lastMessage === null){
      return;
    }

    const parsedMsg = JSON.parse(lastMessage.data);
    if (parsedMsg.action === "msg"){
      if (parsedMsg.type === "error"){
        setErrorMsg(parsedMsg.body || "error");
      }
      else{
        return;
      }
    }
    else{
      return;
    }
    



  }, [lastMessage]);

  const ButtonList = ({items}) => {
    return (
      <div className="m-4">
        <Flex>
        {items.map((item, index) => (
        <div>
        <button className="action" type="submit" variation="primary" 
          onClick={(event) => sendMessage(JSON.stringify({
                                          action: "msg",
                                          type: "cmd",
                                          body: {item}
                                          }))}>
          {item}
        </button>
        <div style={{ display: 'grid', gridAutoFlow: 'column', gap: '0px' }}>
        </div>
          <button className="delete" type="submit" variation="primary" onClick={(event) => deleteButton(index)}>
            delete 
          </button>   
        </div>
      ))}
      </Flex>
    </div>
    );
  }

  const ToggleList = ({items, states}) => {
    return (
      <div className="m-4">
        <Flex>
        {items.map((item, index) => (
        <div>
        <button className="action" type="submit" variation="primary" onClick={(event) => handleToggle(index)}>
            {item} {states[index] ? 'On' : 'Off'}
          </button> 
        <div style={{ display: 'grid', gridAutoFlow: 'column', gap: '0px' }}>
        </div>
          <button className="delete" type="submit" variation="primary" onClick={(event) => deleteToggle(index)}>
            delete 
          </button>   
        </div>
      ))}
      </Flex>
    </div>
    );
  }

  
  const handleToggle = (index) => {
    let copyArray = JSON.parse(JSON.stringify(toggleStates));
    copyArray[index] = !copyArray[index]
    setToggleStates(copyArray);
};

  
  const handledropdown = (event) => {
      setSelectedOption(event.target.value);
  };
  const handleChange = (event) => {
    setText(event.target.value);
  };
  function deleteToggle(index){
    let copyArray = JSON.parse(JSON.stringify(toggles));
    copyArray.splice(index, 1);
    setToggles(copyArray);

    let copyArray2 = JSON.parse(JSON.stringify(toggleStates));
    copyArray2.splice(index, 1);
    setToggleStates(copyArray2);
  }
  function deleteButton (index){
    let copyArray = JSON.parse(JSON.stringify(buttons));
    copyArray.splice(index, 1);
    setButtons(copyArray);
  }
  function makeButton() {
    if(text !== ''){
      if (selectedOption !== ''){
         if (selectedOption === 'button'){
          setButtons([...buttons, text]);
          setText('');
          setError('');
         } else {
          setToggles([...toggles, text]);
          setToggleStates([...toggleStates, false]);
          setText('');
          setError('');
         }
        } else{
            setError('Invalid interface type')
        }
      
      } else{
          setError('No text entered!');
      }
    
    
  }


    return (
      <div className="App">
    
        <h1>ESP32 UI</h1>

        <div>
          <input
            type="text"
            id="userTextbox"
            value={text}
            onChange={handleChange}
            placeholder="Type something..."
          />
        </div>

        

        <div className="m-4">
          <select id="dropdown" value={selectedOption} onChange={handledropdown}>
            <option value="">Select...</option>
            <option value="button">Button</option>
            <option value="toggle">Toggle</option>
          </select>
        </div>

        <p className="error">{errorMsg}</p>
      
        <Flex >
        <Button  type="submit" variation="primary" onClick={makeButton}>
           make button
        </Button>
        </Flex>
        <ButtonList items={buttons}/>
        <ToggleList items={toggles} states={toggleStates}/>
        <p className="error">{errorMsgReceived}</p>
      </div>
    );
}