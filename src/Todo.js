import { deleteDoc, doc, setDoc } from "@firebase/firestore"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import EditIcon from "@mui/icons-material/Edit"
import { List, ListItem, ListItemText, Modal, Button } from "@mui/material"
import React, { useState } from "react"
import { db } from "./firebase/firebase-config"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
}))

function Todo(props) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState()

  const updateTodo = () => {
    setDoc(doc(db, "todos", props.todo.id), { todo: input }, { merge: true })
    setOpen(false)
  }

  return (
    <>
      <Modal open={open} onClose={(e) => setOpen(false)}>
        <div className={classes.paper}>
          <form>
            <input
              placeholder={props.todo.todo}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button disabled={!input} type="submit" onClick={updateTodo}>
              update todo
            </Button>
          </form>
        </div>
      </Modal>

      <List
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingRight: "40px"
        }}
      >
        <ListItem
          style={{
            background: "linear-gradient(315deg, #182b3a 0%, #20a4f3 74%)",
            borderRadius: "5px",
            width: "500px",
          }}
        >
          <ListItemText primary="Todo" secondary={props.todo.todo} />
          <EditIcon
            style={{ color: "blue", cursor: "pointer" }}
            onClick={(e) => setOpen(true)}
          />
          <DeleteForeverIcon
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => {
              deleteDoc(doc(db, "todos", props.todo.id))
            }}
          />
        </ListItem>
      </List>
    </>
  )
}

export default Todo
