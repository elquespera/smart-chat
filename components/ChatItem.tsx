import { useState, useRef, useEffect, useContext } from "react";
import clsx from "clsx";
import useChatId from "hooks/useChatId";
import Link from "next/link";
import Spinner from "./Spinner";
import IconButton from "./IconButton";
import useTranslation from "hooks/useTranslation";
import { lng } from "assets/translations";
import ClickAwayListener from "react-click-away-listener";
import { AppContext } from "context/AppContext";

interface ChatItemProps {
  title?: string;
  id?: string;
  updating?: boolean;
  editing?: boolean;
  onClick?: (id?: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onEditSubmit?: (id: string, title: string) => void;
  onEditCancel?: () => void;
}

export default function ChatItem({
  title,
  id,
  updating,
  editing,
  onClick,
  onDelete,
  onEdit,
  onEditSubmit,
  onEditCancel,
}: ChatItemProps) {
  const t = useTranslation();
  const chatId = useChatId();
  const [editingTitle, setEditingTitle] = useState(title || "");
  const [isAnimating, setIsAnimating] = useState(false);
  const { updatedChat } = useContext(AppContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (onClick) onClick(id);
  };

  const handleDelete = () => {
    if (id && onDelete) onDelete(id);
  };

  const handleEdit = () => {
    if (id && onEdit) onEdit(id);
  };

  const handleEditSubmit = () => {
    if (id && onEditSubmit && editingTitle) {
      if (editingTitle === title) {
        handleEditCancel();
      } else {
        onEditSubmit(id, editingTitle);
      }
    }
  };

  const handleEditCancel = () => {
    setEditingTitle(title || "");
    if (editing && onEditCancel) onEditCancel();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleEditCancel();
    } else if (e.key === "Enter") {
      handleEditSubmit();
    }
  };

  useEffect(() => {
    const input = inputRef.current;
    if (editing && input) {
      input.focus();
      input.select();
    }
  }, [editing]);

  useEffect(() => {
    setEditingTitle(title || "");
  }, [title]);

  useEffect(() => {
    setIsAnimating(!!id && id === updatedChat?.id);
  }, [updatedChat]);

  return (
    <li
      className={clsx(
        `relative flex gap-1 overflow-hidden rounded-md
         w-full h-10 flex-shrink-0 pl-2`,
        editing
          ? "outline -outline-offset-2 outline-2 outline-accent"
          : chatId === id
          ? "text-contrast bg-accent"
          : "hover:bg-highlight"
      )}
    >
      {editing ? (
        <ClickAwayListener onClickAway={handleEditCancel}>
          <div className="flex flex-1 items-center">
            <input
              ref={inputRef}
              value={editingTitle}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="bg-transparent outline-none flex-1"
            />
            <IconButton icon="check" onClick={handleEditSubmit} />
            <IconButton icon="close" onClick={handleEditCancel} />
          </div>
        </ClickAwayListener>
      ) : (
        <>
          <Link
            href={`/${id || ""}`}
            onClick={handleClick}
            title={title}
            className={clsx(
              "relative flex-grow whitespace-nowrap overflow-hidden text-ellipsis pt-2",
              !id && "text-center"
            )}
          >
            <span
              className={clsx(isAnimating && "animate-appear")}
              onAnimationEnd={() => setIsAnimating(false)}
            >
              {title}
            </span>
          </Link>
          {id && chatId === id && (
            <div className="flex items-center flex-shrink-0">
              {updating ? (
                <Spinner className="w-8 h-8 p-1" />
              ) : (
                <>
                  <IconButton
                    icon="edit"
                    title={t(lng.editChatTitle)}
                    onClick={handleEdit}
                  />
                  <IconButton
                    icon="delete"
                    title={t(lng.deleteChat)}
                    onClick={handleDelete}
                  />
                </>
              )}
            </div>
          )}
        </>
      )}
    </li>
  );
}
