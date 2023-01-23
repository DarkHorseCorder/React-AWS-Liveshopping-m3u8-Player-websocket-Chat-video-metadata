// import logo from './logo.svg';
import React, { useEffect, useState, createRef } from 'react';
import {BrowserView, MobileView} from 'react-device-detect';
import * as config from './config';
import heart from './heart.png'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { BiBox } from 'react-icons/bi';
import {AiOutlineShoppingCart , AiOutlineHeart} from 'react-icons/ai'
import {GoLocation} from 'react-icons/go'
import {IoIosCash} from 'react-icons/io'
import {IoCopyOutline} from 'react-icons/io5'
import {BsChatTextFill, BsChevronLeft , BsChevronRight , BsBoxArrowUp , BsBook , BsThreeDots , BsClock , BsChevronDown} from 'react-icons/bs'
import {HiOutlineShoppingBag} from 'react-icons/hi'
import {TiArrowRightOutline} from 'react-icons/ti'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import './App.css';
import { render } from '@testing-library/react';
import BubbleHearts from 'bubble-hearts'

import VideoPlayer from './videoPlayer/VideoPlayer';
import ProductList from './productList/ProductList'
const stage = new BubbleHearts();

function App() {

  const [modalshow, setModalShow] = useState(false);
  const [namestate , setNameState] = useState(false)
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [connection, setConnection] = useState(null);
  const inputRef = createRef();
  const [currentProductId, setCurrentProductId] = useState('')
  const [tabkey, setTabKey] = useState('production');

  const canvas = stage.canvas;
  canvas.width = 100;
  canvas.height = 250;
  let image = new Image;
  image.src = heart;
  image.onload = () => {
  };

  useEffect(() => {

    const initConnection = async () => {
      const connectionInit = new WebSocket(config.CHAT_WEBSOCKET);
      connectionInit.onopen = (event) => {
        console.log("WebSocket is now open.");
      };
    
      connectionInit.onclose = (event) => {
        console.log("WebSocket is now closed.");
      };
    
      connectionInit.onerror = (event) => {
        console.error("WebSocket error observed:", event);
      };
    
      connectionInit.onmessage = (event) => {
        // append received message from the server to the DOM element 
        const data_tmp = event.data.split(':');
        const messagetype = data_tmp[0].slice(2, -1);
        let message_username = "";
        let message_content = "";
        if(messagetype == "systemMessage"){
          message_username = "Bambuser";
          message_content = data_tmp[1].slice(1,-2);
        }
        if(messagetype == "publicMessage"){
          const data_tmp = event.data.split(':');
          const message_data = data_tmp[1].split('-');
          message_username = message_data[0].slice(1,-1);
          message_content = message_data[1].slice(1,-2);
        }
        if(messagetype == "bubbleMessage"){
          console.log('first')
          showbubble()
        }
        if(message_username && message_content){
        const newMessage = {
          timestamp: Date.now(),
          message_username,
          message_content
        }
        setMessages((prevState) => {
          return [
            ...prevState,
            newMessage
          ];
        });
      }
        /////////////////////////completed/////////////////////////////////////
        let msgBox=document.getElementById('msg_box');
        msgBox.scrollTop=msgBox.scrollHeight-msgBox.clientHeight;
        /////////////////////////completed/////////////////////////////////////
      };
      setConnection(connectionInit);
    }
    initConnection();
  }, [])

  const handleChange = e => {
    setMessage(e.target.value);
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) { // keyCode 13 is carriage return
      if (message) {
        const data = `{
          "action": "sendmessage",
          "message": "${message.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"
        }`;
        connection.send(data);
        setMessage('');
      }
    }
  }

  const parseUrls = (userInput) => {
    var urlRegExp = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g;
    let formattedMessage = userInput.replace(urlRegExp, (match) => {
      let formattedMatch = match;
      if (!match.startsWith('http')) {
        formattedMatch = `http://${match}`;
      }
      return `<a href=${formattedMatch} class="chat-line__link" target="_blank" rel="noopener noreferrer">${match}</a>`;
    });
    return formattedMessage;
  }
  
  const handleClose = () => {
    setModalShow(false)
  };
  const handleShow = () => setModalShow(true);

  const handleSaveName = () => {
    console.log(username)
    if (username) {
      const data = `{
        "action": "setname",
        "name": "${username}"
      }`;
      connection.send(data);
      setUsername('');
    }
    setModalShow(false)
    setNameState(true)
  }
  const showsticker = () => {
      const data = `{
        "action": "startbubble",
        "data" : "bubble",
      }`;
      connection.send(data);
      
  }

  const showbubble = () => {
    var myVar = setInterval(function () {
      console.log(++bubble_count);
      if (bubble_count === 5) {
        clearInterval(myVar);
        bubble_count = 0;
      }
      stage.bubble(image);
      console.log(image.src)
    }, 300);
    //  setTimeout(clearInterval(myVar), 3000)
  }
  
  useEffect(() => {
    document.getElementById('heart-bubble').appendChild(canvas);
  }, []);
  var bubble_count = 0;

  return (
    <div className="App">
      <BrowserView style={{height : '100%'}}>
        <div className='row' style={{margin:'0px',height : '100%'}}>
          <div className='col-lg-4 col-md-3  d-flex flex-column  production_area'  style={{height : '100%'}}>
            <Tabs defaultActiveKey="production" id="uncontrolled-tab-example" className="pt-3" onSelect={(k) => setTabKey(k)}>
              <Tab eventKey="production" title={<span style={{color : '#ff5050'}}>
                <BiBox style={{width : '30px', height : '30px'}}/><span style={{display : tabkey == "production" ? "inline" : "none"}}>Production</span></span>}>
                <ProductList style = {{width : "100%"}}/>
              </Tab>
              {/* <Tab eventKey="shoppingcart" title={<span style={{color : '#ff5050',}}>
                <AiOutlineShoppingCart style={{width : '30px', height : '30px'}}/><span style={{display : tabkey == "shoppingcart" ? "inline" : "none"}}>shoppingcart</span></span>}>
              </Tab>
              <Tab eventKey="location" title={<span style={{color : '#ff5050'}}><GoLocation style={{width : '30px', height : '30px'}}/><span style={{display : tabkey == "location" ? "inline" : "none"}}>location</span></span>}>
              </Tab>
              <Tab eventKey="payment" title={<span style={{color : '#ff5050'}}><IoIosCash style={{width : '30px', height : '30px'}}/><span style={{display : tabkey == "payment" ? "inline" : "none"}}>payment</span></span>}>
              </Tab> */}
            </Tabs>
            {/* <div className='Production_footer mt-auto'>
              <Button variant="danger" style={{marginBottom : '5%'}}>View Cart</Button>
            </div> */}
            
          </div>
          <div className='col-lg-4 col-md-6 video_area' style={{height : "100%"}}>
            <div className='player_tool d-flex flex-column'  style={{zIndex : '1'}}>
              <div className='d-flex justify-content-between'>
                <Button variant="danger" className='mt-3 ms-3'>Live</Button>
                <BsChevronDown style={{width : '30px', height : '30px'}} className = 'mt-3 me-3 text-white'/>
              </div>
              <div className='mt-auto d-flex justify-content-end' id = 'heart-bubble'>

              </div>
              <div className='player_tool_bottom'>
                <div className='row' style={{borderTop : 'solid 1px', margin : '0px'}}>
                  <div className='col-6'>

                  </div>
                  <div className='col-6'>
                    <div className='align-middle d-flex justify-content-between text-white py-3'>
                      <BsClock style={{width : '30px', height : '30px'}} className='mouse_pointer'/>
                      <HiOutlineShoppingBag style={{width : '30px', height : '30px'}} className='mouse_pointer'/>
                      <TiArrowRightOutline style={{width : '30px', height : '30px'}} className='mouse_pointer'/>
                      <AiOutlineHeart style={{width : '30px', height : '30px'}} className='mouse_pointer' onClick={showsticker}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='video_player' style = {{height : "100%" , zIndex : '-1'}}>
              <VideoPlayer style = {{height : "100%"}}  setMetadataId={setCurrentProductId} videoStream={config.PLAYBACK_URL} />
            </div>
          </div>
          <div className='col-lg-4 col-md-3 chat_area d-flex flex-column bd-highlight mb-3'>
            <div className='ChatAreaHeader py-2'>
              <div className='row'>
                <div className='col-4 col-sm-3 col-md-12 col-lg-3'>
                  <img className='seller_img rounded-circle' src={require('./assets/seller/seller1.jpg')} style = {{width: '80%' , height : 'auto'}}></img>
                </div>
                <div className='col-8 col-sm-9 col-md-12 col-lg-9 seller_info pt-3'>
                  <p className='seller_name text-start fw-bold'>indraifashion</p>
                  <p className='seller_id text-start'>@indraifashion</p>
                </div>
              </div>
            </div>
            <div id='msg_box' className='ChatMessages p-2' style={{overflowY : 'scroll', overflowX : 'hidden', height : '84vh'}}>
              {messages.length>0 && messages.map(msg => {
                let formattedMessage = parseUrls(msg.message_content);
                return (
                  <div className="chat-line" key={msg.timestamp} style = {{width : 'fit-content'}}>
                    <p className='message text-start'><span className="username fw-bold">{msg.message_username} : </span><span dangerouslySetInnerHTML={{__html: formattedMessage}} /></p>
                  </div>
                )
              })}
            </div>
            <div className='chat_area_bottom mt-auto mb-3'>
              <Button variant="success" onClick={handleShow} style={{display: namestate ? 'none' : 'inline', marginBottom : '5%'}}>Start Chat</Button>
              <Modal show={modalshow} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Welcome to Live Shopping</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Please input your name please...
                  <div className='p-5'>
                    <input type={'text'} placeholder = 'User Name' ref={inputRef} value={username} onChange={(e) => setUsername(e.target.value)}></input>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={handleSaveName}>
                    Save Name
                  </Button>
                </Modal.Footer>
              </Modal>
              <div className='NewChat rounded-pill' style={{display: namestate ? 'block' : 'none'}}>
                <input id='chatinput' placeholder='Chat with seller' value={message}
                    maxLength={510}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}></input>
                <BsChatTextFill style={{width : '30px', height : '30px'}}/>
              </div>
            </div>
          </div>
        </div>
      </BrowserView>
      <MobileView style={{height: '100vh'}}>
        <div className='mobilemain'>
          <div className='m_videoplayer' style={{zIndex : '-1'}}>
            <VideoPlayer setMetadataId={setCurrentProductId} videoStream={config.PLAYBACK_URL} />
          </div>
          <div className='production_chat d-flex flex-column'  style={{zIndex : '1'}}>
            <div className='d-flex align-items-start flex-column'>
              <Button variant="danger" className='mt-3 ms-3'>Live</Button>
              <div className='mt-3 ms-3'>
                <a href='https://www.styley.co/cactus-en-pot/204-2365-me-fais-pas-crever-cactus.html#/66-base-fasciata'>
                  <div className='m_production_item my-2'>
                    <img src={require('./assets/production/production1.jpg')} style = {{width: '50px' , height : 'auto'}} alt = 'production'></img>
                  </div>
                </a>
              </div>
            </div>
            <div className=' mt-auto'>
              <div className='d-flex flex-column'>
                <div className='m_chat_messages ms-3 row' style = {{margin : '0px'}}>
                  <div id='msg_box' className='col-8' style={{overflowY : 'scroll', overflowX : 'hidden', height : '35vh'}}>
                    {messages.length>0 && messages.map(msg => {
                      let formattedMessage = parseUrls(msg.message_content);
                      return (
                        <div className="chat-line" key={msg.timestamp} style = {{width : 'fit-content'}}>
                          <p className='message text-start'><span className="username fw-bold">{msg.message_username} : </span><span dangerouslySetInnerHTML={{__html: formattedMessage}} /></p>
                        </div>
                      )
                    })}
                  </div>
                  <div className='col-4' id = 'heart-bubble' style={{paddingBottom : '0px'}}>

                  </div>
                </div>
                <div className='mt-auto' style={{borderTop : 'solid', padding : '10px'}}>
                  <div className='row' style={{margin: '0px'}}>
                    <div className='col-6 m_col'>
                      <Button variant="success" onClick={handleShow} style={{display: namestate ? 'none' : 'inline'}}>Start Chat</Button>
                      <Modal show={modalshow} onHide={handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Welcome to Live Shopping</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          Please input your name please...
                          <div className='p-5'>
                            <input type={'text'} placeholder = 'User Name' ref={inputRef} value={username} onChange={(e) => setUsername(e.target.value)}></input>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="primary" onClick={handleSaveName}>
                            Save Name
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      <div className='text-white' style={{display: namestate ? 'block' : 'none'}}>
                        <input className='m_chat_input text-white' id='chatinput' placeholder='Chat with seller' value={message}
                            maxLength={510}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}></input>
                      </div>
                    </div>
                    <div className='col-6 m_col'>
                      <div className='align-middle d-flex justify-content-between text-white'>
                        <BsThreeDots style={{width : '30px', height : '30px'}}/>
                        <BsClock style={{width : '30px', height : '30px'}}/>
                        <HiOutlineShoppingBag style={{width : '30px', height : '30px'}}/>
                        <AiOutlineHeart style={{width : '30px', height : '30px'}}  onClick={showsticker}/>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='mobilebottom d-flex justify-content-between'>
          <div className='m_bottom_item'>
            <BsChevronLeft className='m_bottom_item_icon  align-middle'/>
          </div>
          <div className='m_bottom_item '>
            <BsChevronRight className='m_bottom_item_icon'/>
          </div>
          <div className='m_bottom_item'>
            <BsBoxArrowUp className='m_bottom_item_icon'/>
          </div>
          <div className='m_bottom_item'>
            <BsBook className='m_bottom_item_icon'/>
          </div>
          <div className='m_bottom_item'>
            <IoCopyOutline className='m_bottom_item_icon'/>  
          </div> 
        </div>
      </MobileView>
    </div>
  );
}

export default App;
