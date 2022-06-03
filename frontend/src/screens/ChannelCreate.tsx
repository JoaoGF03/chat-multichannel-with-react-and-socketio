import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useChannelContext } from "../hooks/useChannelContext"

export const ChannelCreate = () => {
  const [channelName, setChannelName] = useState('')
  const { userName, createChannel } = useChannelContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!userName) {
      navigate('/login')
      return
    }
  }, [])

  return (
    <form onSubmit={
      (e) => {
        e.preventDefault()
        createChannel(channelName)
        setChannelName('')
      }}
    >
      <p>Nome do canal</p>
      <input
        type="text"
        placeholder="Nome do canal"
        value={channelName}
        onChange={(e) => {
          setChannelName(e.target.value)
        }} />
      <button type="submit">Criar</button>
    </form>
  )
}
