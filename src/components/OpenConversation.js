import React, { useState, useCallback } from 'react'
import { Form, InputGroup, Button, Input } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider';

export default function OpenConversation() {
  const [text, setText] = useState('')
  const setRef = useCallback(node => {
    if (node) {
      node.scrollIntoView({ smooth: true })
    }
  }, [])
  const fileField = React.useRef(null)

  const { sendMessage, selectedConversation } = useConversations()

  function handleSubmit(e) {
    e.preventDefault()

    sendMessage(
      selectedConversation.recipients.map(r => r.id),
      text
    )
    setText('')
  }

  const handleFileSelected = (e) => {
    const files = Array.from(e.target.files)
    const images = []
    files.map( file=>{
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        sendMessage(
          selectedConversation.recipients.map(r => r.id),
          reader.result
        )
      };
      reader.onerror = error => alert(error);
    })
    console.log("files:", images)
  }

  return (
    <div className="d-flex flex-column flex-grow-1 border-left border-secondary">
      <div className="flex-grow-1 overflow-auto">
        <div className="d-flex flex-column align-items-start justify-content-end px-5 pt-3 ">
          {selectedConversation.messages.map((message, index) => {
            const lastMessage = selectedConversation.messages.length - 1 === index
            return (
              <div
                ref={lastMessage ? setRef : null}
                key={index}
                className={`my-1 d-flex flex-column ${message.fromMe ? 'align-self-end align-items-end' : 'align-items-start'}`}
              >
                <div
                  className={`rounded px-2 py-1 border text-white bg-${message.fromMe ? 'primary' : 'secondary'}`} style={{display:(message.text.startsWith("data:image/")?"contents":null)}}>
                  {message.text.startsWith("data:image/")?<div className="w-75"><img src={message.text} className="w-100 float-right"/></div>:message.text}
                  <div className="clear-fix"/>
                </div>
                <div className={`text-muted small ${message.fromMe ? 'text-right' : ''}`}>
                  {message.fromMe ? 'You' : message.senderName}
                </div>
                <div className={`text-muted small ${message.fromMe ? 'text-right' : ''}`}>
                  {/* new Date(message.time).toLocaleTimeString() */}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="m-2">
          <InputGroup>
            <Form.Control
              required
              value={text}
              onChange={e => setText(e.target.value)}
              style={{ resize: 'none' }}
            />
            <InputGroup.Append>
              <Button className="btn-secondary" onClick={()=>fileField.current.click()}>📷</Button>
              <Form.File
                ref={fileField}
                label=""                
                className="d-none"
                accept=".jpeg,.jpg,.png"
                onChange={handleFileSelected}
                ref={fileField}
                custom
               />
              <Button type="submit">Send</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Form>
    </div>
  )
}
