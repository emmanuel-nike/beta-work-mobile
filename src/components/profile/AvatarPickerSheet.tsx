import { useMemo } from 'react';

import { ActionSheet, type ActionSheetOption } from '../common/ActionSheet';
import { CameraIcon, GalleryIcon, TrashIcon } from '../icons';

type AvatarPickerSheetProps = Readonly<{
  visible: boolean;
  /** Enables "Delete Photo"; the row is always shown so it stays discoverable. */
  hasPhoto: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onChooseFromGallery: () => void;
  onRemovePhoto: () => void;
}>;

export function AvatarPickerSheet({
  visible,
  hasPhoto,
  onClose,
  onTakePhoto,
  onChooseFromGallery,
  onRemovePhoto,
}: AvatarPickerSheetProps) {
  const options = useMemo<readonly ActionSheetOption[]>(
    () => [
      { id: 'camera', label: 'Take Photo', Icon: CameraIcon, onPress: onTakePhoto },
      {
        id: 'gallery',
        label: 'Choose Photo',
        Icon: GalleryIcon,
        onPress: onChooseFromGallery,
      },
      {
        id: 'delete',
        label: 'Delete Photo',
        Icon: TrashIcon,
        destructive: true,
        disabled: !hasPhoto,
        onPress: onRemovePhoto,
      },
    ],
    [hasPhoto, onChooseFromGallery, onRemovePhoto, onTakePhoto],
  );

  return (
    <ActionSheet
      onClose={onClose}
      options={options}
      title="Edit profile picture"
      visible={visible}
    />
  );
}
