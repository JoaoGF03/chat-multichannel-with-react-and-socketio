import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useChannelContext } from "../hooks/useChannelContext"

export const Chat = () => {
  const [message, setMessage] = useState('')
  const { userName, channel, createMessage, joinChannel } = useChannelContext()
  const { channelId } = useParams<{ channelId: string }>()
  const navigate = useNavigate()
  const divRef = useRef<HTMLDivElement>(null)

  const goToBottom = () => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current?.scrollHeight
    }
  }

  useEffect(() => {
    goToBottom()
  }, [channel?.messages])

  useEffect(() => {
    if (!channelId) {
      navigate('/channels')
      return
    }

    if (!userName) {
      navigate('/login')
      return
    }

    joinChannel(channelId)
  }, [])


  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h5># {channel?.name}</h5>
        <Link to='/channels'>Voltar</Link>
      </div>

      <div
        ref={divRef}
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
        }}>
        {channel?.messages.map((message, i) =>
          <div key={i}>
            <strong>{message.userName}</strong>: {message.message}
          </div >
        )}

      </div>

      <form onSubmit={e => {
        e.preventDefault()
        createMessage(message)
        setMessage('')
      }}>
        <input
          type="text"
          placeholder="Digite sua mensagem"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  )
}
