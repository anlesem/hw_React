import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getChatList, getChatCounter } from '../../store/chats/selectors';
import { addChatThunk, renameChatThunk, deleteChatThunk } from '../../store/chats/actions';
import {
  changeInitMessageThunk,
  deleteMessagesListThunk,
  initMessageThunk
} from '../../store/messages/actions';

import style from './ChatContain.module.scss';

import { ChatList } from '../ChatList/ChatList';
import { ChatButtons } from '../ChatButtons/ChatButtons';
import { ChatForm } from '../ChatForm/ChatForm';

export const ChatContain = () => {
  const dispatch = useDispatch();
  const chats = useSelector(getChatList);
  const counter = useSelector(getChatCounter);
  const [checked, setChecked] = useState([0]);
  const scrollChats = useRef(null);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleAdd = () => {
    dispatch(addChatThunk(counter + 1));
    dispatch(initMessageThunk(counter + 1));
    scrollChats.current.scrollTop =
      scrollChats.current.scrollHeight - scrollChats.current.clientHeight;
  };

  const handleDelete = (checked) => {
    checked.forEach((id) => {
      dispatch(deleteChatThunk(id));
      dispatch(deleteMessagesListThunk(id));
    });
    setChecked([0]);
  };

  const changeNameChat = (text) => {
    dispatch(renameChatThunk(checked[1], text));
    dispatch(changeInitMessageThunk(checked[1], text));
    setChecked([0]);
  };

  return (
    <div className={style.wrap}>
      <ChatList data={{ handleToggle, chats, checked, scrollChats }} />
      <ChatButtons data={{ handleAdd, handleDelete, checked }} />
      {checked.length === 2 && <ChatForm data={{ changeNameChat, checked }} />}
    </div>
  );
};
