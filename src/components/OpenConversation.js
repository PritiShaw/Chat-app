import React, { useState, useCallback } from 'react'
import { Form, InputGroup, Button, Input, Modal } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider';

export default function OpenConversation() {
  const [text, setText] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [modal_img, setModalImg] = useState("")
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
    files.map(file => {
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
      <nav className="navbar navbar-light bg-light">  
        <div className="navbar-brand active " ><em className="lead"><img src={"https://www.gravatar.com/avatar/" + selectedConversation.recipients.map(r=>r.name).join(" , ") + "?d=identicon&r=PG"}  className="w-25 mr-2 border-dark border rounded-circle" />{selectedConversation.recipients.map(r=>r.name).join(" , ")}</em></div>
      </nav>
      <div className="flex-grow-1 overflow-auto">
        <div className="d-flex flex-column align-items-start justify-content-end px-5 pt-3 ">
          {selectedConversation.messages.map((message, index) => {
            const lastMessage = selectedConversation.messages.length - 1 === index
            return (
              <div
                ref={lastMessage ? setRef : null}
                key={index}
                className={`my-2 d-flex flex-column ${message.fromMe ? 'align-self-end align-items-end' : 'align-items-start'}`}
              >
                <div className="text-muted small"><strong>{(selectedConversation.recipients.length > 1 && !message.fromMe) ? message.senderName : null}</strong></div>
                <div
                  className={`rounded px-2 py-1 border text-white bg-${message.fromMe ? 'primary' : 'secondary'}`} style={{ display: (message.text.startsWith("data:image/") ? "contents" : null) }}>
                  {message.text.startsWith("data:image/") ? <div className="w-50"><img onClick={() => { setModalImg(message.text); setModalOpen(true) }} src={message.text} className="w-100 float-right" /></div> : message.text}
                  <div className="clear-fix" />
                </div>
                <div className={`text-muted small  ${message.fromMe ? 'text-right' : ''}`} style={{ lineHeight: "1" }}>
                  <em>{new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</em>
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
              placeholder="Type a message"
              required
              value={text}
              onChange={e => setText(e.target.value)}
              style={{ resize: 'none' }}
            />
            <InputGroup.Append>
              <Button className="btn-light border " onClick={() => fileField.current.click()}>📷</Button>
              <Form.File
                ref={fileField}
                label=""
                className="d-none"
                accept=".jpeg,.jpg,.png"
                onChange={handleFileSelected}
                ref={fileField}
                custom
              />
              <Button type="submit" className="btn-secondary">Send</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Form>
      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <img src={modal_img} style={{maxWidth:"100%"}} />
      </Modal>
    </div>
  )
}
