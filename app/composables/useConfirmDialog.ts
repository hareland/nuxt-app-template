import { LazyConfirmDialog } from '#components'

export interface ConfirmDialogOptions {
  title: string
  description?: string
}

export const useConfirmDialog = () => {
  const overlay = useOverlay()

  return (options: ConfirmDialogOptions): Promise<boolean> => {
    const modal = overlay.create(LazyConfirmDialog, {
      destroyOnClose: true,
      props: options,
    })

    return modal.open()
  }
}
