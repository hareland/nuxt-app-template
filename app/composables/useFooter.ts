export const useFooter = () => {
  const $appConfig = useAppConfig()
  const icon = computed(() => $appConfig.footer.icon)
  return {
    icon,
  }
}
