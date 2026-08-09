import { LazySearchDialog } from '#components'

export const useSearch = () => {
  const searchConfig = useAppConfig()?.search || {}
  const overlay = useOverlay()

  const openSearchModal = async () => {
    const searchOverlay = overlay.create(LazySearchDialog, {
      destroyOnClose: true,
      props: {},
    })

    return searchOverlay.open()
  }

  const searchKbds = computed<string[]>(() => {
    return searchConfig.kbds && searchConfig.kbds.length > 0 ? searchConfig.kbds : ['meta', 'K']
  })

  return {
    openSearchModal,
    searchKbds,
  }
}
