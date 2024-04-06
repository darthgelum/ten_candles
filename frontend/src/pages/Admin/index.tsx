import { useState } from "preact/hooks";
import { Home, getSocket, useMountEffect } from "../Home";
import * as preact from "preact";

export function Admin() {
  const [users, setUsers] = useState([] as string[])
  const textField = preact.createRef();
  localStorage.setItem("name", "Admin")
  const restartGame = () => {
    getSocket().emit("admin-restart", "Hello world!");

  }

  useMountEffect(() => {
    setTimeout(() => {
      getSocket().on("admin-users-res", (income: string) => {
        const data = JSON.parse(income) as string[]
        if (data && data.length > 0) {
          setUsers([...data])
        }
      });
    }, 4000)
    setInterval(() => {

      getSocket().emit("admin-users", "");

    }, 2000)
  })
  const userClick = (e: MouseEvent) => {
    const field = textField.current;
    const clicked = e.target as HTMLElement
    field.value = clicked.innerHTML + " "
    field.focus()
  }
  const sendMessage = () => {
    const field = textField.current;
    const text = field.value
    if (!text) {
      return
    }
    field.value = ""
    getSocket().emit("admin-send-message", JSON.stringify({ "message": text }))
  }
  return (
    <div>
      <button onClick={restartGame}>RestartGame</button>
      <textarea rows={20} cols={60} value={"asdasdasd\ntest\nasdasdasd"} readonly>


      </textarea>
      <ul>
        <li>Users</li>
        <li><a href="#" onClick={userClick}>[All]</a></li>
        {users?.map((u, i) => {
          // Return the element. Also pass key     
          return (<li><a href="#" onClick={userClick}>{u}</a></li>)
        })}
      </ul>
      <input ref={textField} type="text" />
      <button onClick={sendMessage}>Send</button>

      <Home />
    </div >
  );
}


