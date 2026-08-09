export default defineTask({
  meta: {
    name: 'db:seed',
  },
  async run() {
    const { result: userResult } = await runTask<{ users: string[] }>('db:seed:users')

    return {
      result: {
        ...userResult || {},
      },
    }
  },
})
