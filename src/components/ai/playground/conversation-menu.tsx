interface Props {
  conversation: ChatConversation;

  onRename: () => void;

  onDuplicate: () => void;

  onFavorite: () => void;

  onPin: () => void;

  onDelete: () => void;
}